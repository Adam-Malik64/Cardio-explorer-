// The four core interactive modules from BRIEF.md. This is the single source of truth:
// the landing page, the Modules page, each module page, the footer and the
// previous/next links all read from here. Keep this list in step with BRIEF.md.

/**
 * @typedef {object} LearningModule
 * @property {string} slug     Used in the URL: /modules/<slug>
 * @property {string} title
 * @property {string} kind     Short label for the type of activity, shown on cards
 * @property {string} theme    Colour theme: 'anatomy' | 'biometrics' | 'habits' | 'reference'
 * @property {string} summary  One or two sentences shown on cards
 * @property {string[]} topics What students will explore once the module is built
 * @property {string} icon
 */

/** @type {LearningModule[]} */
export const modules = [
  {
    slug: 'heart-explorer',
    title: '4-Chamber Heart & Blood Flow Explorer',
    kind: 'Interactive explorer',
    theme: 'anatomy',
    summary:
      'Select each chamber and valve to learn its job, then follow blood through the heart, lungs and body.',
    topics: [
      'The four chambers: right and left atria, right and left ventricles',
      'The valves that keep blood flowing one way',
      'Pulmonary and systemic circulation: oxygen-poor vs. oxygen-rich blood',
    ],
    icon: '🫀',
  },
  {
    slug: 'pulse-simulator',
    title: 'Heart Rate Zones & Pulse Simulator',
    kind: 'Simulator',
    theme: 'biometrics',
    summary:
      'Learn to take a pulse and see how heart rate changes from rest through light, moderate and hard activity.',
    topics: [
      'Finding your pulse at the wrist or neck',
      'Resting heart rate and what changes it',
      'Heart rate zones during exercise and recovery',
    ],
    icon: '💓',
  },
  {
    slug: 'habits-quiz',
    title: 'Daily Habits & Cardiovascular Risk Quiz',
    kind: 'Quiz',
    theme: 'habits',
    summary:
      'Quick questions on food, activity, sleep, stress and tobacco, with instant explanations of how each habit affects the heart.',
    topics: [
      'Food and drink choices, including salt and sugar',
      'Physical activity and time spent sitting',
      'Sleep, stress, and why to avoid tobacco and vaping',
    ],
    icon: '✅',
  },
  {
    slug: 'glossary',
    title: 'Heart Health Glossary & Fact Cards',
    kind: 'Reference',
    theme: 'reference',
    summary:
      'Plain-language definitions and flip-style fact cards for key heart words, for quick review before a test.',
    topics: [
      'Anatomy terms: atrium, ventricle, valve, artery, vein, capillary',
      'Measurements: pulse, heart rate, blood pressure, ECG',
      'Fact cards to flip through and review',
    ],
    icon: '📚',
  },
];

/** @returns {LearningModule | undefined} */
export function findModule(slug) {
  return modules.find((m) => m.slug === slug);
}
