'use server';

import { getDb } from './db';
import {
  getPathStates,
  getVocabState,
  applyGrade,
  touchActivity,
  addXp,
  todayStr,
  getTripDeck,
} from './data';
import type { TripScenario, TripItem } from './trip';
import { LESSON_INDEX, VOCAB_INDEX, vocabKey, lessonXp } from './content';
import type { Grade } from './data';

export interface ActionResult {
  ok: boolean;
  error?: string;
  [key: string]: unknown;
}

/** Mark a lesson as started (in_progress) if it's the user's turn. */
export async function markLessonStarted(lessonId: string): Promise<ActionResult> {
  const lesson = LESSON_INDEX.get(lessonId);
  if (!lesson) return { ok: false, error: 'Unknown lesson' };

  const state = getPathStates().find((s) => s.lessonId === lessonId);
  if (!state || !state.unlocked) return { ok: false, error: 'Lesson is locked' };
  if (state.status === 'completed') return { ok: true };

  const db = getDb();
  db.prepare(
    `INSERT INTO lesson_progress (lesson_id, status, updated_at)
     VALUES (?, 'in_progress', datetime('now'))
     ON CONFLICT(lesson_id) DO UPDATE SET
       status = 'in_progress',
       updated_at = datetime('now')
     WHERE lesson_progress.status = 'not_started'`,
  ).run(lessonId);
  return { ok: true };
}

/** Record quiz completion: XP, progress, vocab deck seeding, streak. */
export async function completeLesson(
  lessonId: string,
  correct: number,
  total: number,
): Promise<ActionResult> {
  const lesson = LESSON_INDEX.get(lessonId);
  if (!lesson) return { ok: false, error: 'Unknown lesson' };

  const state = getPathStates().find((s) => s.lessonId === lessonId);
  if (!state || !state.unlocked) return { ok: false, error: 'Lesson is locked' };

  const safeCorrect = Math.max(0, Math.min(correct, total));
  const accuracy = total > 0 ? safeCorrect / total : 0;
  const base = lessonXp(lesson);
  const bonus = accuracy >= 0.9 ? 10 : accuracy >= 0.75 ? 5 : accuracy >= 0.5 ? 2 : 0;
  const xpEarned = base + bonus;
  const today = todayStr();

  const db = getDb();
  db.exec('BEGIN');
  try {
    db.prepare(
      `INSERT INTO lesson_progress (lesson_id, status, best_accuracy, attempts, xp_earned, completed_at, updated_at)
       VALUES (?, 'completed', ?, 1, ?, ?, datetime('now'))
       ON CONFLICT(lesson_id) DO UPDATE SET
         status = 'completed',
         best_accuracy = MAX(best_accuracy, excluded.best_accuracy),
         attempts = attempts + 1,
         xp_earned = xp_earned + excluded.xp_earned,
         completed_at = COALESCE(completed_at, excluded.completed_at),
         updated_at = datetime('now')`,
    ).run(lessonId, accuracy, xpEarned, today);

    db.prepare(
      `INSERT INTO quiz_attempts (lesson_id, correct, total, xp_earned)
       VALUES (?, ?, ?, ?)`,
    ).run(lessonId, safeCorrect, total, xpEarned);

    // Seed every vocab item into the review deck (ignore if already known)
    const insertVocab = db.prepare(
      `INSERT OR IGNORE INTO vocab_state (vocab_key, lesson_id, status, due_date)
       VALUES (?, ?, 'learning', ?)`,
    );
    for (const item of lesson.vocab) {
      insertVocab.run(vocabKey(lesson.id, item.id), lesson.id, today);
    }

    touchActivity();
    addXp(xpEarned);

    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }

  return { ok: true, xpEarned, accuracy, baseXp: base, bonus };
}

const GRADES: Grade[] = ['again', 'hard', 'good', 'easy'];

/** Grade a review card; persists SRS state and awards a little XP. */
export async function submitReview(vocabKeyStr: string, grade: string): Promise<ActionResult> {
  if (!GRADES.includes(grade as Grade)) return { ok: false, error: 'Invalid grade' };
  if (!VOCAB_INDEX.has(vocabKeyStr)) return { ok: false, error: 'Unknown word' };

  const row = getVocabState(vocabKeyStr);
  if (!row) return { ok: false, error: 'Word not learned yet' };

  const result = applyGrade(row, grade as Grade);
  const xp = 2;

  const db = getDb();
  db.exec('BEGIN');
  try {
    db.prepare(
      `UPDATE vocab_state SET
         status = ?, ease = ?, interval_days = ?, due_date = ?,
         reps = ?, lapses = ?, last_reviewed = ?, updated_at = datetime('now')
       WHERE vocab_key = ?`,
    ).run(
      result.status,
      result.ease,
      result.interval_days,
      result.due_date,
      result.reps,
      result.lapses,
      todayStr(),
      vocabKeyStr,
    );
    touchActivity();
    addXp(xp);
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }

  return { ok: true, xp, nextDue: result.due_date, status: result.status };
}

const LEVELS = ['complete_beginner', 'beginner', 'elementary'];
const GOALS = ['travel_japan', 'culture', 'live_in_japan', 'work_study', 'hobby', 'other'];

export async function updateProfile(input: {
  display_name?: string;
  level?: string;
  goal?: string;
  motivation?: string;
}): Promise<ActionResult> {
  const db = getDb();
  const fields: string[] = [];
  const params: string[] = [];

  if (input.display_name !== undefined) {
    fields.push('display_name = ?');
    params.push(String(input.display_name).slice(0, 60));
  }
  if (input.level !== undefined && LEVELS.includes(input.level)) {
    fields.push('level = ?');
    params.push(input.level);
  }
  if (input.goal !== undefined && GOALS.includes(input.goal)) {
    fields.push('goal = ?');
    params.push(input.goal);
  }
  if (input.motivation !== undefined) {
    fields.push('motivation = ?');
    params.push(String(input.motivation).slice(0, 300));
  }
  if (fields.length === 0) return { ok: false, error: 'Nothing to update' };

  db.prepare(`UPDATE profile SET ${fields.join(', ')} WHERE id = 1`).run(...params);
  return { ok: true };
}

/** Record one writing-practice attempt; +1 XP when self-marked correct. */
export async function logWritingPractice(glyph: string, correct: boolean): Promise<ActionResult> {
  const g = String(glyph).slice(0, 12);
  if (!g.trim()) return { ok: false, error: 'Invalid glyph' };

  const db = getDb();
  db.prepare(
    `INSERT INTO writing_practice (glyph, count, correct, last_practiced)
     VALUES (?, 1, ?, datetime('now'))
     ON CONFLICT(glyph) DO UPDATE SET
       count = count + 1,
       correct = correct + excluded.correct,
       last_practiced = datetime('now')`,
  ).run(g, correct ? 1 : 0);

  touchActivity();
  if (correct) addXp(1);
  return { ok: true };
}

export interface InkStroke {
  x: number[];
  y: number[];
  t: number[];
}

/**
 * Handwriting recognition via Google's handwriting API, proxied server-side.
 * Best-effort: returns ok:false when the service is unreachable so the UI
 * can fall back to self-check.
 */
export async function recognizeInk(strokes: InkStroke[]): Promise<ActionResult> {
  const ink = (Array.isArray(strokes) ? strokes : [])
    .slice(0, 40)
    .map((s) => [
      (s.x || []).slice(0, 256),
      (s.y || []).slice(0, 256),
      (s.t || []).slice(0, 256),
    ])
    .filter((s) => (s[0] as number[]).length > 0);
  if (ink.length === 0) return { ok: false, error: 'Nothing drawn' };

  try {
    const res = await fetch(
      'https://inputtools.google.com/request?ime=handwriting&app=handrec&cs=1&oe=UTF-8',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          options: 'enable_pre_space',
          requests: [
            {
              writing_guide: { writing_area_width: 300, writing_area_height: 300 },
              ink,
              language: 'ja',
              num_results: 6,
              num_completions: 0,
              request_type: 4,
              max_completions: 0,
            },
          ],
        }),
        signal: AbortSignal.timeout(6000),
      },
    );
    if (!res.ok) return { ok: false, error: `Recognition service returned ${res.status}` };
    const data = (await res.json()) as unknown;
    const candidates = extractCandidates(data);
    if (candidates.length === 0) return { ok: false, error: 'No candidates' };
    return { ok: true, candidates };
  } catch {
    return { ok: false, error: 'Recognition unavailable' };
  }
}

/**
 * The API returns deeply nested arrays like
 * ["SUCCESS", [["あ", "", [["あ","え","お",...]], ...]]] — find the longest
 * all-string array, which is the candidates list.
 */
function extractCandidates(data: unknown): string[] {
  let best: string[] = [];
  const walk = (v: unknown): void => {
    if (!Array.isArray(v)) return;
    if (v.length > 0 && v.every((x) => typeof x === 'string')) {
      if (v.length > best.length) best = v as string[];
      return;
    }
    v.forEach(walk);
  };
  walk(data);
  return best.slice(0, 8);
}

export async function fetchTripDeck(scenario: TripScenario): Promise<TripItem[]> {
  return getTripDeck(scenario);
}
