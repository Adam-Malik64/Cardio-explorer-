// Mock-data checks for the heart rate zone simulator (Issue #2, Story 2).
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { activityLevels, DEMO_AGE, DEMO_MAX_BPM, sources } from './heartRateZones';
import PulseSimulator from '../components/pulse/PulseSimulator';

afterEach(cleanup);

describe('heartRateZones mock data', () => {
  it('uses an example age of 16 and an estimated max of 220 − 16 = 204', () => {
    expect(DEMO_AGE).toBe(16);
    expect(DEMO_MAX_BPM).toBe(204);
  });

  it('has exactly Rest, Light, Moderate, Hard in that order', () => {
    expect(activityLevels.map((l) => l.label)).toEqual(['Rest', 'Light', 'Moderate', 'Hard']);
  });

  it('BPM rises strictly Rest < Light < Moderate < Hard', () => {
    const bpms = activityLevels.map((l) => l.bpm);
    for (let i = 1; i < bpms.length; i += 1) {
      expect(bpms[i]).toBeGreaterThan(bpms[i - 1]);
    }
  });

  it('every BPM is a positive whole number below the estimated maximum', () => {
    for (const l of activityLevels) {
      expect(Number.isInteger(l.bpm)).toBe(true);
      expect(l.bpm).toBeGreaterThan(0);
      expect(l.bpm).toBeLessThan(DEMO_MAX_BPM);
    }
  });

  it('every level has a zone name and a short explanation', () => {
    for (const l of activityLevels) {
      expect(l.zone).toMatch(/\S/);
      expect(l.explanation).toMatch(/\S/);
    }
  });

  it('explanations are descriptive, not personal prescriptions', () => {
    for (const l of activityLevels) {
      expect(l.explanation).not.toMatch(/you should|you must|train at/i);
    }
  });

  it('sources are CDC and AHA links over https with descriptive text', () => {
    expect(sources.length).toBeGreaterThanOrEqual(2);
    for (const s of sources) {
      expect(s.href).toMatch(/^https:\/\/(www\.)?(cdc\.gov|heart\.org)\//);
      expect(s.label).not.toMatch(/^(click here|here|link|source)$/i);
    }
  });
});

describe('displayed % of max matches round(bpm / 204 × 100)', () => {
  it.each(activityLevels.map((l) => [l.label, l.bpm]))('%s (%i BPM)', async (label, bpm) => {
    const user = userEvent.setup();
    render(<PulseSimulator />);
    await user.click(screen.getByRole('button', { name: label }));
    const percent = Math.round((bpm / (220 - 16)) * 100);
    expect(screen.getByText(new RegExp(`About ${percent}% of estimated maximum`))).toBeInTheDocument();
  });

  it('Rest is selected by default', () => {
    render(<PulseSimulator />);
    expect(screen.getByRole('button', { name: 'Rest' })).toHaveAttribute('aria-pressed', 'true');
    for (const name of ['Light', 'Moderate', 'Hard']) {
      expect(screen.getByRole('button', { name })).toHaveAttribute('aria-pressed', 'false');
    }
  });

  it('the heart animation duration is 60 / BPM seconds', async () => {
    const user = userEvent.setup();
    render(<PulseSimulator />);
    for (const l of activityLevels) {
      await user.click(screen.getByRole('button', { name: l.label }));
      expect(screen.getByTestId('sim-heart').style.getPropertyValue('--beat-duration')).toBe(`${60 / l.bpm}s`);
    }
  });
});
