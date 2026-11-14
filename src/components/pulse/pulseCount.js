// Pulse-counting practice (Issue #2, Story 1): turns a typed 15-second beat count into BPM.
// Pure functions only, so the rules can be unit tested without rendering anything.
// Messages are friendly and never suggest that a number is medically good or bad.

export const COUNT_SECONDS = 15;
export const MULTIPLIER = 60 / COUNT_SECONDS; // 4
export const MIN_COUNT = 1;
export const MAX_COUNT = 60; // 60 beats in 15 s = 240 BPM, beyond any plausible count

/** Longest non-numeric text we still treat as a typo rather than a paste. */
const LONG_TEXT_LENGTH = 20;
/** Longest run of digits that can be a real 15-second count. */
const MAX_DIGITS = 3;

export const messages = {
  empty: 'Type the number of beats you counted.',
  notNumber: 'Please use numbers only, for example 18.',
  tooLong: "That's longer than we expected. Type a number from 1 to 60.",
  negative: "A count can't be negative. Type a number from 1 to 60.",
  decimal: 'Count whole beats only, for example 18.',
  zero: 'Looks like no beats were counted. Try finding your pulse again, or ask your teacher for help.',
  tooHigh:
    "That number is higher than we'd expect for 15 seconds. It's easy to miscount, so try counting again.",
};

/**
 * Validates the raw text from the count input.
 * @param {string} raw  Whatever the student typed.
 * @returns {{ ok: true, count: number, bpm: number } | { ok: false, error: string }}
 */
export function checkPulseCount(raw) {
  const text = String(raw ?? '').trim();

  if (text === '') return { ok: false, error: messages.empty };
  if (/^-\s*\d+([.,]\d+)?$/.test(text)) return { ok: false, error: messages.negative };
  if (/^\d+[.,]\d+$/.test(text)) return { ok: false, error: messages.decimal };

  if (!/^\d+$/.test(text)) {
    // Anything else with letters or symbols ("abc", "12abc", "1e2", a pasted paragraph)
    return { ok: false, error: text.length > LONG_TEXT_LENGTH ? messages.tooLong : messages.notNumber };
  }

  if (text.length > MAX_DIGITS) return { ok: false, error: messages.tooLong };

  const count = Number.parseInt(text, 10);
  if (count < MIN_COUNT) return { ok: false, error: messages.zero };
  if (count > MAX_COUNT) return { ok: false, error: messages.tooHigh };

  return { ok: true, count, bpm: count * MULTIPLIER };
}
