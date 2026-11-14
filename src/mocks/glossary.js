// MOCK DATA: demo glossary terms for the Heart Health Glossary & Fact Cards (Issue #4).
// Plain-language definitions written for ages 11–18. Typical ranges are general learning
// facts, never a judgement about the reader. A second person should re-check each source
// before release (see Issue #4, Definition of done).

/** Learning areas used by the filter. Keys match the `theme` values in src/content/modules.js. */
export const areas = {
  anatomy: 'Anatomy',
  biometrics: 'Biometrics',
  habits: 'Habits',
};

const ahaHeartRate = {
  label: 'American Heart Association: All about heart rate',
  href: 'https://www.heart.org/en/health-topics/high-blood-pressure/the-facts-about-high-blood-pressure/all-about-heart-rate-pulse',
};
const ahaBloodPressure = {
  label: 'American Heart Association: Understanding blood pressure readings',
  href: 'https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings',
};
const whoActivity = {
  label: 'WHO: Physical activity fact sheet',
  href: 'https://www.who.int/news-room/fact-sheets/detail/physical-activity',
};
const whoSalt = {
  label: 'WHO: Sodium reduction fact sheet',
  href: 'https://www.who.int/news-room/fact-sheets/detail/salt-reduction',
};

/**
 * @typedef {object} GlossaryTerm
 * @property {string} id
 * @property {string} term
 * @property {keyof typeof areas} area
 * @property {string} definition
 * @property {string} [fact]
 * @property {{ label: string, href: string }} [source]  Required when `fact` has a number
 */

/** @type {GlossaryTerm[]} Sorted A to Z by term. */
export const terms = [
  {
    id: 'aerobic-exercise',
    term: 'Aerobic exercise',
    area: 'habits',
    definition:
      'Activity that keeps large muscles moving for a while and makes you breathe harder, like brisk walking, cycling, swimming or dancing.',
    fact: 'The WHO recommends young people aged 5–17 get an average of at least 60 minutes of moderate-to-vigorous activity a day.',
    source: whoActivity,
  },
  {
    id: 'aorta',
    term: 'Aorta',
    area: 'anatomy',
    definition:
      'The largest artery in the body. It carries oxygen-rich blood out of the left ventricle to the rest of the body.',
  },
  {
    id: 'artery',
    term: 'Artery',
    area: 'anatomy',
    definition:
      'A blood vessel that carries blood away from the heart. Arteries have thick, stretchy walls to handle the pressure of each heartbeat.',
  },
  {
    id: 'atrium',
    term: 'Atrium (plural: atria)',
    area: 'anatomy',
    definition:
      'One of the two upper chambers of the heart. The atria receive blood coming back to the heart and pass it down to the ventricles.',
  },
  {
    id: 'blood-pressure',
    term: 'Blood pressure',
    area: 'biometrics',
    definition:
      'How hard blood pushes against the walls of your arteries. It is written as two numbers, such as 110/70, measured in millimetres of mercury (mmHg).',
    fact: 'The top number (systolic) is the pressure while the heart beats; the bottom number (diastolic) is the pressure while the heart rests between beats.',
    source: ahaBloodPressure,
  },
  {
    id: 'capillary',
    term: 'Capillary',
    area: 'anatomy',
    definition:
      'The tiniest blood vessels. Their walls are so thin that oxygen and nutrients can pass through them into the body’s cells.',
  },
  {
    id: 'ecg',
    term: 'ECG (electrocardiogram)',
    area: 'biometrics',
    definition:
      'A test that records the heart’s electrical signals using sticky pads on the skin. Each heartbeat shows up as a pattern of waves on a screen or paper.',
  },
  {
    id: 'heart-rate',
    term: 'Heart rate',
    area: 'biometrics',
    definition: 'The number of times your heart beats in one minute, measured in beats per minute (BPM).',
    fact: 'Heart rate goes up during exercise, excitement or stress, and comes back down when you rest.',
    source: ahaHeartRate,
  },
  {
    id: 'nicotine',
    term: 'Nicotine',
    area: 'habits',
    definition:
      'An addictive chemical found in tobacco and most vapes. It makes the heart beat faster and raises blood pressure.',
  },
  {
    id: 'pulse',
    term: 'Pulse',
    area: 'biometrics',
    definition:
      'The beat you can feel in an artery, for example on the inside of your wrist, each time your heart pumps blood.',
  },
  {
    id: 'resting-heart-rate',
    term: 'Resting heart rate',
    area: 'biometrics',
    definition: 'Your heart rate when you have been sitting or lying still and calm for a few minutes.',
    fact: 'For most adults a typical resting heart rate is between 60 and 100 beats per minute. Very fit people can be lower.',
    source: ahaHeartRate,
  },
  {
    id: 'sodium',
    term: 'Sodium',
    area: 'habits',
    definition:
      'A mineral found in salt. The body needs a little, but too much over time is linked to higher blood pressure.',
    fact: 'The WHO suggests adults eat less than 5 g of salt a day, about one teaspoon.',
    source: whoSalt,
  },
  {
    id: 'valve',
    term: 'Valve',
    area: 'anatomy',
    definition:
      'A flap of tissue that opens to let blood through and closes to stop it flowing backwards. The heart has four valves.',
  },
  {
    id: 'vein',
    term: 'Vein',
    area: 'anatomy',
    definition:
      'A blood vessel that carries blood back to the heart. Many veins have small valves that stop blood flowing the wrong way.',
  },
  {
    id: 'ventricle',
    term: 'Ventricle',
    area: 'anatomy',
    definition:
      'One of the two lower, stronger chambers of the heart. The ventricles pump blood out to the lungs and the rest of the body.',
  },
];
