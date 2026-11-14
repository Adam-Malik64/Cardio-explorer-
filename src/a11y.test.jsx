// Automated accessibility checks (axe-core) for every page and the key interactive states.
// jsdom cannot compute colours, so colour contrast is checked separately
// (scripts/check-contrast.mjs) and by hand in a browser.
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { axe, toHaveNoViolations } from 'jest-axe';
import App from './App';
import { modules } from './content/modules';

expect.extend(toHaveNoViolations);
afterEach(cleanup);

const axeOptions = { rules: { 'color-contrast': { enabled: false } } };

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe('axe: no accessibility violations', () => {
  const paths = ['/', '/modules', '/about', '/no-such-page', ...modules.map((m) => `/modules/${m.slug}`)];

  it.each(paths)('%s', async (path) => {
    const { container } = renderAt(path);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('habits quiz after an answer is checked', async () => {
    const user = userEvent.setup();
    const { container } = renderAt('/modules/habits-quiz');
    await user.click(screen.getAllByRole('radio')[0]);
    await user.click(screen.getByRole('button', { name: 'Check answer' }));
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('glossary with a flipped card and with no results', async () => {
    const user = userEvent.setup();
    const { container } = renderAt('/modules/glossary');
    await user.click(screen.getAllByRole('button', { name: /^Flip card/ })[0]);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
    await user.type(screen.getByLabelText('Search terms'), 'zzzz');
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('pulse practice showing a validation error', async () => {
    const user = userEvent.setup();
    const { container } = renderAt('/modules/pulse-simulator');
    await user.type(screen.getByLabelText(/Beats counted/), 'abc{Enter}');
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
