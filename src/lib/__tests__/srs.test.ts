import { describe, expect, it } from 'vitest';
import { applyGrade, todayStr, addDays, getWritingDeck } from '../data';

const fresh = { ease: 2.5, interval_days: 0, reps: 0, lapses: 0 };

describe('applyGrade', () => {
  it('again: resets interval to 0, keeps status learning, reduces ease', () => {
    const r = applyGrade(fresh, 'again');
    expect(r.interval_days).toBe(0);
    expect(r.reps).toBe(0);
    expect(r.lapses).toBe(1);
    expect(r.ease).toBeCloseTo(2.3);
    expect(r.status).toBe('learning');
    expect(r.due_date).toBe(todayStr());
  });

  it('good: first review schedules tomorrow', () => {
    const r = applyGrade(fresh, 'good');
    expect(r.interval_days).toBe(1);
    expect(r.reps).toBe(1);
    expect(r.status).toBe('review');
    expect(r.due_date).toBe(addDays(todayStr(), 1));
  });

  it('easy: first review gets a longer interval', () => {
    const r = applyGrade(fresh, 'easy');
    expect(r.interval_days).toBe(4);
    expect(r.reps).toBe(1);
  });

  it('grows interval with ease on repeated good grades', () => {
    const second = applyGrade({ ease: 2.5, interval_days: 1, reps: 1, lapses: 0 }, 'good');
    expect(second.interval_days).toBe(3); // round(1 * 2.5)
  });

  it('hard: minimal interval growth, ease penalty', () => {
    const r = applyGrade({ ease: 2.5, interval_days: 5, reps: 2, lapses: 0 }, 'hard');
    expect(r.interval_days).toBe(6); // round(5 * 1.2)
    expect(r.ease).toBeCloseTo(2.35);
    expect(r.status).toBe('review');
  });

  it('ease never drops below 1.3 nor exceeds 3.0', () => {
    let s = { ease: 1.35, interval_days: 2, reps: 0, lapses: 5 };
    expect(applyGrade(s, 'again').ease).toBe(1.3);
    s = { ease: 2.95, interval_days: 10, reps: 5, lapses: 0 };
    expect(applyGrade(s, 'easy').ease).toBe(3.0);
  });

  it('marks mastered after 3+ reps with a week+ interval', () => {
    const r = applyGrade({ ease: 2.5, interval_days: 7, reps: 3, lapses: 0 }, 'good');
    expect(r.status).toBe('mastered');
  });
});

describe('todayStr / addDays', () => {
  it('formats YYYY-MM-DD', () => {
    expect(todayStr(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
  it('addDays crosses month boundaries', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });
});

describe('getWritingDeck', () => {
  it('buckets single chars by script and the rest as words', () => {
    const deck = getWritingDeck();
    const isHira = (s: string) => [...s].every((c) => c >= '぀' && c <= 'ゟ');
    const isKata = (s: string) => [...s].every((c) => c >= '゠' && c <= 'ヿ');
    for (const it of deck.hiragana) expect(isHira(it.glyph)).toBe(true);
    for (const it of deck.katakana) expect(isKata(it.glyph)).toBe(true);
    for (const it of deck.words) expect([...it.glyph].length).toBeGreaterThanOrEqual(1);
  });

  it('has no duplicate glyphs within a bucket', () => {
    const deck = getWritingDeck();
    for (const bucket of [deck.hiragana, deck.katakana, deck.words]) {
      const glyphs = bucket.map((i) => i.glyph);
      expect(new Set(glyphs).size).toBe(glyphs.length);
    }
  });
});
