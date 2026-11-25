import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

const DB_DIR = process.env.TABI_DB_DIR ?? path.join(process.cwd(), 'data');
const DB_PATH = process.env.TABI_DB_PATH ?? path.join(DB_DIR, 'japan.db');

let db: DatabaseSync | null = null;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS profile (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  display_name TEXT NOT NULL DEFAULT '',
  level TEXT NOT NULL DEFAULT 'complete_beginner',
  goal TEXT NOT NULL DEFAULT 'travel_japan',
  motivation TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS user_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  xp INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  last_active_date TEXT
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  lesson_id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'not_started',
  best_accuracy REAL NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  completed_at TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS vocab_state (
  vocab_key TEXT PRIMARY KEY,
  lesson_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'learning',
  ease REAL NOT NULL DEFAULT 2.5,
  interval_days REAL NOT NULL DEFAULT 0,
  due_date TEXT NOT NULL,
  reps INTEGER NOT NULL DEFAULT 0,
  lapses INTEGER NOT NULL DEFAULT 0,
  last_reviewed TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id TEXT NOT NULL,
  correct INTEGER NOT NULL,
  total INTEGER NOT NULL,
  xp_earned INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS writing_practice (
  glyph TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  correct INTEGER NOT NULL DEFAULT 0,
  last_practiced TEXT
);

CREATE TABLE IF NOT EXISTS dialogue_progress (
  scene_id TEXT PRIMARY KEY,
  completions INTEGER NOT NULL DEFAULT 0,
  best_xp INTEGER NOT NULL DEFAULT 0,
  last_played TEXT
);

CREATE INDEX IF NOT EXISTS idx_vocab_due ON vocab_state(due_date);
CREATE INDEX IF NOT EXISTS idx_attempts_created ON quiz_attempts(created_at);
`;

export function getDb(): DatabaseSync {
  if (typeof window !== 'undefined') {
    throw new Error('SQLite is server-only');
  }
  if (!db) {
    fs.mkdirSync(DB_DIR, { recursive: true });
    db = new DatabaseSync(DB_PATH);
    db.exec('PRAGMA journal_mode = WAL;');
    db.exec('PRAGMA busy_timeout = 5000;');
    db.exec(SCHEMA);
    ensureProfile(db);
    ensureUserState(db);
  }
  return db;
}

function ensureProfile(db: DatabaseSync) {
  const row = db.prepare('SELECT id FROM profile WHERE id = 1').get();
  if (!row) {
    db.prepare(
      `INSERT INTO profile (id, display_name, level, goal, motivation)
       VALUES (1, '', 'complete_beginner', 'travel_japan',
               'Japanese culture, travelling independently, and communicating with local people.')`,
    ).run();
  }
}

function ensureUserState(db: DatabaseSync) {
  db.prepare('INSERT OR IGNORE INTO user_state (id) VALUES (1)').run();
}
