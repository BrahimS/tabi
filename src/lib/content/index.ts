import type { Lesson, Unit, UnitDraft, VocabItem } from '../types';
import { unit1 } from './unit1';
import { unit2 } from './unit2';
import { unit3 } from './unit3';
import { unit4 } from './unit4';
import { unit5 } from './unit5';
import { unit6 } from './unit6';

const DRAFTS: UnitDraft[] = [unit1, unit2, unit3, unit4, unit5, unit6];

export const UNITS: Unit[] = DRAFTS.map((d) => ({
  ...d,
  lessons: d.lessons.map((l, i) => ({
    ...l,
    unitId: d.id,
    order: i + 1,
  })),
})).sort((a, b) => a.order - b.order);

export const LESSONS: Lesson[] = UNITS.flatMap((u) => u.lessons);

export const LESSON_INDEX = new Map(LESSONS.map((l) => [l.id, l]));
export const UNIT_INDEX = new Map(UNITS.map((u) => [u.id, u]));

/** Base XP for completing a lesson (before accuracy bonus). */
export function lessonXp(lesson: Lesson): number {
  return lesson.vocab.length * 2;
}

/** Stable key for a vocab item in the review deck. */
export function vocabKey(lessonId: string, itemId: string): string {
  return `${lessonId}:${itemId}`;
}

export interface VocabRef {
  key: string;
  lesson: Lesson;
  item: VocabItem;
}

export const VOCAB_INDEX = new Map<string, VocabRef>();
for (const lesson of LESSONS) {
  for (const item of lesson.vocab) {
    VOCAB_INDEX.set(vocabKey(lesson.id, item.id), { key: vocabKey(lesson.id, item.id), lesson, item });
  }
}
