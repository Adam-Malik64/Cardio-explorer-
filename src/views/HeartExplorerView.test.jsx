// Tests for Issue #1: Interactive 4-Chamber Heart & Blood Flow Explorer.
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HeartExplorerView from './HeartExplorerView';
import { parts, sources, tourSteps } from '../mocks/heartExplorer';

afterEach(cleanup);

const partButton = (name) => screen.getByRole('button', { name: new RegExp(`^${name}\\b`) });

describe('mock heart data', () => {
  it('has the 4 chambers and 4 valves, each with a job and next step', () => {
    expect(parts.filter((p) => p.kind === 'chamber')).toHaveLength(4);
    expect(parts.filter((p) => p.kind === 'valve')).toHaveLength(4);
    for (const p of parts) {
      expect(p.job.length).toBeGreaterThan(20);
      expect(p.next.length).toBeGreaterThan(5);
    }
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
    for (const s of tourSteps.filter((x) => x.part)) {
      expect(parts.map((p) => p.id)).toContain(s.part);
    }
  });

  it('never repeats the "blue blood" myth and cites https sources', () => {
    expect(JSON.stringify({ parts, tourSteps }).toLowerCase()).not.toMatch(/blood is blue|blue blood/);
    for (const s of sources) expect(s.href).toMatch(/^https:\/\//);
  });
});

describe('HeartExplorerView', () => {
  it('shows 8 selectable parts; the right atrium is selected first', () => {
    render(<HeartExplorerView />);
    const diagram = screen.getByRole('group', { name: /Heart diagram/ });
    expect(within(diagram).getAllByRole('button')).toHaveLength(8);
    expect(partButton('Right atrium')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('part-panel')).toHaveTextContent('Right atrium');
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

  it('works with the keyboard: Tab to a part and press Enter or Space', async () => {
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

  it('explains that the diagram is mirrored and that real blood is always red', () => {
    render(<HeartExplorerView />);
    expect(screen.getByText(/the heart’s right side is on your left/)).toBeInTheDocument();
    expect(screen.getByText(/Real blood is always red/)).toBeInTheDocument();
  });

  it('tour: Next/Previous move one step, stop at the ends and Start again resets', async () => {
    const user = userEvent.setup();
    render(<HeartExplorerView />);
    const prev = screen.getByRole('button', { name: 'Previous step' });
    const next = screen.getByRole('button', { name: 'Next step' });

    expect(screen.getByTestId('tour-progress')).toHaveTextContent(`Step 1 of ${tourSteps.length}`);
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

  it('tour: each step names the loop and the oxygen status in words, and marks the part', async () => {
    const user = userEvent.setup();
    render(<HeartExplorerView />);
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
    await user.click(screen.getByRole('button', { name: 'Next step' }));
    const prev = screen.getByRole('button', { name: 'Previous step' });
    prev.focus();
    await user.keyboard('{Enter}');
    expect(prev).toHaveFocus();
    expect(prev).toHaveAttribute('aria-disabled', 'true');
  });

  it('the tour never advances on its own', async () => {
    render(<HeartExplorerView />);
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.getByTestId('tour-progress')).toHaveTextContent('Step 1 of');
  });
});
