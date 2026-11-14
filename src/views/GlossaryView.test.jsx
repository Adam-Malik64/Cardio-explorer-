// Tests for Issue #4: Heart Health Glossary & Fact Cards.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GlossaryView from './GlossaryView';
import { filterTerms, MAX_QUERY_LENGTH, normaliseQuery } from '../components/glossary/filterTerms';
import { areas, terms } from '../mocks/glossary';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const search = () => screen.getByLabelText('Search terms');
const cardHeadings = () => screen.queryAllByRole('heading', { level: 3 }).map((h) => h.textContent);

describe('mock glossary data', () => {
  it('has unique ids, a known area and a definition for every term', () => {
    expect(new Set(terms.map((t) => t.id)).size).toBe(terms.length);
    for (const t of terms) {
      expect(Object.keys(areas)).toContain(t.area);
      expect(t.definition.length).toBeGreaterThan(20);
    }
  });

  it('every fact that contains a number has an https source', () => {
    for (const t of terms.filter((x) => x.fact && /\d/.test(x.fact))) {
      expect(t.source?.href, t.id).toMatch(/^https:\/\//);
    }
  });

  it('is sorted A to Z', () => {
    const names = terms.map((t) => t.term.toLowerCase());
    expect(names).toEqual([...names].sort());
  });
});

describe('filterTerms', () => {
  it('empty or whitespace-only query returns every term', () => {
    expect(filterTerms(terms, '')).toHaveLength(terms.length);
    expect(filterTerms(terms, '   \t ')).toHaveLength(terms.length);
    expect(filterTerms(terms, undefined)).toHaveLength(terms.length);
  });

  it('ignores case and extra spaces, and searches definitions too', () => {
    expect(filterTerms(terms, '  HEART   rate ').map((t) => t.id)).toContain('heart-rate');
    expect(filterTerms(terms, 'oxygen-rich').map((t) => t.id)).toContain('aorta');
  });

  it('treats regex and HTML characters as plain text', () => {
    expect(filterTerms(terms, '.*')).toHaveLength(0);
    expect(filterTerms(terms, '(')).toEqual(filterTerms(terms, '(').filter((t) => (t.term + t.definition).includes('(')));
    expect(filterTerms(terms, '(plural')).toHaveLength(1);
    expect(() => filterTerms(terms, '[')).not.toThrow();
    expect(filterTerms(terms, '<script>alert(1)</script>')).toHaveLength(0);
  });

  it('caps very long queries at the maximum length', () => {
    expect(normaliseQuery('a'.repeat(5000))).toHaveLength(MAX_QUERY_LENGTH);
  });

  it('combines search with the area filter (AND)', () => {
    const result = filterTerms(terms, 'rate', 'biometrics');
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((t) => t.area === 'biometrics')).toBe(true);
  });
});

describe('GlossaryView', () => {
  it('shows every term with a labelled search box and announces the count', () => {
    render(<GlossaryView />);
    expect(search()).toHaveAttribute('type', 'search');
    expect(cardHeadings()).toHaveLength(terms.length);
    expect(screen.getByRole('status')).toHaveTextContent(`${terms.length} terms shown`);
  });

  it('search updates as you type and the count follows', async () => {
    const user = userEvent.setup();
    render(<GlossaryView />);
    await user.type(search(), 'ventricle');
    // Matches term names and definitions (Atrium's definition mentions the ventricles)
    const expected = terms.filter((t) => `${t.term} ${t.definition}`.toLowerCase().includes('ventricle'));
    expect(cardHeadings()).toEqual(expected.map((t) => t.term));
    expect(cardHeadings()).toContain('Ventricle');
    expect(cardHeadings()).not.toContain('Pulse');
    expect(screen.getByRole('status')).toHaveTextContent(`${expected.length} terms shown`);
  });

  it('edge case: spaces-only search shows all terms', async () => {
    const user = userEvent.setup();
    render(<GlossaryView />);
    await user.type(search(), '     ');
    expect(cardHeadings()).toHaveLength(terms.length);
  });

  it('edge case: no matches shows the query as text and Clear search refocuses the box', async () => {
    const user = userEvent.setup();
    render(<GlossaryView />);
    await user.type(search(), 'zzzz');
    expect(screen.getByRole('status')).toHaveTextContent('No terms match');
    expect(screen.getByTestId('glossary-empty')).toHaveTextContent('No terms match “zzzz”.');

    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(search()).toHaveValue('');
    expect(search()).toHaveFocus();
    expect(cardHeadings()).toHaveLength(terms.length);
  });

  it('edge case: special characters are shown as plain text, never as HTML', async () => {
    const user = userEvent.setup();
    const { container } = render(<GlossaryView />);
    await user.type(search(), '<img src=x onerror=alert(1)>');
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByTestId('glossary-empty')).toHaveTextContent('<img src=x onerror=alert(1)>');
  });

  it('edge case: a very long pasted query is capped at 100 characters', async () => {
    const user = userEvent.setup();
    render(<GlossaryView />);
    search().focus();
    await user.paste('heart '.repeat(200));
    expect(search().value.length).toBeLessThanOrEqual(MAX_QUERY_LENGTH);
    expect(search()).toHaveAttribute('maxLength', String(MAX_QUERY_LENGTH));
  });

  it('the learning-area filter is a labelled radio group and combines with search', async () => {
    const user = userEvent.setup();
    render(<GlossaryView />);
    const group = screen.getByRole('group', { name: 'Learning area' });
    expect(within(group).getAllByRole('radio').map((r) => r.labels[0].textContent)).toEqual([
      'All',
      ...Object.values(areas),
    ]);
    await user.click(within(group).getByLabelText('Biometrics'));
    await user.type(search(), 'rate');
    const expected = filterTerms(terms, 'rate', 'biometrics').map((t) => t.term);
    expect(cardHeadings()).toEqual(expected);
  });

  it('flips a card with the keyboard; the definition is not in the page until flipped', async () => {
    const user = userEvent.setup();
    render(<GlossaryView />);
    const pulse = terms.find((t) => t.id === 'pulse');
    expect(screen.queryByText(pulse.definition)).not.toBeInTheDocument();

    const button = screen.getByRole('button', { name: 'Show definition of Pulse' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    button.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByText(pulse.definition)).toBeInTheDocument();
    const hide = screen.getByRole('button', { name: 'Hide definition of Pulse' });
    expect(hide).toHaveAttribute('aria-pressed', 'true');
    expect(hide).toHaveFocus();

    await user.keyboard(' '); // Space flips back
    expect(screen.queryByText(pulse.definition)).not.toBeInTheDocument();
  });

  it('hovering never flips a card', async () => {
    const user = userEvent.setup();
    render(<GlossaryView />);
    await user.hover(screen.getByRole('button', { name: 'Show definition of Pulse' }));
    expect(screen.queryByTestId('back-pulse')).not.toBeInTheDocument();
  });

  it('shows a source link for facts, separate from the flip button', async () => {
    const user = userEvent.setup();
    render(<GlossaryView />);
    await user.click(screen.getByRole('button', { name: 'Show definition of Resting heart rate' }));
    const back = screen.getByTestId('back-resting-heart-rate');
    expect(within(back).getByRole('link')).toHaveAttribute('href', expect.stringMatching(/^https:/));
  });

  it('Reset all cards flips every card back', async () => {
    const user = userEvent.setup();
    render(<GlossaryView />);
    await user.click(screen.getByRole('button', { name: 'Show definition of Pulse' }));
    await user.click(screen.getByRole('button', { name: 'Show definition of Valve' }));
    await user.click(screen.getByRole('button', { name: 'Reset all cards' }));
    expect(screen.queryAllByRole('button', { name: /^Hide definition/ })).toHaveLength(0);
  });

  it('edge case: an empty term list shows a friendly message', () => {
    render(<GlossaryView terms={[]} />);
    expect(screen.getByTestId('glossary-empty')).toHaveTextContent('There are no terms to show yet.');
  });

  it('stores nothing and makes no network requests while searching', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(() => Promise.reject());
    localStorage.clear();
    sessionStorage.clear();
    const user = userEvent.setup();
    render(<GlossaryView />);
    await user.type(search(), 'blood pressure');
    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
