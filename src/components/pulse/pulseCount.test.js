// Unit tests for the pulse-count validation rules (Issue #2, Story 1, table V1–V7).
// These test the spec's rules, not the implementation details of checkPulseCount.
import { describe, expect, it } from 'vitest';
import { checkPulseCount, COUNT_SECONDS, MAX_COUNT, messages, MIN_COUNT, MULTIPLIER } from './pulseCount';

const SPEC = {
  empty: 'Type the number of beats you counted.',
  notNumber: 'Please use numbers only, for example 18.',
  tooLong: "That's longer than we expected. Type a number from 1 to 60.",
  negative: "A count can't be negative. Type a number from 1 to 60.",
  decimal: 'Count whole beats only, for example 18.',
  zero: 'Looks like no beats were counted. Try finding your pulse again, or ask your teacher for help.',
  tooHigh:
    "That number is higher than we'd expect for 15 seconds. It's easy to miscount, so try counting again.",
};

function expectError(raw, message) {
  const result = checkPulseCount(raw);
  expect(result.ok).toBe(false);
  expect(result.error).toBe(message);
  expect(result).not.toHaveProperty('bpm');
}

describe('constants', () => {
  it('uses a 15-second window and a ×4 multiplier with range 1–60', () => {
    expect(COUNT_SECONDS).toBe(15);
    expect(MULTIPLIER).toBe(4);
    expect(MIN_COUNT).toBe(1);
    expect(MAX_COUNT).toBe(60);
  });

  it('messages use the spec wording', () => {
    expect(messages).toEqual(SPEC);
  });
});

describe('checkPulseCount: happy path', () => {
  it('18 → 72 BPM', () => {
    expect(checkPulseCount('18')).toEqual({ ok: true, count: 18, bpm: 72 });
  });

  it.each([
    ['1', 1, 4],
    ['60', 60, 240],
    ['2', 2, 8],
    ['59', 59, 236],
  ])('boundary %s → %i × 4 = %i', (raw, count, bpm) => {
    expect(checkPulseCount(raw)).toEqual({ ok: true, count, bpm });
  });

  it.each([' 18 ', '18 ', ' 18', '\t18\n', ' 18 '])(
    'ignores leading/trailing whitespace: %j',
    (raw) => {
      expect(checkPulseCount(raw)).toEqual({ ok: true, count: 18, bpm: 72 });
    },
  );

  it('accepts a number value as well as a string', () => {
    expect(checkPulseCount(18)).toEqual({ ok: true, count: 18, bpm: 72 });
  });
});

describe('V1: empty', () => {
  it.each(['', ' ', '     ', '\t', '\n'])('empty/whitespace %j', (raw) => {
    expectError(raw, SPEC.empty);
  });

  it.each([null, undefined])('%s is treated as empty and does not throw', (raw) => {
    expect(() => checkPulseCount(raw)).not.toThrow();
    expectError(raw, SPEC.empty);
  });
});

describe('V2: non-numeric', () => {
  it.each(['abc', '12abc', 'abc12', '1e2', 'e', 'eighteen', '1 8', '0x12', '+18', '#', '!', '$18', '18%', '-', '½', '١٨'])(
    '%j → numbers only',
    (raw) => {
      expectError(raw, SPEC.notNumber);
    },
  );

  it('does not interpret 1e2 as 100 (it must not reach the too-high message)', () => {
    expect(checkPulseCount('1e2').error).not.toBe(SPEC.tooHigh);
  });
});

describe('V3: very long text', () => {
  it.each(['99999999999', '1234', '0018', '1000000000000000000000000000'])(
    'long digit string %j → too long',
    (raw) => {
      expectError(raw, SPEC.tooLong);
    },
  );

  it('a pasted paragraph of 500+ characters → too long', () => {
    const paragraph =
      'I counted my pulse during PE and it felt really fast, maybe around eighteen or nineteen beats, '.repeat(6);
    expect(paragraph.length).toBeGreaterThan(500);
    expectError(paragraph, SPEC.tooLong);
  });

  it('a 10,000-character string does not throw and is rejected as too long', () => {
    const huge = 'x'.repeat(10_000);
    expect(() => checkPulseCount(huge)).not.toThrow();
    expectError(huge, SPEC.tooLong);
  });

  it('the error message never echoes the raw input back', () => {
    const paragraph = 'secret-ish text the student pasted '.repeat(20);
    const result = checkPulseCount(paragraph);
    expect(result.error).not.toContain('secret-ish');
  });
});

describe('V4: negative', () => {
  it.each(['-5', '-1', '-18', ' -5 ', '-0'])('%j → negative message', (raw) => {
    expectError(raw, SPEC.negative);
  });
});

describe('V5: decimal', () => {
  it.each(['17.5', '18,5', '0.5', '18.0', ' 17.5 '])('%j → whole beats only (not rounded)', (raw) => {
    expectError(raw, SPEC.decimal);
  });
});

describe('V6: zero', () => {
  it.each(['0', '00', '000', ' 0 '])('%j → no beats counted', (raw) => {
    expectError(raw, SPEC.zero);
  });
});

describe('V7: above 60', () => {
  it.each(['61', '75', '100', '240', '999'])('%j → higher than expected', (raw) => {
    expectError(raw, SPEC.tooHigh);
  });
});

describe('tone of the messages', () => {
  it('no message suggests a medical problem or blames the student', () => {
    for (const msg of Object.values(messages)) {
      expect(msg).not.toMatch(/abnormal|unhealthy|danger|warning|emergency|doctor|wrong with|too high|too low|you failed|invalid/i);
    }
  });
});
