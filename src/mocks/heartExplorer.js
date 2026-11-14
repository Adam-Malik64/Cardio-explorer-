// MOCK DATA: content for the 4-Chamber Heart & Blood Flow Explorer (Issue #1).
// A simplified teaching model, not to scale. Facts summarised from the linked AHA and NHLBI
// pages; a second person should re-check them before release (Issue #1, Definition of done).

export const sources = [
  {
    label: 'NHLBI: How the heart works',
    href: 'https://www.nhlbi.nih.gov/health/heart/how-heart-works',
  },
  {
    label: 'American Heart Association: How the healthy heart works',
    href: 'https://www.heart.org/en/health-topics/congenital-heart-defects/about-congenital-heart-defects/how-the-healthy-heart-works',
  },
];

/**
 * @typedef {object} HeartPart
 * @property {string} id
 * @property {string} name
 * @property {'chamber' | 'valve'} kind
 * @property {'right' | 'left'} side       The heart's own side (not the viewer's)
 * @property {'oxygen-poor' | 'oxygen-rich'} blood
 * @property {string} job
 * @property {string} next                Where blood goes after this part
 */

/** @type {HeartPart[]} Listed in diagram reading order (top to bottom, viewer's left to right). */
export const parts = [
  {
    id: 'right-atrium',
    name: 'Right atrium',
    kind: 'chamber',
    side: 'right',
    blood: 'oxygen-poor',
    job: 'Collects oxygen-poor blood coming back from the body through two large veins, the superior and inferior vena cava.',
    next: 'Through the tricuspid valve into the right ventricle.',
  },
  {
    id: 'left-atrium',
    name: 'Left atrium',
    kind: 'chamber',
    side: 'left',
    blood: 'oxygen-rich',
    job: 'Collects oxygen-rich blood coming back from the lungs through the pulmonary veins.',
    next: 'Through the mitral valve into the left ventricle.',
  },
  {
    id: 'tricuspid-valve',
    name: 'Tricuspid valve',
    kind: 'valve',
    side: 'right',
    blood: 'oxygen-poor',
    job: 'A valve with three flaps between the right atrium and right ventricle. It opens to let blood down and closes so blood cannot flow back up.',
    next: 'Into the right ventricle.',
  },
  {
    id: 'mitral-valve',
    name: 'Mitral valve',
    kind: 'valve',
    side: 'left',
    blood: 'oxygen-rich',
    job: 'A valve with two flaps between the left atrium and left ventricle. It is also called the bicuspid valve and stops blood flowing backwards.',
    next: 'Into the left ventricle.',
  },
  {
    id: 'right-ventricle',
    name: 'Right ventricle',
    kind: 'chamber',
    side: 'right',
    blood: 'oxygen-poor',
    job: 'Squeezes to pump oxygen-poor blood out to the lungs to pick up oxygen.',
    next: 'Through the pulmonary valve into the pulmonary artery, then to the lungs.',
  },
  {
    id: 'left-ventricle',
    name: 'Left ventricle',
    kind: 'chamber',
    side: 'left',
    blood: 'oxygen-rich',
    job: 'The strongest chamber, with the thickest muscle wall. It pumps oxygen-rich blood out to the whole body.',
    next: 'Through the aortic valve into the aorta, then to the body.',
  },
  {
    id: 'pulmonary-valve',
    name: 'Pulmonary valve',
    kind: 'valve',
    side: 'right',
    blood: 'oxygen-poor',
    job: 'Sits between the right ventricle and the pulmonary artery. It lets blood out to the lungs and stops it flowing back into the ventricle.',
    next: 'Into the pulmonary artery, which leads to the lungs.',
  },
  {
    id: 'aortic-valve',
    name: 'Aortic valve',
    kind: 'valve',
    side: 'left',
    blood: 'oxygen-rich',
    job: 'Sits between the left ventricle and the aorta. It lets blood out to the body and stops it flowing back into the ventricle.',
    next: 'Into the aorta, the body’s largest artery.',
  },
];

/**
 * One full trip around the double loop, starting where blood returns from the body.
 * `part` links a step to a part in the diagram; lungs/body steps have no part.
 */
export const tourSteps = [
  {
    part: 'right-atrium',
    loop: 'Body loop (systemic) → heart',
    blood: 'oxygen-poor',
    text: 'Oxygen-poor blood returns from the body through the vena cava into the right atrium.',
  },
  {
    part: 'tricuspid-valve',
    loop: 'Lungs loop (pulmonary)',
    blood: 'oxygen-poor',
    text: 'The tricuspid valve opens and blood flows down into the right ventricle.',
  },
  {
    part: 'right-ventricle',
    loop: 'Lungs loop (pulmonary)',
    blood: 'oxygen-poor',
    text: 'The right ventricle squeezes and pushes the blood upwards.',
  },
  {
    part: 'pulmonary-valve',
    loop: 'Lungs loop (pulmonary)',
    blood: 'oxygen-poor',
    text: 'Blood passes through the pulmonary valve into the pulmonary artery.',
  },
  {
    part: null,
    place: 'Lungs',
    loop: 'Lungs loop (pulmonary)',
    blood: 'oxygen-poor → oxygen-rich',
    text: 'In the lungs, blood drops off carbon dioxide (which you breathe out) and picks up oxygen.',
  },
  {
    part: 'left-atrium',
    loop: 'Lungs loop (pulmonary) → heart',
    blood: 'oxygen-rich',
    text: 'Oxygen-rich blood returns through the pulmonary veins into the left atrium.',
  },
  {
    part: 'mitral-valve',
    loop: 'Body loop (systemic)',
    blood: 'oxygen-rich',
    text: 'The mitral valve opens and blood flows down into the left ventricle.',
  },
  {
    part: 'left-ventricle',
    loop: 'Body loop (systemic)',
    blood: 'oxygen-rich',
    text: 'The left ventricle, the strongest chamber, squeezes hard.',
  },
  {
    part: 'aortic-valve',
    loop: 'Body loop (systemic)',
    blood: 'oxygen-rich',
    text: 'Blood passes through the aortic valve into the aorta.',
  },
  {
    part: null,
    place: 'Body',
    loop: 'Body loop (systemic)',
    blood: 'oxygen-rich → oxygen-poor',
    text: 'Arteries carry the blood around the body. In tiny capillaries it delivers oxygen to cells and picks up carbon dioxide, then veins carry it back to the heart, and the loop starts again.',
  },
];
