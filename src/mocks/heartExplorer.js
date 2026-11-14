// MOCK DATA: content for the 4-Chamber Heart & Blood Flow Explorer (Issue #1).
// A simplified teaching model, not to scale. Facts summarised from the linked NHLBI pages;
// a second person should re-check them before release (Issue #1, Definition of done).

import { sources as allSources } from './sources';

export const sources = [allSources.nhlbiBloodFlow, allSources.nhlbiAnatomy];

/**
 * @typedef {object} HeartPart
 * @property {string} id
 * @property {string} name
 * @property {'chamber' | 'valve'} kind
 * @property {'right' | 'left'} side       The heart's own side (not the viewer's)
 * @property {'oxygen-poor' | 'oxygen-rich'} blood
 * @property {string} job
 * @property {string} next                Where blood goes after this part
 * @property {string} gridArea            Position in the diagram grid
 */

/**
 * @type {HeartPart[]} Listed in blood-path order (right side first), which is also the
 * keyboard Tab order. `gridArea` places each part in the diagram (see .heart-diagram in
 * global.css): the pulmonary and aortic valves sit on top, where blood leaves the ventricles
 * upwards into the arteries.
 */
export const parts = [
  {
    id: 'right-atrium',
    gridArea: 'ra',
    name: 'Right atrium',
    kind: 'chamber',
    side: 'right',
    blood: 'oxygen-poor',
    job: 'Collects oxygen-poor blood coming back from the body through two large veins, the superior and inferior vena cava.',
    next: 'Through the tricuspid valve into the right ventricle.',
  },
  {
    id: 'tricuspid-valve',
    gridArea: 'tv',
    name: 'Tricuspid valve',
    kind: 'valve',
    side: 'right',
    blood: 'oxygen-poor',
    job: 'A valve with three flaps between the right atrium and right ventricle. It opens to let blood down and closes so blood cannot flow back up.',
    next: 'Into the right ventricle.',
  },
  {
    id: 'right-ventricle',
    gridArea: 'rv',
    name: 'Right ventricle',
    kind: 'chamber',
    side: 'right',
    blood: 'oxygen-poor',
    job: 'Squeezes to pump oxygen-poor blood out to the lungs to pick up oxygen.',
    next: 'Through the pulmonary valve into the pulmonary artery, then to the lungs.',
  },
  {
    id: 'pulmonary-valve',
    gridArea: 'pv',
    name: 'Pulmonary valve',
    kind: 'valve',
    side: 'right',
    blood: 'oxygen-poor',
    job: 'Sits between the right ventricle and the pulmonary artery. It lets blood out to the lungs and stops it flowing back into the ventricle.',
    next: 'Into the pulmonary artery, which leads to the lungs.',
  },
  {
    id: 'left-atrium',
    gridArea: 'la',
    name: 'Left atrium',
    kind: 'chamber',
    side: 'left',
    blood: 'oxygen-rich',
    job: 'Collects oxygen-rich blood coming back from the lungs through the pulmonary veins.',
    next: 'Through the mitral valve into the left ventricle.',
  },
  {
    id: 'mitral-valve',
    gridArea: 'mv',
    name: 'Mitral valve',
    kind: 'valve',
    side: 'left',
    blood: 'oxygen-rich',
    job: 'A valve with two flaps between the left atrium and left ventricle. It is also called the bicuspid valve and stops blood flowing backwards.',
    next: 'Into the left ventricle.',
  },
  {
    id: 'left-ventricle',
    gridArea: 'lv',
    name: 'Left ventricle',
    kind: 'chamber',
    side: 'left',
    blood: 'oxygen-rich',
    job: 'The strongest chamber, with the thickest muscle wall. It pumps oxygen-rich blood out to the whole body.',
    next: 'Through the aortic valve into the aorta, then to the body.',
  },
  {
    id: 'aortic-valve',
    gridArea: 'av',
    name: 'Aortic valve',
    kind: 'valve',
    side: 'left',
    blood: 'oxygen-rich',
    job: 'Sits between the left ventricle and the aorta. It lets blood out to the body and stops it flowing back into the ventricle.',
    next: 'Into the aorta, the body’s largest artery.',
  },
];

/**
 * @typedef {object} TourStep
 * @property {string | null} part   Part id highlighted in the diagram, or null for lungs/body
 * @property {string} [place]       Where the blood is when `part` is null ('Lungs' | 'Body')
 * @property {string} loop          Which loop this step belongs to, in words
 * @property {string} blood         Oxygen status in words; may show a change, e.g. 'a → b'
 * @property {string} text          What happens at this step
 */

/**
 * One full trip around the double loop, starting where blood returns from the body.
 * `part` links a step to a part in the diagram; lungs/body steps have no part.
 */
/** @type {TourStep[]} */
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
