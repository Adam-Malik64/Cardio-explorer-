// MOCK DATA: activity levels for the Heart Rate Zones & Pulse Simulator (Issue #2).
// BPM values are SIMULATED demo numbers for an example 16-year-old, not real patient data.
// Zone ranges follow the American Heart Association's target heart rate chart (moderate
// ≈ 50–70% and vigorous ≈ 70–85% of estimated maximum heart rate, where maximum ≈ 220 − age).
// The "talk test" wording follows the CDC's guide to measuring activity intensity.
// Each level's minPct/maxPct is the range its BPM must fall inside (checked by a test).
import { sources as allSources } from './sources';

export const DEMO_AGE = 16;
export const DEMO_MAX_BPM = 220 - DEMO_AGE; // 204

export const activityLevels = [
  {
    id: 'rest',
    label: 'Rest',
    bpm: 70,
    minPct: 0,
    maxPct: 40,
    zone: 'Resting Zone',
    example: 'Sitting in class or reading',
    explanation:
      'At rest your heart only needs to pump enough blood to supply your organs. For most adults a resting heart rate between 60 and 100 BPM is typical.',
  },
  {
    id: 'light',
    label: 'Light',
    bpm: 100,
    minPct: 40,
    maxPct: 50,
    zone: 'Light / Warm-up Zone',
    example: 'Walking to class',
    explanation:
      'Your muscles start asking for a little more oxygen, so your heart beats a bit faster. This is the warm-up range, below the moderate zone.',
  },
  {
    id: 'moderate',
    label: 'Moderate',
    bpm: 140,
    minPct: 50,
    maxPct: 70,
    zone: 'Moderate Zone',
    example: 'Brisk walking or an easy bike ride',
    explanation:
      'Your heart works at roughly 50–70% of its estimated maximum. You can talk, but not sing. Activity in this zone builds heart and lung fitness.',
  },
  {
    id: 'hard',
    label: 'Hard',
    bpm: 165,
    minPct: 70,
    maxPct: 85,
    zone: 'Vigorous Zone',
    example: 'Running or a fast game of basketball',
    explanation:
      'Your heart works at roughly 70–85% of its estimated maximum. You can only say a few words before pausing for breath. Near the top of this range, muscles start to rely more on energy made without oxygen, which is why you can’t keep it up for long.',
  },
];

export const sources = [allSources.ahaTargetHeartRates, allSources.cdcIntensity];
