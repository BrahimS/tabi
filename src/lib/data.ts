import { getDb } from './db';
import {
  LESSONS,
  UNITS,
  UNIT_INDEX,
  LESSON_INDEX,
  VOCAB_INDEX,
  lessonXp,
} from './content';
import type { Lesson, Unit, VocabItem } from './types';

// ---------- dates ----------

export function todayStr(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return todayStr(d);
}

// ---------- profile & user state ----------

export interface Profile {
  display_name: string;
  level: string;
  goal: string;
  motivation: string;
  created_at: string;
}

export function getProfile(): Profile {
  const db = getDb();
  const row = db.prepare('SELECT * FROM profile WHERE id = 1').get() as Profile | undefined;
  return (
    row ?? {
      display_name: '',
      level: 'complete_beginner',
      goal: 'travel_japan',
      motivation: '',
      created_at: '',
    }
  );
}

export interface UserState {
  xp: number;
  streak: number;
  last_active_date: string | null;
}

export function getUserState(): UserState {
  const db = getDb();
  const row = db
    .prepare('SELECT xp, streak, last_active_date FROM user_state WHERE id = 1')
    .get() as UserState | undefined;
  return row ?? { xp: 0, streak: 0, last_active_date: null };
}

/** Call whenever the user does meaningful activity (lesson, review). */
export function touchActivity(): void {
  const db = getDb();
  const today = todayStr();
  const yesterday = addDays(today, -1);
  const s = getUserState();
  let streak = s.streak;
  if (s.last_active_date === today) {
    // same day — keep streak
  } else if (s.last_active_date === yesterday) {
    streak += 1;
  } else {
    streak = 1;
  }
  db.prepare('UPDATE user_state SET streak = ?, last_active_date = ? WHERE id = 1').run(
    streak,
    today,
  );
}

export function addXp(amount: number): void {
  const db = getDb();
  db.prepare('UPDATE user_state SET xp = xp + ? WHERE id = 1').run(amount);
}

// ---------- lesson progress ----------

export type LessonStatus = 'not_started' | 'in_progress' | 'completed';

export interface LessonState {
  lessonId: string;
  status: LessonStatus;
  unlocked: boolean;
  bestAccuracy: number;
  attempts: number;
  xpEarned: number;
  completedAt: string | null;
}

export function getPathStates(): LessonState[] {
  const db = getDb();
  const rows = db
    .prepare('SELECT * FROM lesson_progress')
    .all() as {
    lesson_id: string;
    status: string;
    best_accuracy: number;
    attempts: number;
    xp_earned: number;
    completed_at: string | null;
  }[];
  const map = new Map(rows.map((r) => [r.lesson_id, r]));

  let prevCompleted = true; // virtual "lesson before the first" is done
  return LESSONS.map((lesson) => {
    const row = map.get(lesson.id);
    const status = (row?.status as LessonStatus) ?? 'not_started';
    const unlocked = prevCompleted;
    prevCompleted = status === 'completed';
    return {
      lessonId: lesson.id,
      status,
      unlocked,
      bestAccuracy: row?.best_accuracy ?? 0,
      attempts: row?.attempts ?? 0,
      xpEarned: row?.xp_earned ?? 0,
      completedAt: row?.completed_at ?? null,
    };
  });
}

export function getLessonState(lessonId: string): LessonState | undefined {
  return getPathStates().find((s) => s.lessonId === lessonId);
}

export function getNextLesson(lessonId: string): Lesson | undefined {
  const idx = LESSONS.findIndex((l) => l.id === lessonId);
  return idx >= 0 ? LESSONS[idx + 1] : undefined;
}

// ---------- vocab / review deck ----------

export interface VocabStateRow {
  vocab_key: string;
  lesson_id: string;
  status: string;
  ease: number;
  interval_days: number;
  due_date: string;
  reps: number;
  lapses: number;
  last_reviewed: string | null;
}

export interface ReviewCard {
  key: string;
  lessonId: string;
  lessonTitle: string;
  unitTitle: string;
  kana: string;
  romaji: string;
  meaning: string;
  tag?: string;
  note?: string;
  alt?: string[];
  example?: { kana: string; romaji: string; meaning: string };
}

export function rowToReviewCard(row: VocabStateRow): ReviewCard | null {
  const ref = VOCAB_INDEX.get(row.vocab_key);
  if (!ref) return null;
  const unit = UNIT_INDEX.get(ref.lesson.unitId);
  return {
    key: row.vocab_key,
    lessonId: ref.lesson.id,
    lessonTitle: ref.lesson.title,
    unitTitle: unit?.title ?? '',
    kana: ref.item.kana,
    romaji: ref.item.romaji,
    meaning: ref.item.meaning,
    tag: ref.item.tag,
    note: ref.item.note,
    alt: ref.item.alt,
    example: ref.item.example,
  };
}

export function getDueVocab(limit = 40): ReviewCard[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT * FROM vocab_state
       WHERE due_date <= ?
       ORDER BY due_date ASC, last_reviewed ASC
       LIMIT ?`,
    )
    .all(todayStr(), limit) as unknown as VocabStateRow[];
  return rows.map(rowToReviewCard).filter((c): c is ReviewCard => c !== null);
}

export function getDueCount(): number {
  const db = getDb();
  const row = db
    .prepare('SELECT COUNT(*) AS c FROM vocab_state WHERE due_date <= ?')
    .get(todayStr()) as { c: number };
  return row.c;
}

export function getVocabState(vocabKeyStr: string): VocabStateRow | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM vocab_state WHERE vocab_key = ?').get(vocabKeyStr) as
    | VocabStateRow
    | undefined;
}

export type Grade = 'again' | 'hard' | 'good' | 'easy';

export interface ReviewResult {
  interval_days: number;
  ease: number;
  reps: number;
  lapses: number;
  due_date: string;
  status: string;
}

/** Simplified SM-2 scheduling. */
export function applyGrade(
  state: Pick<VocabStateRow, 'ease' | 'interval_days' | 'reps' | 'lapses'>,
  grade: Grade,
): ReviewResult {
  let { ease, reps, lapses } = state;
  let interval = state.interval_days;

  if (grade === 'again') {
    interval = 0;
    reps = 0;
    lapses += 1;
    ease = Math.max(1.3, ease - 0.2);
  } else if (grade === 'hard') {
    interval = interval <= 0 ? 1 : Math.max(1, Math.round(interval * 1.2));
    reps += 1;
    ease = Math.max(1.3, ease - 0.15);
  } else if (grade === 'good') {
    interval = interval <= 0 ? 1 : Math.max(1, Math.round(interval * ease));
    reps += 1;
  } else {
    // easy
    interval = interval <= 0 ? 4 : Math.max(2, Math.round(interval * ease * 1.35));
    reps += 1;
    ease = Math.min(3.0, ease + 0.15);
  }

  const status = reps >= 3 && interval >= 7 ? 'mastered' : reps > 0 ? 'review' : 'learning';
  return {
    interval_days: interval,
    ease,
    reps,
    lapses,
    due_date: addDays(todayStr(), interval),
    status,
  };
}

// ---------- dashboard & stats ----------

export interface AttemptRow {
  lesson_id: string;
  correct: number;
  total: number;
  xp_earned: number;
  created_at: string;
}

export interface DashboardData {
  profile: Profile;
  state: UserState;
  stats: {
    lessonsCompleted: number;
    totalLessons: number;
    wordsLearned: number;
    masteredWords: number;
    dueReviews: number;
    totalXpPossible: number;
  };
  nextLesson: { lesson: Lesson; unit: Unit } | null;
  currentLesson: { lesson: Lesson; unit: Unit } | null;
  recentAttempts: (AttemptRow & { lessonTitle: string })[];
}

export function getDashboardData(): DashboardData {
  const db = getDb();
  const profile = getProfile();
  const state = getUserState();
  const path = getPathStates();

  const progressRows = db
    .prepare("SELECT lesson_id, status FROM lesson_progress WHERE status = 'completed'")
    .all() as { lesson_id: string }[];
  const lessonsCompleted = progressRows.length;

  const wordsRow = db.prepare('SELECT COUNT(*) AS c FROM vocab_state').get() as { c: number };
  const masteredRow = db
    .prepare("SELECT COUNT(*) AS c FROM vocab_state WHERE status = 'mastered'")
    .get() as { c: number };
  const dueReviews = getDueCount();

  const totalXpPossible = LESSONS.reduce((s, l) => s + lessonXp(l), 0);

  // next lesson = first not completed
  const nextIdx = path.findIndex((s) => s.status !== 'completed');
  const nextLesson =
    nextIdx >= 0
      ? {
          lesson: LESSONS[nextIdx],
          unit: UNIT_INDEX.get(LESSONS[nextIdx].unitId)!,
        }
      : null;

  // current lesson = first in_progress, else next
  const inProgressIdx = path.findIndex((s) => s.status === 'in_progress');
  const currentIdx = inProgressIdx >= 0 ? inProgressIdx : nextIdx;
  const currentLesson =
    currentIdx >= 0
      ? { lesson: LESSONS[currentIdx], unit: UNIT_INDEX.get(LESSONS[currentIdx].unitId)! }
      : null;

  const attempts = db
    .prepare('SELECT * FROM quiz_attempts ORDER BY created_at DESC LIMIT 5')
    .all() as unknown as AttemptRow[];
  const recentAttempts = attempts.map((a) => ({
    ...a,
    lessonTitle: LESSON_INDEX.get(a.lesson_id)?.title ?? a.lesson_id,
  }));

  return {
    profile,
    state,
    stats: {
      lessonsCompleted,
      totalLessons: LESSONS.length,
      wordsLearned: wordsRow.c,
      masteredWords: masteredRow.c,
      dueReviews,
      totalXpPossible,
    },
    nextLesson,
    currentLesson,
    recentAttempts,
  };
}

// ---------- writing practice ----------

export interface WritingItem {
  glyph: string;
  romaji: string;
  meaning?: string;
  practiceCount: number;
}

export interface WritingDeck {
  hiragana: WritingItem[];
  katakana: WritingItem[];
  words: WritingItem[];
}

const isAllIn = (s: string, lo: number, hi: number) =>
  [...s].every((c) => c.codePointAt(0)! >= lo && c.codePointAt(0)! <= hi);

export function getWritingDeck(): WritingDeck {
  const db = getDb();
  const countRows = db
    .prepare('SELECT glyph, count FROM writing_practice')
    .all() as unknown as { glyph: string; count: number }[];
  const counts = new Map(countRows.map((r) => [r.glyph, r.count]));

  const hiragana: WritingItem[] = [];
  const katakana: WritingItem[] = [];
  const words: WritingItem[] = [];
  const seen = { hiragana: new Set<string>(), katakana: new Set<string>(), words: new Set<string>() };

  const push = (bucket: WritingItem[], set: Set<string>, item: Omit<WritingItem, 'practiceCount'>) => {
    if (set.has(item.glyph)) return;
    set.add(item.glyph);
    bucket.push({ ...item, practiceCount: counts.get(item.glyph) ?? 0 });
  };

  for (const lesson of LESSONS) {
    for (const item of lesson.vocab) {
      const g = item.kana;
      if (!g) continue;
      const chars = [...g];
      if (chars.length === 1) {
        if (isAllIn(g, 0x3040, 0x309f)) push(hiragana, seen.hiragana, { glyph: g, romaji: item.romaji });
        else if (isAllIn(g, 0x30a0, 0x30ff)) push(katakana, seen.katakana, { glyph: g, romaji: item.romaji });
        else push(words, seen.words, { glyph: g, romaji: item.romaji, meaning: item.meaning });
      } else if (chars.length <= 8) {
        push(words, seen.words, { glyph: g, romaji: item.romaji, meaning: item.meaning });
      }
    }
  }

  return { hiragana, katakana, words };
}

export { UNITS, LESSONS, UNIT_INDEX, LESSON_INDEX, lessonXp };
export type { Lesson, Unit, VocabItem };
