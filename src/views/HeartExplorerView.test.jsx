// Tests for Issue #1: Interactive 4-Chamber Heart & Blood Flow Explorer.
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HeartExplorerView from './HeartExplorerView';
import { parts, sources, tourSteps } from '../mocks/heartExplorer';

afterEach(cleanup);

const partButton = (name) => screen.getByRole('button', { name: new RegExp(`^${name}\\b`) });

async function startTour(user) {
  await user.click(screen.getByRole('button', { name: 'Start the tour' }));
}

describe('mock heart data', () => {
  it('has the 4 chambers and 4 valves, each with a job, next step and grid position', () => {
    expect(parts.filter((p) => p.kind === 'chamber')).toHaveLength(4);
    expect(parts.filter((p) => p.kind === 'valve')).toHaveLength(4);
    for (const p of parts) {
      expect(p.job.length).toBeGreaterThan(20);
      expect(p.next.length).toBeGreaterThan(5);
      expect(p.gridArea).toMatch(/^[a-z]{2}$/);
    }
    expect(new Set(parts.map((p) => p.gridArea)).size).toBe(8);
  });

  it('lists parts in blood-path order: all right-side parts before left-side parts', () => {
    expect(parts.map((p) => p.id)).toEqual([
      'right-atrium',
      'tricuspid-valve',
      'right-ventricle',
      'pulmonary-valve',
      'left-atrium',
      'mitral-valve',
      'left-ventricle',
      'aortic-valve',
    ]);
  });

  it('draws the pulmonary and aortic valves on the top row, above the ventricles', () => {
    const area = Object.fromEntries(parts.map((p) => [p.id, p.gridArea]));
    expect(area['pulmonary-valve']).toBe('pv');
    expect(area['aortic-valve']).toBe('av');
  });

  it('the right side carries oxygen-poor blood and the left side oxygen-rich', () => {
    for (const p of parts) expect(p.blood).toBe(p.side === 'right' ? 'oxygen-poor' : 'oxygen-rich');
  });

  it('the tour follows the correct order through the heart, lungs and body', () => {
    expect(tourSteps.map((s) => s.part ?? s.place)).toEqual([
      'right-atrium',
      'tricuspid-valve',
      'right-ventricle',
      'pulmonary-valve',
      'Lungs',
      'left-atrium',
      'mitral-valve',
      'left-ventricle',
      'aortic-valve',
      'Body',
    ]);
  });

  it('never repeats the "blue blood" myth and cites checked https sources', () => {
    expect(JSON.stringify({ parts, tourSteps }).toLowerCase()).not.toMatch(/blood is blue|blue blood/);
    for (const s of sources) {
      expect(s.href).toMatch(/^https:\/\//);
      expect(s.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});

describe('HeartExplorerView: explore parts', () => {
  it('shows 8 selectable parts and a prompt until one is chosen', () => {
    render(<HeartExplorerView />);
    const diagram = screen.getByRole('group', { name: /Heart diagram/ });
    expect(within(diagram).getAllByRole('button')).toHaveLength(8);
    for (const b of within(diagram).getAllByRole('button')) expect(b).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByTestId('part-panel')).toHaveTextContent('Choose a chamber or valve');
  });

  it('selecting a part shows its job, blood type in words and next stop; only one is selected', async () => {
    const user = userEvent.setup();
    render(<HeartExplorerView />);
    const lv = parts.find((p) => p.id === 'left-ventricle');
    await user.click(partButton('Left ventricle'));

    const panel = screen.getByTestId('part-panel');
    expect(panel).toHaveTextContent(lv.job);
    expect(panel).toHaveTextContent('Oxygen-rich blood');
    expect(panel).toHaveTextContent(lv.next);
    expect(panel).toHaveAttribute('aria-live', 'polite');
    const pressed = screen.getAllByRole('button').filter((b) => b.getAttribute('aria-pressed') === 'true');
    expect(pressed).toHaveLength(1);
  });

  it('Tab visits the right-side parts before the left-side parts, following the blood path', async () => {
    const user = userEvent.setup();
    render(<HeartExplorerView />);
    const visited = [];
    for (let i = 0; i < 8; i += 1) {
      await user.tab();
      visited.push(document.activeElement.getAttribute('aria-label').split(',')[0]);
    }
    expect(visited).toEqual(parts.map((p) => p.name));
  });

  it('Enter and Space select the focused part', async () => {
    const user = userEvent.setup();
    render(<HeartExplorerView />);
    partButton('Mitral valve').focus();
    await user.keyboard('{Enter}');
    expect(screen.getByTestId('part-panel')).toHaveTextContent('Mitral valve');
    partButton('Aortic valve').focus();
    await user.keyboard(' ');
    expect(screen.getByTestId('part-panel')).toHaveTextContent('Aortic valve');
    expect(partButton('Aortic valve')).toHaveFocus();
  });

  it('explains the mirrored layout, the valve positions and that real blood is always red', () => {
    render(<HeartExplorerView />);
    expect(screen.getByText(/the heart’s right side is on your left/)).toBeInTheDocument();
    expect(screen.getByText(/drawn at the top because blood leaves the ventricles upwards/)).toBeInTheDocument();
    expect(screen.getByText(/Real blood is always red/)).toBeInTheDocument();
  });
});

describe('HeartExplorerView: follow the blood', () => {
  it('the tour starts only when asked, at step 1, with focus on the step heading', async () => {
    const user = userEvent.setup();
    render(<HeartExplorerView />);
    expect(screen.queryByTestId('tour-progress')).not.toBeInTheDocument();
    expect(screen.queryByText('Blood is here')).not.toBeInTheDocument();
    await startTour(user);
    expect(screen.getByTestId('tour-progress')).toHaveTextContent(`Step 1 of ${tourSteps.length}`);
    await new Promise((r) => requestAnimationFrame(r));
    expect(screen.getByTestId('tour-progress')).toHaveFocus();
  });

  it('Next/Previous move one step, stop at the ends and Start again resets', async () => {
    const user = userEvent.setup();
    render(<HeartExplorerView />);
    await startTour(user);
    const prev = screen.getByRole('button', { name: 'Previous step' });
    const next = screen.getByRole('button', { name: 'Next step' });

    expect(prev).toHaveAttribute('aria-disabled', 'true');
    await user.click(prev); // no-op at the start
    expect(screen.getByTestId('tour-progress')).toHaveTextContent('Step 1 of');

    for (let i = 1; i < tourSteps.length + 3; i += 1) await user.click(next); // clicks past the end
    expect(screen.getByTestId('tour-progress')).toHaveTextContent(`Step ${tourSteps.length} of ${tourSteps.length}`);
    expect(next).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByTestId('tour-step')).toHaveTextContent('Body');

    await user.click(screen.getByRole('button', { name: 'Start again' }));
    expect(screen.getByTestId('tour-progress')).toHaveTextContent('Step 1 of');
  });

  it('each step names the loop and the oxygen status in words, and marks the part', async () => {
    const user = userEvent.setup();
    render(<HeartExplorerView />);
    await startTour(user);
    for (const s of tourSteps.slice(0, 5)) {
      const box = screen.getByTestId('tour-step');
      expect(box).toHaveTextContent(s.loop);
      expect(box).toHaveTextContent(`Blood: ${s.blood}`);
      if (s.part) {
        const name = parts.find((p) => p.id === s.part).name;
        expect(partButton(name)).toHaveTextContent('Blood is here');
      } else {
        expect(screen.queryByText('Blood is here')).not.toBeInTheDocument();
      }
      await user.click(screen.getByRole('button', { name: 'Next step' }));
    }
  });

  it('keyboard focus stays on Previous when it reaches the first step', async () => {
    const user = userEvent.setup();
    render(<HeartExplorerView />);
    await startTour(user);
    await user.click(screen.getByRole('button', { name: 'Next step' }));
    const prev = screen.getByRole('button', { name: 'Previous step' });
    prev.focus();
    await user.keyboard('{Enter}');
    expect(prev).toHaveFocus();
    expect(prev).toHaveAttribute('aria-disabled', 'true');
  });

  it('Exit tour ends the tour, clears the marker and returns focus to Start the tour', async () => {
    const user = userEvent.setup();
    render(<HeartExplorerView />);
    await startTour(user);
    expect(screen.getByText('Blood is here')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Exit tour' }));
    expect(screen.queryByTestId('tour-progress')).not.toBeInTheDocument();
    expect(screen.queryByText('Blood is here')).not.toBeInTheDocument();
    await new Promise((r) => requestAnimationFrame(r));
    expect(screen.getByRole('button', { name: 'Start the tour' })).toHaveFocus();
  });

  it('the tour never advances on its own', async () => {
    const user = userEvent.setup();
    render(<HeartExplorerView />);
    await startTour(user);
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.getByTestId('tour-progress')).toHaveTextContent('Step 1 of');
  });

  it('offers the whole blood path as text for screen readers and reduced motion', () => {
    render(<HeartExplorerView />);
    const summary = screen.getByText('Read the whole blood path as text').closest('details');
    expect(within(summary).getAllByRole('listitem')).toHaveLength(tourSteps.length);
  });
});
