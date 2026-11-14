// Tests for the About page and the site-wide footer disclaimer (Week 3, Task 4).
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import App from '../App';
import { DISCLAIMER } from '../content/disclaimer';
import { modules } from '../content/modules';

afterEach(cleanup);

const EXACT =
  'For education only. Not medical advice. In an emergency, call your local emergency number.';

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe('About page', () => {
  it('uses the exact disclaimer wording', () => {
    expect(DISCLAIMER).toBe(EXACT);
  });

  it('explains what Cardio Explorer is and links every module', () => {
    renderAt('/about');
    expect(screen.getByRole('heading', { level: 1, name: 'About Cardio Explorer' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'What it is' })).toBeInTheDocument();
    const main = screen.getByRole('main');
    for (const m of modules) {
      expect(within(main).getByRole('link', { name: m.title })).toHaveAttribute('href', `/modules/${m.slug}`);
    }
  });

  it('says it is a student learning project and that all data is synthetic', () => {
    renderAt('/about');
    expect(screen.getByRole('heading', { name: 'A student learning project' })).toBeInTheDocument();
    expect(screen.getByText(/is a student learning project/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'All data is synthetic' })).toBeInTheDocument();
    expect(screen.getByText(/synthetic, fake demo\s+data/)).toBeInTheDocument();
  });

  it('shows the exact disclaimer on the page', () => {
    renderAt('/about');
    expect(screen.getByTestId('about-disclaimer')).toHaveTextContent(EXACT);
  });

  it('is linked from the main navigation and the footer', () => {
    renderAt('/');
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getAllByRole('link', { name: /About/ })[0]).toHaveAttribute('href', '/about');
  });
});

describe('Footer disclaimer on every page', () => {
  const paths = ['/', '/modules', '/about', ...modules.map((m) => `/modules/${m.slug}`), '/no-such-page'];

  it.each(paths)('%s shows the exact disclaimer in the footer', (path) => {
    renderAt(path);
    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByTestId('footer-disclaimer')).toHaveTextContent(EXACT);
  });
});

describe('Review fixes: data vs facts, talk-to line, page titles', () => {
  it('separates synthetic demo data from sourced facts on the About page', () => {
    renderAt('/about');
    expect(screen.getByText(/All data in this app is synthetic, fake demo data/)).toBeInTheDocument();
    expect(screen.getByText(/The facts you learn are different/)).toBeInTheDocument();
  });

  it('the footer points students to a trusted adult and explains data vs facts', () => {
    renderAt('/');
    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByText(/talk to a parent, school nurse or doctor/)).toBeInTheDocument();
    expect(within(footer).getByText(/Demo numbers are simulated; facts are sourced/)).toBeInTheDocument();
  });

  it.each([
    ['/', 'Cardio Explorer'],
    ['/modules', 'Learning modules · Cardio Explorer'],
    ['/about', 'About · Cardio Explorer'],
    ['/no-such-page', 'Page not found · Cardio Explorer'],
    ...modules.map((m) => [`/modules/${m.slug}`, `${m.title} · Cardio Explorer`]),
  ])('%s has a unique page title', (path, title) => {
    renderAt(path);
    expect(document.title).toBe(title);
  });
});
