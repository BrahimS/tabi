import { describe, expect, it } from 'vitest';
import { buildQuiz } from '../quiz';
import { LESSONS } from '../content';

describe('buildQuiz', () => {
  it('generates questions for every lesson', () => {
    for (const lesson of LESSONS) {
      const qs = buildQuiz(lesson);
      expect(qs.length, lesson.id).toBeGreaterThan(0);
      expect(qs.length, lesson.id).toBeLessThanOrEqual(12);
    }
  });

  it('never emits malformed questions', () => {
    for (const lesson of LESSONS) {
      for (const q of buildQuiz(lesson)) {
        expect(q.promptLabel, `${lesson.id}:${q.id}`).toBeTruthy();
        if (q.choices) {
          expect(q.choices.length).toBeGreaterThanOrEqual(2);
          expect(q.choices.filter((c) => c.correct)).toHaveLength(1);
        }
        if (q.type === 'type-romaji') {
          expect(q.accept?.length, `${lesson.id}:${q.id}`).toBeGreaterThan(0);
        }
        if (q.type === 'listen') {
          expect(q.promptKana, `${lesson.id}:${q.id}`).toBeTruthy();
        }
      }
    }
  });

  it('has unique question ids per quiz', () => {
    for (const lesson of LESSONS) {
      const ids = buildQuiz(lesson).map((q) => q.id);
      expect(new Set(ids).size, lesson.id).toBe(ids.length);
    }
  });

  it('script lessons use kana/romaji/listen questions only', () => {
    const scriptLessons = LESSONS.filter((l) => l.focus === 'script');
    for (const lesson of scriptLessons) {
      const types = new Set(buildQuiz(lesson).map((q) => q.type));
      for (const t of types) {
        expect(['pick-kana', 'pick-romaji', 'listen']).toContain(t);
      }
    }
  });

  it('every quiz includes listening questions (ear training)', () => {
    for (const lesson of LESSONS) {
      const listens = buildQuiz(lesson).filter((q) => q.type === 'listen');
      expect(listens.length, lesson.id).toBeGreaterThanOrEqual(1);
    }
  });

  it('vocab lessons include meaning questions', () => {
    const vocabLessons = LESSONS.filter((l) => l.focus === 'vocab');
    for (const lesson of vocabLessons) {
      const types = new Set(buildQuiz(lesson).map((q) => q.type));
      expect(types, lesson.id).toContain('pick-meaning');
    }
  });

  it('covers at least as many items as primary slots allow', () => {
    for (const lesson of LESSONS) {
      const items = lesson.vocab.filter((i) => !i.noQuiz);
      const qs = buildQuiz(lesson);
      const covered = new Set(qs.map((q) => q.id.split('-').slice(0, -1).join('-')));
      const listenTarget = Math.min(2, Math.max(1, Math.floor(items.length / 6)));
      const primarySlots =
        (lesson.focus !== 'script' && items.length >= 9 ? 12 - 3 : 12) - listenTarget;
      expect(covered.size, lesson.id).toBeGreaterThanOrEqual(
        Math.min(items.length, Math.max(1, primarySlots)),
      );
    }
  });
});
