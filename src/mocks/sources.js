// Every external source cited by the app's learning content, in one place, so a moved page
// or a re-check only needs fixing once.
//
// `checked` is the date an automated link check confirmed the page loads and supports the
// claim it is cited for. heart.org blocks automated readers, so AHA pages have
// `checked: ''` and need a person to open and confirm them (see docs/issue-specs.md).

/**
 * @typedef {object} Source
 * @property {string} organisation  Short name shown to students, e.g. 'WHO'
 * @property {string} label         Page title as shown in links
 * @property {string} href          https URL
 * @property {string} checked       YYYY-MM-DD of the last successful check, or '' if unverified
 */

/** @type {Record<string, Source>} */
export const sources = {
  whoSodium: {
    organisation: 'WHO',
    label: 'WHO: Sodium reduction fact sheet',
    href: 'https://www.who.int/news-room/fact-sheets/detail/sodium-reduction',
    checked: '2026-11-14',
  },
  whoActivity: {
    organisation: 'WHO',
    label: 'WHO: Physical activity fact sheet',
    href: 'https://www.who.int/news-room/fact-sheets/detail/physical-activity',
    checked: '2026-11-14',
  },
  whoTobacco: {
    organisation: 'WHO',
    label: 'WHO: Tobacco fact sheet',
    href: 'https://www.who.int/news-room/fact-sheets/detail/tobacco',
    checked: '2026-11-14',
  },
  cdcIntensity: {
    organisation: 'CDC',
    label: 'CDC: How to measure physical activity intensity',
    href: 'https://www.cdc.gov/physical-activity-basics/measuring/index.html',
    checked: '2026-11-14',
  },
  cdcSleep: {
    organisation: 'CDC',
    label: 'CDC: About sleep',
    href: 'https://www.cdc.gov/sleep/about/index.html',
    checked: '2026-11-14',
  },
  cdcVaping: {
    organisation: 'CDC',
    label: 'CDC: E-cigarettes (vapes)',
    href: 'https://www.cdc.gov/tobacco/e-cigarettes/index.html',
    checked: '2026-11-14',
  },
  nhlbiBloodFlow: {
    organisation: 'NHLBI',
    label: 'NHLBI: How blood flows through the heart',
    href: 'https://www.nhlbi.nih.gov/health/heart/blood-flow',
    checked: '2026-11-14',
  },
  nhlbiAnatomy: {
    organisation: 'NHLBI',
    label: 'NHLBI: What the heart looks like',
    href: 'https://www.nhlbi.nih.gov/health/heart/anatomy',
    checked: '2026-11-14',
  },
  nhlbiSleep: {
    organisation: 'NHLBI',
    label: 'NHLBI: How sleep affects your health',
    href: 'https://www.nhlbi.nih.gov/health/sleep-deprivation/health-effects',
    checked: '2026-11-14',
  },
  ahaTargetHeartRates: {
    organisation: 'AHA',
    label: 'American Heart Association: Target heart rates chart',
    href: 'https://www.heart.org/en/healthy-living/fitness/fitness-basics/target-heart-rates',
    checked: '',
  },
  ahaHeartRate: {
    organisation: 'AHA',
    label: 'American Heart Association: All about heart rate',
    href: 'https://www.heart.org/en/health-topics/high-blood-pressure/the-facts-about-high-blood-pressure/all-about-heart-rate-pulse',
    checked: '',
  },
  ahaBloodPressure: {
    organisation: 'AHA',
    label: 'American Heart Association: Understanding blood pressure readings',
    href: 'https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings',
    checked: '',
  },
  ahaSugar: {
    organisation: 'AHA',
    label: 'American Heart Association: Added sugars',
    href: 'https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/sugar/added-sugars',
    checked: '',
  },
  ahaStress: {
    organisation: 'AHA',
    label: 'American Heart Association: Stress and heart health',
    href: 'https://www.heart.org/en/healthy-living/healthy-lifestyle/stress-management/stress-and-heart-health',
    checked: '',
  },
};
