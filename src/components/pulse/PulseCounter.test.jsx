// Component tests for the guided pulse-counting practice (Issue #2, Story 1).
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PulseCounter from './PulseCounter';

const LABEL = /beats counted in 15 seconds/i;
const NOTE = 'This is a practice estimate. Counting mistakes are common. It is not a medical measurement.';

function getInput() {
  return screen.getByLabelText(LABEL);
}

function getResultRegion() {
  return screen.getByTestId('pulse-result');
}

async function submit(user, text) {
  const input = getInput();
  await user.clear(input);
  if (text !== '') {
    // paste keeps long strings fast and avoids user-event key parsing of "{" etc.
    await user.click(input);
    await user.paste(text);
  }
  await user.click(screen.getByRole('button', { name: 'Calculate BPM' }));
}

let fetchSpy;

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  fetchSpy = vi.fn(() => Promise.reject(new Error('fetch must not be called')));
  vi.stubGlobal('fetch', fetchSpy);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('PulseCounter: steps and labels', () => {
  it('shows four numbered steps in plain language, with wrist and two-finger guidance', () => {
    render(<PulseCounter />);
    const items = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(items).toHaveLength(4);
    expect(items[0]).toHaveTextContent(/wrist/i);
    expect(items[0]).toHaveTextContent(/two fingers/i);
    expect(items[0]).toHaveTextContent(/not your thumb/i);
    expect(items[0]).toHaveTextContent(/gently/i);
    expect(items[1]).toHaveTextContent(/start/i);
  });

  it('tells students to stop and tell a trusted adult if dizzy, and never to exercise hard first', () => {
    const { container } = render(<PulseCounter />);
    expect(screen.getByText(/dizzy or unwell/i)).toHaveTextContent(/teacher|trusted adult/i);
    expect(container).not.toHaveTextContent(/exercise hard|run (around|fast)|do jumping jacks/i);
  });

  it('the input has a visible label and the hint is linked with aria-describedby', () => {
    render(<PulseCounter />);
    const input = getInput();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAccessibleDescription(/type a whole number, for example 18/i);
    expect(input).not.toHaveAttribute('aria-invalid', 'true');
  });

  it('starts empty with no result and no error', () => {
    render(<PulseCounter />);
    expect(getInput()).toHaveValue('');
    expect(getResultRegion()).toBeEmptyDOMElement();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

describe('PulseCounter: calculation', () => {
  it('a valid count shows "18 × 4 = 72" beats per minute and the practice-estimate note', async () => {
    const user = userEvent.setup();
    render(<PulseCounter />);
    await submit(user, '18');

    const region = getResultRegion();
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toHaveTextContent('18 × 4 = 72 beats per minute');
    expect(within(region).getByText(NOTE)).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('pressing Enter inside the input calculates', async () => {
    const user = userEvent.setup();
    render(<PulseCounter />);
    await user.type(getInput(), '18{Enter}');
    expect(getResultRegion()).toHaveTextContent('18 × 4 = 72');
  });

  it('ignores leading and trailing spaces', async () => {
    const user = userEvent.setup();
    render(<PulseCounter />);
    await submit(user, ' 18 ');
    expect(getResultRegion()).toHaveTextContent('18 × 4 = 72');
  });

  it.each([
    ['1', '1 × 4 = 4'],
    ['60', '60 × 4 = 240'],
  ])('boundary %s → %s', async (raw, expected) => {
    const user = userEvent.setup();
    render(<PulseCounter />);
    await submit(user, raw);
    expect(getResultRegion()).toHaveTextContent(expected);
  });

  it.each(['1', '10', '18', '30', '45', '60'])(
    'result for %s is never labelled normal/abnormal/healthy/too high/too low or put in a zone',
    async (raw) => {
      const user = userEvent.setup();
      render(<PulseCounter />);
      await submit(user, raw);
      const region = getResultRegion();
      expect(region).toHaveTextContent(/beats per minute/i);
      expect(region.textContent).not.toMatch(/normal|abnormal|healthy|unhealthy|too high|too low|zone|good|bad|athlete/i);
    },
  );

  it('the timer is optional: a count can be calculated without starting it', async () => {
    const user = userEvent.setup();
    render(<PulseCounter />);
    await submit(user, '20');
    expect(getResultRegion()).toHaveTextContent('20 × 4 = 80');
    expect(screen.getByTestId('timer-display')).toHaveTextContent('15 seconds left');
  });

  it('changing the input clears a stale result', async () => {
    const user = userEvent.setup();
    render(<PulseCounter />);
    await submit(user, '18');
    expect(getResultRegion()).toHaveTextContent('72');

    await user.type(getInput(), '{Backspace}');
    expect(getResultRegion()).not.toHaveTextContent('72');
    expect(getResultRegion()).not.toHaveTextContent(/beats per minute/i);

    await user.type(getInput(), '9');
    expect(getResultRegion()).toBeEmptyDOMElement();
    await user.click(screen.getByRole('button', { name: 'Calculate BPM' }));
    expect(getResultRegion()).toHaveTextContent('19 × 4 = 76');
  });

  it('remounting (like a reload) starts with an empty input and no result', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<PulseCounter />);
    await submit(user, '18');
    unmount();
    render(<PulseCounter />);
    expect(getInput()).toHaveValue('');
    expect(getResultRegion()).toBeEmptyDOMElement();
  });
});

const longParagraph =
  'Hi! I was not sure what to type here so I am pasting what my friend wrote about counting beats in gym class today. '.repeat(5);

const invalidCases = [
  ['V1 empty', '', 'Type the number of beats you counted.'],
  ['V1 spaces only', '    ', 'Type the number of beats you counted.'],
  ['V2 letters', 'abc', 'Please use numbers only, for example 18.'],
  ['V2 mixed', '12abc', 'Please use numbers only, for example 18.'],
  ['V2 exponent', '1e2', 'Please use numbers only, for example 18.'],
  ['V2 symbols', '#$%', 'Please use numbers only, for example 18.'],
  ['V3 long digits', '99999999999', "That's longer than we expected. Type a number from 1 to 60."],
  ['V3 pasted paragraph', longParagraph, "That's longer than we expected. Type a number from 1 to 60."],
  ['V4 negative', '-5', "A count can't be negative. Type a number from 1 to 60."],
  ['V5 decimal point', '17.5', 'Count whole beats only, for example 18.'],
  ['V5 decimal comma', '18,5', 'Count whole beats only, for example 18.'],
  ['V6 zero', '0', 'Looks like no beats were counted. Try finding your pulse again, or ask your teacher for help.'],
  ['V7 above 60', '75', "That number is higher than we'd expect for 15 seconds. It's easy to miscount, so try counting again."],
];

describe('PulseCounter: validation errors', () => {
  it.each(invalidCases)('%s: role=alert, aria-invalid, aria-describedby and no result', async (_name, raw, message) => {
    const user = userEvent.setup();
    render(<PulseCounter />);
    await submit(user, raw);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(message);

    const input = getInput();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    const describedBy = input.getAttribute('aria-describedby').split(/\s+/);
    expect(describedBy).toContain(alert.id);
    expect(input).toHaveAccessibleDescription(expect.stringContaining(message));

    expect(getResultRegion()).toBeEmptyDOMElement();
    // step 4 of the instructions mentions "beats per minute", so look for a calculated value
    expect(document.body).not.toHaveTextContent(/× 4 =|=\s*\d+\s*beats per minute/);
  });

  it('V3: the raw pasted text is not shown back on the page', async () => {
    const user = userEvent.setup();
    render(<PulseCounter />);
    await submit(user, longParagraph);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    // textContent excludes the input value, so this checks every rendered text node
    expect(document.body.textContent).not.toContain('pasting what my friend wrote');
  });

  it('V5: a decimal is not silently rounded into a result', async () => {
    const user = userEvent.setup();
    render(<PulseCounter />);
    await submit(user, '17.5');
    expect(document.body).not.toHaveTextContent(/= 70|= 72/);
  });

  it('an error replaces a previous valid result', async () => {
    const user = userEvent.setup();
    render(<PulseCounter />);
    await submit(user, '18');
    expect(getResultRegion()).toHaveTextContent('72');
    await submit(user, 'abc');
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(getResultRegion()).toBeEmptyDOMElement();
  });

  it('fixing the input and calculating again clears the error and shows the result', async () => {
    const user = userEvent.setup();
    render(<PulseCounter />);
    await submit(user, 'abc');
    expect(screen.getByRole('alert')).toBeInTheDocument();

    await submit(user, '18');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    const input = getInput();
    expect(input).not.toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(/type a whole number/i);
    expect(input).not.toHaveAccessibleDescription(/numbers only/i);
    expect(getResultRegion()).toHaveTextContent('18 × 4 = 72');
  });

  it('the error is not shown by colour alone: it is real text next to the input', async () => {
    const user = userEvent.setup();
    render(<PulseCounter />);
    await submit(user, '0');
    const alert = screen.getByRole('alert');
    expect(alert.textContent.trim().length).toBeGreaterThan(10);
    expect(alert.closest('form')).toBe(getInput().closest('form'));
  });
});

describe('PulseCounter: 15-second timer', () => {
  function setupTimers() {
    // Only fake the interval the component uses. Faking setTimeout too makes RTL's async act
    // wrapper hang under Vitest (it only auto-advances Jest fake timers).
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
    return userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  }

  async function tick(ms) {
    await act(async () => {
      vi.advanceTimersByTime(ms);
    });
  }

  it('Start announces "Counting started" and counts down as text', async () => {
    const user = setupTimers();
    render(<PulseCounter />);
    const status = screen.getByTestId('timer-status');
    expect(status).toHaveAttribute('aria-live', 'polite');

    await user.click(screen.getByRole('button', { name: /start 15-second count/i }));
    expect(status).toHaveTextContent('Counting started');
    expect(screen.getByTestId('timer-display')).toHaveTextContent('15 seconds left');

    await tick(1000);
    expect(screen.getByTestId('timer-display')).toHaveTextContent('14 seconds left');
    await tick(4000);
    expect(screen.getByTestId('timer-display')).toHaveTextContent('10 seconds left');
    // not announced every second
    expect(status).toHaveTextContent('Counting started');
    expect(status).not.toHaveTextContent(/10/);
  });

  it('reaching 0 announces "Time\'s up. Enter your count." and focus does not jump', async () => {
    const user = setupTimers();
    render(<PulseCounter />);
    const button = screen.getByRole('button', { name: /start 15-second count/i });
    await user.click(button);
    expect(button).toHaveFocus();

    await tick(15000);
    expect(screen.getByTestId('timer-display')).toHaveTextContent('0 seconds left');
    expect(screen.getByTestId('timer-status')).toHaveTextContent("Time's up. Enter your count.");
    expect(button).toHaveFocus();
    expect(button).toHaveAccessibleName(/start 15-second count/i);

    // stops at 0, does not go negative
    await tick(5000);
    expect(screen.getByTestId('timer-display')).toHaveTextContent('0 seconds left');

    // the count input is ready to use
    expect(getInput()).toBeEnabled();
  });

  it('Stop resets the display to 15 and the same button keeps focus', async () => {
    const user = setupTimers();
    render(<PulseCounter />);
    const button = screen.getByRole('button', { name: /start 15-second count/i });
    await user.click(button);
    await tick(6000);
    expect(screen.getByTestId('timer-display')).toHaveTextContent('9 seconds left');

    expect(button).toHaveAccessibleName(/stop/i);
    await user.click(button);
    expect(screen.getByTestId('timer-display')).toHaveTextContent('15 seconds left');
    expect(button).toHaveFocus();
    expect(button).toHaveAccessibleName(/start 15-second count/i);

    // the timer really stopped
    await tick(3000);
    expect(screen.getByTestId('timer-display')).toHaveTextContent('15 seconds left');
  });

  it('can be started with the keyboard (Enter and Space)', async () => {
    const user = setupTimers();
    render(<PulseCounter />);
    const button = screen.getByRole('button', { name: /start 15-second count/i });
    button.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByTestId('timer-status')).toHaveTextContent('Counting started');
    await user.keyboard(' ');
    expect(screen.getByTestId('timer-display')).toHaveTextContent('15 seconds left');
    expect(button).toHaveAccessibleName(/start 15-second count/i);
    await user.keyboard(' ');
    expect(button).toHaveAccessibleName(/stop/i);
  });

  it('restarting after time is up begins again at 15', async () => {
    const user = setupTimers();
    render(<PulseCounter />);
    const button = screen.getByRole('button', { name: /start 15-second count/i });
    await user.click(button);
    await tick(15000);
    await user.click(button);
    expect(screen.getByTestId('timer-display')).toHaveTextContent('15 seconds left');
    expect(screen.getByTestId('timer-status')).toHaveTextContent('Counting started');
  });
});

describe('PulseCounter: privacy', () => {
  it('nothing is written to storage, cookies or the URL, and fetch is never called', async () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const startUrl = window.location.href;
    const user = userEvent.setup();
    render(<PulseCounter />);

    for (const raw of ['18', 'abc', '99999999999', '0', '75', '-5', '17.5', '', longParagraph, '60']) {
      await submit(user, raw);
    }
    await user.click(screen.getByRole('button', { name: /start 15-second count/i }));

    expect(setItem).not.toHaveBeenCalled();
    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
    expect(document.cookie).toBe('');
    expect(window.location.href).toBe(startUrl);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe('PulseCounter Story 4: Reset', () => {
  afterEach(cleanup);

  it('Reset clears the input, error, result and timer together', async () => {
    const user = userEvent.setup();
    render(<PulseCounter />);
    await user.type(getInput(), 'abc{Enter}');
    expect(screen.getByRole('alert')).toBeInTheDocument();
    await user.clear(getInput());
    await user.type(getInput(), '18{Enter}');
    expect(screen.getByTestId('pulse-result')).toHaveTextContent('18 × 4 = 72 beats per minute');

    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(getInput()).toHaveValue('');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByTestId('pulse-result')).toBeEmptyDOMElement();
    expect(screen.getByTestId('timer-display')).toHaveTextContent('15 seconds left');
    expect(screen.getByRole('button', { name: 'Reset' })).toHaveFocus();
  });
});
