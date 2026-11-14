// Tests for Issue #3: Daily Habits & Cardiovascular Risk Quiz.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HabitsQuizView from './HabitsQuizView';
import { questions, takeaways, topics } from '../mocks/habitsQuiz';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const first = questions[0];
const rightText = (q) => q.options.find((o) => o.id === q.answer).text;
const wrongText = (q) => q.options.find((o) => o.id !== q.answer).text;

describe('mock question bank', () => {
  it('covers all five habit topics with at least two questions each', () => {
    for (const topic of Object.keys(topics)) {
      expect(questions.filter((q) => q.topic === topic).length).toBeGreaterThanOrEqual(2);
      expect(takeaways[topic]).toBeTruthy();
    }
  });

  it('every question has a valid answer, unique option ids and an https source', () => {
    for (const q of questions) {
      const ids = q.options.map((o) => o.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids).toContain(q.answer);
      expect(q.explanation.length).toBeGreaterThan(20);
      expect(q.source.href).toMatch(/^https:\/\//);
      expect(q.source.organisation).toBeTruthy();
      expect(q.source).toHaveProperty('checked');
    }
  });

  it('never uses personal-risk or diagnosis wording', () => {
    const allText = JSON.stringify({ questions, takeaways }).toLowerCase();
    for (const banned of ['your risk', 'risk score', 'diagnos', 'you are at risk', 'you have heart disease']) {
      expect(allText).not.toContain(banned);
    }
  });
});

describe('HabitsQuizView', () => {
  it('shows the first question as a labelled radio group inside a fieldset', () => {
    render(<HabitsQuizView />);
    const group = screen.getByRole('group', { name: first.question });
    expect(within(group).getAllByRole('radio')).toHaveLength(first.options.length);
    expect(screen.getByText(`Question 1 of ${questions.length}`, { exact: false })).toBeInTheDocument();
    expect(screen.getByLabelText(rightText(first))).toBeInTheDocument();
  });

  it('edge case: checking with no answer selected shows a hint and no feedback', async () => {
    const user = userEvent.setup();
    render(<HabitsQuizView />);
    await user.click(screen.getByRole('button', { name: 'Check answer' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Choose an answer first.');
    expect(screen.getByTestId('quiz-feedback')).toBeEmptyDOMElement();
  });

  it('a correct answer says "Correct!", shows the explanation and a source link', async () => {
    const user = userEvent.setup();
    render(<HabitsQuizView />);
    await user.click(screen.getByLabelText(rightText(first)));
    await user.click(screen.getByRole('button', { name: 'Check answer' }));

    const feedback = screen.getByTestId('quiz-feedback');
    expect(feedback).toHaveTextContent('Correct!');
    expect(feedback).toHaveTextContent(first.explanation);
    expect(within(feedback).getByRole('link')).toHaveAttribute('href', first.source.href);
    expect(feedback.closest('[aria-live]')).toHaveAttribute('aria-live', 'polite');
  });

  it('a wrong answer names the right one in words (not colour alone) and locks the options', async () => {
    const user = userEvent.setup();
    render(<HabitsQuizView />);
    await user.click(screen.getByLabelText(wrongText(first)));
    await user.click(screen.getByRole('button', { name: 'Check answer' }));

    expect(screen.getByTestId('quiz-feedback')).toHaveTextContent(`Not quite. The answer is: ${rightText(first)}.`);
    expect(screen.getByText('(Correct answer)')).toBeInTheDocument();
    expect(screen.getByText('(Your answer)')).toBeInTheDocument();
    for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Check answer' })).not.toBeInTheDocument();
  });

  it('works with the keyboard only: arrows pick, Enter checks, feedback then Next get focus', async () => {
    const user = userEvent.setup();
    render(<HabitsQuizView />);
    await user.tab(); // into the radio group (headings are not in the tab order)
    expect(screen.getAllByRole('radio')[0]).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getAllByRole('radio')[1]).toBeChecked();
    await user.keyboard('{Enter}');
    // Focus moves to the feedback so it is read first; Next is the next Tab stop
    expect(screen.getByTestId('quiz-feedback').firstChild).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('link')).toHaveFocus(); // the source link inside the feedback
    await user.tab();
    expect(screen.getByRole('button', { name: 'Next question' })).toHaveFocus();
    await user.keyboard('{Enter}');
    // The focused heading says where you are
    const heading = screen.getByRole('heading', { level: 3, name: new RegExp(`^Question 2 of ${questions.length}: `) });
    expect(heading).toHaveFocus();
    expect(heading).toHaveTextContent(topics[questions[1].topic]);
  });

  it('shows the education notice before starting and on the results screen', async () => {
    const user = userEvent.setup();
    render(<HabitsQuizView questionBank={questions.slice(0, 1)} />);
    expect(screen.getByRole('note')).toHaveTextContent('It does not check your own health');
    await user.click(screen.getByLabelText(rightText(first)));
    await user.click(screen.getByRole('button', { name: 'Check answer' }));
    await user.click(screen.getByRole('button', { name: 'See results' }));
    expect(screen.getByRole('note')).toHaveTextContent('It does not check your own health');
  });

  it('the quiz has no text or number inputs (no personal data entry)', () => {
    render(<HabitsQuizView />);
    expect(screen.queryAllByRole('textbox')).toHaveLength(0);
    expect(screen.queryAllByRole('spinbutton')).toHaveLength(0);
  });

  it('a full run gives a knowledge score, topic takeaways and Try again resets', async () => {
    const user = userEvent.setup();
    render(<HabitsQuizView />);
    for (const [i, q] of questions.entries()) {
      // Answer the first question wrong, the rest right
      await user.click(screen.getByLabelText(i === 0 ? wrongText(q) : rightText(q)));
      await user.click(screen.getByRole('button', { name: 'Check answer' }));
      await user.click(screen.getByRole('button', { name: i === questions.length - 1 ? 'See results' : 'Next question' }));
    }
    expect(screen.getByRole('heading', { name: 'Quiz complete' })).toHaveFocus();
    expect(screen.getByTestId('quiz-score')).toHaveTextContent(`You got ${questions.length - 1} of ${questions.length} right.`);
    expect(screen.getByText(/says nothing about your own health/)).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(Object.keys(topics).length);

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(screen.getByText(`Question 1 of ${questions.length}`, { exact: false })).toBeInTheDocument();
    expect(screen.getAllByRole('radio').every((r) => !r.checked)).toBe(true);
  });

  it('edge case: an empty question bank shows a friendly message instead of crashing', () => {
    render(<HabitsQuizView questionBank={[]} />);
    expect(screen.getByText(/No questions are available/)).toBeInTheDocument();
  });

  it('edge case: very long question and option text still renders as plain text', async () => {
    const long = 'Heart '.repeat(300) + '<b>not html</b>';
    const bank = [
      {
        id: 'long',
        topic: 'food',
        question: long,
        options: [
          { id: 'a', text: long },
          { id: 'b', text: 'Short' },
        ],
        answer: 'b',
        explanation: 'An explanation that is long enough to pass.',
        source: { label: 'Example', href: 'https://example.org' },
      },
    ];
    const user = userEvent.setup();
    const { container } = render(<HabitsQuizView questionBank={bank} />);
    expect(container.querySelector('b')).toBeNull();
    await user.click(screen.getByLabelText('Short'));
    await user.click(screen.getByRole('button', { name: 'Check answer' }));
    expect(screen.getByRole('button', { name: 'See results' })).toBeInTheDocument();
  });

  it('stores nothing and makes no network requests', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(() => Promise.reject());
    localStorage.clear();
    sessionStorage.clear();
    const user = userEvent.setup();
    render(<HabitsQuizView />);
    await user.click(screen.getByLabelText(rightText(first)));
    await user.click(screen.getByRole('button', { name: 'Check answer' }));
    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
