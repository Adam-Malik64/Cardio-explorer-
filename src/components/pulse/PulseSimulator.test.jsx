// Acceptance tests for Issue #2: Heart Rate Zones & Pulse Simulator.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PulseSimulator from './PulseSimulator';

afterEach(cleanup);

describe('PulseSimulator', () => {
  it('AC1: selecting Moderate shows ~140 BPM, the Moderate Zone badge and an explanation', async () => {
    const user = userEvent.setup();
    render(<PulseSimulator />);

    await user.click(screen.getByRole('button', { name: 'Moderate' }));

    expect(screen.getByRole('button', { name: 'Moderate' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('bpm-value')).toHaveTextContent('140');
    expect(screen.getByTestId('zone-badge')).toHaveTextContent('Moderate Zone');
    expect(screen.getByTestId('zone-explanation')).toHaveTextContent(/50–70%/);
  });

  it('every activity level updates the BPM and zone', async () => {
    const user = userEvent.setup();
    render(<PulseSimulator />);
    const expected = { Rest: '70', Light: '100', Moderate: '140', Hard: '165' };

    for (const [label, bpm] of Object.entries(expected)) {
      await user.click(screen.getByRole('button', { name: label }));
      expect(screen.getByTestId('bpm-value')).toHaveTextContent(bpm);
    }
    expect(screen.getByTestId('zone-badge')).toHaveTextContent('Vigorous Zone');
  });

  it('AC2: with animation paused, switching levels updates values immediately and the heart stops pulsing', async () => {
    const user = userEvent.setup();
    render(<PulseSimulator />);

    await user.click(screen.getByRole('button', { name: 'Pause heart animation' }));
    expect(screen.getByRole('button', { name: 'Play heart animation' })).not.toHaveAttribute('aria-pressed');
    expect(screen.getByTestId('sim-heart')).toHaveClass('paused');

    await user.click(screen.getByRole('button', { name: 'Hard' }));
    // Updated synchronously: no count-up or delayed transition
    expect(screen.getByTestId('bpm-value')).toHaveTextContent('165');
    expect(screen.getByTestId('zone-badge')).toHaveTextContent('Vigorous Zone');
    expect(screen.getByTestId('sim-heart')).toHaveClass('paused');
  });

  it('AC2: readout is announced to screen readers via a polite live region', () => {
    render(<PulseSimulator />);
    expect(screen.getByTestId('bpm-value').closest('[aria-live]')).toHaveAttribute('aria-live', 'polite');
  });
});

describe('PulseSimulator: reduced motion and announcements', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('starts paused when the device prefers reduced motion', () => {
    vi.stubGlobal('matchMedia', (query) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      addEventListener() {},
      removeEventListener() {},
    }));
    render(<PulseSimulator />);
    expect(screen.getByTestId('sim-heart')).toHaveClass('paused');
    expect(screen.getByRole('button', { name: 'Play heart animation' })).toBeInTheDocument();
  });

  it('animates by default when reduced motion is not requested', () => {
    render(<PulseSimulator />);
    expect(screen.getByTestId('sim-heart')).not.toHaveClass('paused');
  });

  it('announces one summary sentence and labels the data as simulated', async () => {
    const user = userEvent.setup();
    render(<PulseSimulator />);
    await user.click(screen.getByRole('button', { name: 'Moderate' }));
    expect(screen.getByTestId('sim-summary')).toHaveTextContent(
      'Moderate activity: about 140 beats per minute, Moderate Zone.',
    );
    expect(screen.getByText(/Example student, age 16\. Simulated data/)).toBeInTheDocument();
    expect(screen.getByText(/vary from person to person/)).toBeInTheDocument();
  });
});
