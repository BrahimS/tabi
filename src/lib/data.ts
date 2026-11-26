import { getDb } from './db';
import { TRIP_SCENARIOS } from './trip';
import type { TripItem, TripScenario } from './trip';
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

// ---------- stats ----------

export interface DayXp {
  date: string;
  xp: number;
}

export interface UnitStat {
  unitId: string;
  title: string;
  lessonsDone: number;
  lessonsTotal: number;
  vocabInDeck: number;
  vocabMastered: number;
  vocabTotal: number;
  bestAvgAccuracy: number;
}

export interface WeakWord {
  key: string;
  kana: string;
  romaji: string;
  meaning: string;
  lapses: number;
  ease: number;
  lessonTitle: string;
}

export interface Stats {
  xp: number;
  streak: number;
  lessonsCompleted: number;
  lessonsTotal: number;
  vocabInDeck: number;
  vocabMastered: number;
  vocabTotal: number;
  dueToday: number;
  quizAttempts: number;
  avgAccuracy: number;
  writingGlyphs: number;
  writingStrokes: number;
  dialoguesPlayed: number;
  dialogueXp: number;
  tripSessions: number;
  tripBestScore: number;
  tripTotalAnswered: number;
  xpByDay: DayXp[];
  units: UnitStat[];
  weakest: WeakWord[];
}

export function getStats(): Stats {
  const db = getDb();
  const { xp, streak } = getUserState();
  const states = getPathStates();
  const progressByLesson = new Map(states.map((s) => [s.lessonId, s]));

  const vocabRows = db
    .prepare(
      `SELECT lesson_id, status, ease, reps, lapses, vocab_key FROM vocab_state`,
    )
    .all() as {
    lesson_id: string;
    status: string;
    ease: number;
    reps: number;
    lapses: number;
    vocab_key: string;
  }[];

  const byLesson = new Map<string, { deck: number; mastered: number }>();
  let vocabMastered = 0;
  for (const r of vocabRows) {
    const e = byLesson.get(r.lesson_id) ?? { deck: 0, mastered: 0 };
    e.deck += 1;
    if (r.status === 'mastered') {
      e.mastered += 1;
      vocabMastered += 1;
    }
    byLesson.set(r.lesson_id, e);
  }

  const units: UnitStat[] = UNITS.map((u) => {
    let lessonsDone = 0;
    let vocabTotal = 0;
    let vocabInDeck = 0;
    let unitMastered = 0;
    let accSum = 0;
    let accN = 0;
    for (const l of u.lessons) {
      const st = progressByLesson.get(l.id);
      if (st?.status === 'completed') lessonsDone += 1;
      if (st && st.attempts > 0) {
        accSum += st.bestAccuracy;
        accN += 1;
      }
      vocabTotal += l.vocab.filter((v) => !v.noQuiz).length;
      const agg = byLesson.get(l.id);
      vocabInDeck += agg?.deck ?? 0;
      unitMastered += agg?.mastered ?? 0;
    }
    return {
      unitId: u.id,
      title: u.title,
      lessonsDone,
      lessonsTotal: u.lessons.length,
      vocabInDeck,
      vocabMastered: unitMastered,
      vocabTotal,
      bestAvgAccuracy: accN ? accSum / accN : 0,
    };
  });

  const xpRows = db
    .prepare(
      `SELECT date(created_at) AS d, SUM(xp_earned) AS xp
       FROM quiz_attempts
       GROUP BY d
       ORDER BY d DESC
       LIMIT 14`,
    )
    .all() as { d: string; xp: number }[];
  const xpMap = new Map(xpRows.map((r) => [r.d, r.xp]));
  const xpByDay: DayXp[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = addDays(todayStr(), -i);
    xpByDay.push({ date: d, xp: xpMap.get(d) ?? 0 });
  }

  const totals = db
    .prepare(
      `SELECT COUNT(*) AS n, COALESCE(SUM(correct),0) AS c, COALESCE(SUM(total),0) AS t
       FROM quiz_attempts`,
    )
    .get() as { n: number; c: number; t: number };

  const writing = db
    .prepare(
      `SELECT COUNT(*) AS g, COALESCE(SUM(count),0) AS c FROM writing_practice`,
    )
    .get() as { g: number; c: number };

  const dialogueAgg = db
    .prepare(
      `SELECT COALESCE(SUM(completions),0) AS plays, COALESCE(SUM(best_xp),0) AS xp
       FROM dialogue_progress`,
    )
    .get() as { plays: number; xp: number };

  const trip = db
    .prepare(
      `SELECT COUNT(*) AS n, COALESCE(MAX(score),0) AS best,
              COALESCE(SUM(answered),0) AS answered
       FROM trip_sessions`,
    )
    .get() as { n: number; best: number; answered: number };

  const weakRows = [...vocabRows]
    .filter((r) => r.status !== 'mastered')
    .sort((a, b) => b.lapses - a.lapses || a.ease - b.ease || a.reps - b.reps)
    .slice(0, 8);
  const weakest: WeakWord[] = weakRows.flatMap((r) => {
    const ref = VOCAB_INDEX.get(r.vocab_key);
    if (!ref) return [];
    return [
      {
        key: r.vocab_key,
        kana: ref.item.kana,
        romaji: ref.item.romaji,
        meaning: ref.item.meaning,
        lapses: r.lapses,
        ease: r.ease,
        lessonTitle: ref.lesson.title,
      },
    ];
  });

  return {
    xp,
    streak,
    lessonsCompleted: states.filter((s) => s.status === 'completed').length,
    lessonsTotal: LESSONS.length,
    vocabInDeck: vocabRows.length,
    vocabMastered,
    vocabTotal: units.reduce((s, u) => s + u.vocabTotal, 0),
    dueToday: getDueCount(),
    quizAttempts: totals.n,
    avgAccuracy: totals.t ? totals.c / totals.t : 0,
    writingGlyphs: writing.g,
    writingStrokes: writing.c,
    dialoguesPlayed: dialogueAgg.plays,
    dialogueXp: dialogueAgg.xp,
    tripSessions: trip.n,
    tripBestScore: trip.best,
    tripTotalAnswered: trip.answered,
    xpByDay,
    units,
    weakest,
  };
}

// ---------- dialogues ----------

export interface DialogueState {
  sceneId: string;
  completions: number;
  bestXp: number;
}

export function getDialogueStates(): Map<string, DialogueState> {
  const db = getDb();
  const rows = db
    .prepare('SELECT scene_id, completions, best_xp FROM dialogue_progress')
    .all() as { scene_id: string; completions: number; best_xp: number }[];
  return new Map(
    rows.map((r) => [r.scene_id, { sceneId: r.scene_id, completions: r.completions, bestXp: r.best_xp }]),
  );
}

// ---------- trip mode ----------

export function getTripDeck(scenario: TripScenario): TripItem[] {
  const meta = TRIP_SCENARIOS.find((s) => s.id === scenario);
  if (!meta) return [];
  const db = getDb();
  const learned = new Set(
    (db.prepare('SELECT vocab_key FROM vocab_state').all() as { vocab_key: string }[]).map(
      (r) => r.vocab_key,
    ),
  );
  const out: TripItem[] = [];
  for (const lesson of LESSONS) {
    if (meta.unitIds && !meta.unitIds.includes(lesson.unitId)) continue;
    for (const item of lesson.vocab) {
      if (item.noQuiz) continue;
      const key = `${lesson.id}:${item.id}`;
      out.push({
        key,
        kana: item.kana,
        romaji: item.romaji,
        meaning: item.meaning,
        learned: learned.has(key),
      });
    }
  }
  return out;
}

// ---------- backup / restore ----------

const BACKUP_TABLES: Record<string, string[]> = {
  lesson_progress: [
    'lesson_id', 'status', 'best_accuracy', 'attempts', 'xp_earned', 'completed_at', 'updated_at',
  ],
  vocab_state: [
    'vocab_key', 'lesson_id', 'status', 'ease', 'interval_days', 'due_date',
    'reps', 'lapses', 'last_reviewed', 'updated_at',
  ],
  quiz_attempts: ['id', 'lesson_id', 'correct', 'total', 'xp_earned', 'created_at'],
  writing_practice: ['glyph', 'count', 'correct', 'last_practiced'],
  dialogue_progress: ['scene_id', 'completions', 'best_xp', 'last_played'],
  trip_sessions: ['id', 'scenario', 'duration_s', 'score', 'answered', 'created_at'],
};

const PROFILE_COLS = ['display_name', 'level', 'goal', 'motivation'];
const USER_STATE_COLS = ['xp', 'streak', 'last_active_date'];

export interface ProgressBackup {
  format: 'tabi-backup';
  version: 1;
  exportedAt: string;
  profile: Record<string, unknown>;
  user_state: Record<string, unknown>;
  tables: Record<string, Record<string, unknown>[]>;
}

export function exportProgress(): ProgressBackup {
  const db = getDb();
  const tables: Record<string, Record<string, unknown>[]> = {};
  for (const [table, cols] of Object.entries(BACKUP_TABLES)) {
    const rows = db.prepare(`SELECT ${cols.join(', ')} FROM ${table}`).all() as Record<
      string,
      unknown
    >[];
    tables[table] = rows;
  }
  const profile =
    (db
      .prepare(`SELECT ${PROFILE_COLS.join(', ')} FROM profile WHERE id = 1`)
      .get() as Record<string, unknown>) ?? {};
  const user_state =
    (db
      .prepare(`SELECT ${USER_STATE_COLS.join(', ')} FROM user_state WHERE id = 1`)
      .get() as Record<string, unknown>) ?? {};
  return {
    format: 'tabi-backup',
    version: 1,
    exportedAt: new Date().toISOString(),
    profile,
    user_state,
    tables,
  };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Validate and restore a backup. Wipes current progress — callers confirm first. */
export function importProgress(raw: unknown): { ok: boolean; error?: string } {
  if (!isRecord(raw)) return { ok: false, error: 'Not a JSON object' };
  if (raw.format !== 'tabi-backup') return { ok: false, error: 'Not a Tabi backup file' };
  if (raw.version !== 1) return { ok: false, error: `Unsupported backup version` };
  if (!isRecord(raw.tables)) return { ok: false, error: 'Missing table data' };

  // Validate before touching the DB.
  for (const [table, cols] of Object.entries(BACKUP_TABLES)) {
    const rows = raw.tables[table];
    if (rows === undefined) continue; // missing table = skip it
    if (!Array.isArray(rows)) return { ok: false, error: `Table ${table} is not an array` };
    for (const row of rows) {
      if (!isRecord(row)) return { ok: false, error: `Bad row in ${table}` };
      const bad = Object.keys(row).find((k) => !cols.includes(k));
      if (bad) return { ok: false, error: `Unknown column ${bad} in ${table}` };
    }
  }
  if (raw.profile !== undefined && !isRecord(raw.profile)) {
    return { ok: false, error: 'Bad profile data' };
  }
  if (raw.user_state !== undefined && !isRecord(raw.user_state)) {
    return { ok: false, error: 'Bad user_state data' };
  }

  const db = getDb();
  db.exec('BEGIN');
  try {
    for (const [table, cols] of Object.entries(BACKUP_TABLES)) {
      const rows = (raw.tables as Record<string, unknown>)[table] as
        | Record<string, unknown>[]
        | undefined;
      db.prepare(`DELETE FROM ${table}`).run();
      if (!rows) continue;
      const insert = db.prepare(
        `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`,
      );
      for (const row of rows) {
        insert.run(...cols.map((c) => (row[c] === undefined ? null : (row[c] as never))));
      }
    }
    const profile = raw.profile as Record<string, unknown>;
    for (const c of PROFILE_COLS) {
      if (profile[c] !== undefined) {
        db.prepare(`UPDATE profile SET ${c} = ? WHERE id = 1`).run(profile[c] as string);
      }
    }
    const us = raw.user_state as Record<string, unknown>;
    for (const c of USER_STATE_COLS) {
      if (us[c] !== undefined) {
        db.prepare(`UPDATE user_state SET ${c} = ? WHERE id = 1`).run(us[c] as never);
      }
    }
    db.exec('COMMIT');
    return { ok: true };
  } catch (e) {
    db.exec('ROLLBACK');
    return { ok: false, error: e instanceof Error ? e.message : 'Import failed' };
  }
}

export { UNITS, LESSONS, UNIT_INDEX, LESSON_INDEX, lessonXp };
export { TRIP_SCENARIOS } from './trip';
export type { TripItem, TripScenario } from './trip';
export type { Lesson, Unit, VocabItem };
