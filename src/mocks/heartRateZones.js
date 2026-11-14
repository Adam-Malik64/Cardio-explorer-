// MOCK DATA: activity levels for the Heart Rate Zones & Pulse Simulator (Issue #2).
// BPM values are SIMULATED demo numbers for a typical teenager, not real patient data.
// Zone percentages follow the CDC's guidance on target heart rate (moderate ≈ 64–76% and
// vigorous ≈ 77–93% of estimated maximum heart rate, where maximum ≈ 220 − age).

export const DEMO_AGE = 16;
export const DEMO_MAX_BPM = 220 - DEMO_AGE; // 204

export const activityLevels = [
  {
    id: 'rest',
    label: 'Rest',
    bpm: 70,
    zone: 'Resting Zone',
    example: 'Sitting in class or reading',
    explanation:
      'At rest your heart only needs to pump enough blood to supply your organs. A resting heart rate between 60 and 100 BPM is typical for most people.',
  },
  {
    id: 'light',
    label: 'Light',
    bpm: 100,
    zone: 'Light / Warm-up Zone',
    example: 'Walking to class',
    explanation:
      'Your muscles start asking for a little more oxygen, so your heart beats a bit faster. This is the warm-up range.',
  },
  {
    id: 'moderate',
    label: 'Moderate',
    bpm: 130,
    zone: 'Aerobic / Moderate Zone',
    example: 'Brisk walking or an easy bike ride',
    explanation:
      'Your heart works at roughly 64–76% of its estimated maximum. You can still talk but not sing. This aerobic zone builds heart and lung fitness.',
  },
  {
    id: 'hard',
    label: 'Hard',
    bpm: 165,
    zone: 'Vigorous / Anaerobic Zone',
    example: 'Running or a fast game of basketball',
    explanation:
      'Your heart works at roughly 77–93% of its estimated maximum. You can only say a few words before pausing for breath. Muscles start using energy faster than oxygen can arrive.',
  },
];

export const sources = [
  {
    label: 'CDC: Target Heart Rate and Estimated Maximum Heart Rate',
    href: 'https://www.cdc.gov/physical-activity-basics/measuring/heart-rate.html',
  },
  {
    label: 'American Heart Association: Target Heart Rates Chart',
    href: 'https://www.heart.org/en/healthy-living/fitness/fitness-basics/target-heart-rates',
  },
];
