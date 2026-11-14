// MOCK DATA: demo question bank for the Daily Habits quiz (Issue #3).
// Every question tests GENERAL knowledge about habits and the heart. No question asks about
// the student's own body, habits or family, and nothing here is a personal risk score.
// Facts are summarised from the linked sources; a second person should re-check each
// source before release (see Issue #3, Definition of done).
import { sources as sharedSources } from './sources';

export const topics = {
  food: 'Food & drink',
  activity: 'Physical activity',
  sleep: 'Sleep',
  stress: 'Stress',
  tobacco: 'Tobacco & vaping',
};

/** One-line takeaway per topic, shown on the results screen. */
export const takeaways = {
  food: 'Less salt and fewer sugary drinks help keep blood pressure and blood vessels healthy.',
  activity: 'About an hour of activity a day makes the heart muscle stronger and more efficient.',
  sleep: 'During sleep, heart rate and blood pressure drop, which gives the heart a rest.',
  stress: 'Stress speeds the heart up for a while; healthy ways of coping help it settle.',
  tobacco: 'Nicotine raises heart rate and blood pressure, and smoking damages blood vessels.',
};

const sources = { ...sharedSources, whoSalt: sharedSources.whoSodium };

/**
 * @typedef {object} QuizQuestion
 * @property {string} id
 * @property {keyof typeof topics} topic
 * @property {string} question
 * @property {{ id: string, text: string }[]} options
 * @property {string} answer       id of the correct option
 * @property {string} explanation  Shown after checking, right or wrong
 * @property {{ label: string, href: string }} source
 */

/** @type {QuizQuestion[]} */
export const questions = [
  {
    id: 'salt',
    topic: 'food',
    question: 'Eating a lot of salt over many years mainly affects the heart by…',
    options: [
      { id: 'a', text: 'Raising blood pressure' },
      { id: 'b', text: 'Making the heart smaller' },
      { id: 'c', text: 'Slowing the heartbeat' },
    ],
    answer: 'a',
    explanation:
      'Too much sodium (from salt) is linked to higher blood pressure, which makes the heart and blood vessels work harder. The WHO suggests adults eat less than 5 g of salt a day (about one teaspoon), and says the limit for children should be lower still.',
    source: sources.whoSalt,
  },
  {
    id: 'sugar-drinks',
    topic: 'food',
    question: 'Which swap is the most heart-friendly choice with lunch?',
    options: [
      { id: 'a', text: 'A large soda instead of a small one' },
      { id: 'b', text: 'Water instead of a sugary drink' },
      { id: 'c', text: 'An energy drink instead of juice' },
    ],
    answer: 'b',
    explanation:
      'Sugary drinks are one of the biggest sources of added sugar. The American Heart Association suggests children and teens have less than 25 g of added sugar a day (about 6 teaspoons).',
    source: sources.ahaSugar,
  },
  {
    id: 'activity-minutes',
    topic: 'activity',
    question: 'How much physical activity does the WHO recommend for young people aged 5 to 17?',
    options: [
      { id: 'a', text: 'About 10 minutes a week' },
      { id: 'b', text: 'An average of at least 60 minutes a day' },
      { id: 'c', text: 'Only on weekends' },
    ],
    answer: 'b',
    explanation:
      'The WHO recommends an average of at least 60 minutes a day of moderate-to-vigorous activity, mostly aerobic, such as brisk walking, cycling, dancing or team sports.',
    source: sources.whoActivity,
  },
  {
    id: 'trained-heart',
    topic: 'activity',
    question: 'With regular exercise, a resting heart usually…',
    options: [
      { id: 'a', text: 'Beats faster all the time' },
      { id: 'b', text: 'Pumps more blood with each beat, so it can beat a little slower at rest' },
      { id: 'c', text: 'Stops needing oxygen' },
    ],
    answer: 'b',
    explanation:
      'The heart is a muscle. Regular activity helps it pump more blood with each beat, which is why very active people often have a lower resting heart rate.',
    source: sources.ahaHeartRate,
  },
  {
    id: 'teen-sleep',
    topic: 'sleep',
    question: 'How much sleep does the CDC recommend for teenagers aged 13 to 17?',
    options: [
      { id: 'a', text: '5 to 6 hours a night' },
      { id: 'b', text: '8 to 10 hours a night' },
      { id: 'c', text: '12 to 14 hours a night' },
    ],
    answer: 'b',
    explanation:
      'The CDC recommends 8 to 10 hours of sleep in every 24 hours for teens aged 13 to 17.',
    source: sources.cdcSleep,
  },
  {
    id: 'sleep-rest',
    topic: 'sleep',
    question: 'What happens to the heart during deep sleep?',
    options: [
      { id: 'a', text: 'Heart rate and blood pressure go down' },
      { id: 'b', text: 'Heart rate doubles' },
      { id: 'c', text: 'The heart stops pumping' },
    ],
    answer: 'a',
    explanation:
      'In deep sleep your heart rate slows and blood pressure drops. Regularly missing sleep takes away this rest time for the heart and blood vessels.',
    source: sources.nhlbiSleep,
  },
  {
    id: 'stress-response',
    topic: 'stress',
    question: 'When you feel stressed before a test, your heart often beats faster because…',
    options: [
      { id: 'a', text: 'The body releases hormones such as adrenaline' },
      { id: 'b', text: 'The heart is running out of blood' },
      { id: 'c', text: 'Your lungs stop working' },
    ],
    answer: 'a',
    explanation:
      'Stress hormones like adrenaline prepare the body for action, so the heart beats faster for a while. This is a normal reaction and settles again afterwards.',
    source: sources.ahaStress,
  },
  {
    id: 'stress-coping',
    topic: 'stress',
    question: 'Which of these is a healthy way to handle stress?',
    options: [
      { id: 'a', text: 'Vaping to calm down' },
      { id: 'b', text: 'Going for a walk or talking to someone you trust' },
      { id: 'c', text: 'Skipping sleep to worry more' },
    ],
    answer: 'b',
    explanation:
      'Physical activity, slow breathing and talking with a trusted adult or friend are healthy ways to cope. If stress feels like too much, talk to a parent, teacher or school counsellor.',
    source: sources.ahaStress,
  },
  {
    id: 'smoking-vessels',
    topic: 'tobacco',
    question: 'How does smoking tobacco affect the heart and blood vessels?',
    options: [
      { id: 'a', text: 'It has no effect on the heart' },
      { id: 'b', text: 'It damages blood vessels and is a major cause of heart disease' },
      { id: 'c', text: 'It makes blood vessels stronger' },
    ],
    answer: 'b',
    explanation:
      'The WHO lists tobacco use as a major cause of heart disease and stroke. Chemicals in smoke damage the lining of blood vessels.',
    source: sources.whoTobacco,
  },
  {
    id: 'vape-nicotine',
    topic: 'tobacco',
    question: 'Do most e-cigarettes (vapes) contain nicotine?',
    options: [
      { id: 'a', text: 'Yes, most do, and nicotine raises heart rate and blood pressure' },
      { id: 'b', text: 'No, vapes only contain water vapour' },
      { id: 'c', text: 'Only vapes with no flavour do' },
    ],
    answer: 'a',
    explanation:
      'Most vapes contain nicotine, which is highly addictive and raises heart rate and blood pressure. Vape aerosol is not just water vapour. If you or a friend want help quitting, talking to a trusted adult is a good first step.',
    source: sources.cdcVaping,
  },
];
