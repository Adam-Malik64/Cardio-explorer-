// The core educational modules. This is the single source of truth:
// the Modules page, each module page and its previous/next links all read from here.
// Add, remove or reorder modules in these lists and the rest of the app follows.

/**
 * The three learning areas from the project brief, in display order.
 * @type {{ id: string, title: string, description: string }[]}
 */
export const categories = [
  {
    id: 'anatomy',
    title: 'Cardiovascular Anatomy',
    description: 'How the heart and blood vessels are built and how they work together.',
  },
  {
    id: 'habits',
    title: 'Heart Health Habits',
    description: 'Everyday choices that keep your heart strong.',
  },
  {
    id: 'biometrics',
    title: 'Biometric Indicators',
    description: 'The measurements that tell you how your heart is doing.',
  },
];

/**
 * @typedef {object} LearningModule
 * @property {string} slug     Used in the URL: /modules/<slug>
 * @property {string} category One of the `categories` ids above
 * @property {string} title
 * @property {string} summary  One-line summary shown on cards
 * @property {string[]} topics Topics the module will cover once written
 * @property {string} icon
 */

/** @type {LearningModule[]} */
export const modules = [
  {
    slug: 'heart-anatomy',
    category: 'anatomy',
    title: 'Heart Anatomy',
    summary: 'The four chambers, the valves and the electrical system of the heart.',
    topics: ['Chambers and valves', 'The cardiac cycle', 'The heart’s electrical system'],
    icon: '🫀',
  },
  {
    slug: 'circulation',
    category: 'anatomy',
    title: 'Blood Vessels & Circulation',
    summary: 'How arteries, veins and capillaries carry blood around the body.',
    topics: ['Arteries, veins and capillaries', 'Pulmonary vs. systemic circulation', 'Oxygen delivery'],
    icon: '🩸',
  },
  {
    slug: 'heart-healthy-eating',
    category: 'habits',
    title: 'Heart-Healthy Eating',
    summary: 'Everyday food choices that support your heart.',
    topics: ['Salt and sodium', 'Fats and fibre', 'Building a balanced plate'],
    icon: '🥗',
  },
  {
    slug: 'active-living',
    category: 'habits',
    title: 'Active Living',
    summary: 'How movement, sleep and stress affect the heart.',
    topics: ['Aerobic vs. strength exercise', 'Sleep and recovery', 'Managing stress'],
    icon: '🏃',
  },
  {
    slug: 'heart-rate',
    category: 'biometrics',
    title: 'Heart Rate',
    summary: 'What your pulse tells you and how to measure it.',
    topics: ['Taking your pulse', 'Resting and target heart rate', 'What changes heart rate'],
    icon: '💓',
  },
  {
    slug: 'ecg-basics',
    category: 'biometrics',
    title: 'ECG Basics',
    summary: 'Reading the waves of an electrocardiogram.',
    topics: ['What an ECG records', 'P wave, QRS complex and T wave', 'Normal sinus rhythm'],
    icon: '📈',
  },
  {
    slug: 'blood-pressure',
    category: 'biometrics',
    title: 'Blood Pressure',
    summary: 'What the two numbers mean and why they matter.',
    topics: ['Systolic and diastolic', 'Healthy ranges', 'Measuring at home'],
    icon: '🩺',
  },
];

/** @returns {LearningModule | undefined} */
export function findModule(slug) {
  return modules.find((m) => m.slug === slug);
}

/** @returns {{ id: string, title: string, description: string } | undefined} */
export function findCategory(id) {
  return categories.find((c) => c.id === id);
}
