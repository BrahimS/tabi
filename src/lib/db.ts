import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

// Storage backend:
//   local dev  → node:sqlite at data/japan.db (zero-config)
//   Railway    → node:sqlite on the mounted Volume (RAILWAY_VOLUME_MOUNT_PATH)
//   Vercel     → libsql embedded replica, auto-synced to Turso when
//                TURSO_DATABASE_URL (+ TURSO_AUTH_TOKEN) are set
// Overrides: TABI_DB_DIR / TABI_DB_PATH (tests, custom deploys).

const DB_DIR =
  process.env.TABI_DB_DIR ??
  process.env.RAILWAY_VOLUME_MOUNT_PATH ??
  path.join(process.cwd(), 'data');
const DB_PATH = process.env.TABI_DB_PATH ?? path.join(DB_DIR, 'japan.db');
const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

let db: Db | null = null;

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
  best_mistakes INTEGER,
  last_played TEXT
);

CREATE TABLE IF NOT EXISTS trip_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scenario TEXT NOT NULL,
  duration_s INTEGER NOT NULL,
  score INTEGER NOT NULL,
  answered INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_vocab_due ON vocab_state(due_date);
CREATE INDEX IF NOT EXISTS idx_attempts_created ON quiz_attempts(created_at);
`;

// Minimal shared surface — every caller only uses prepare().run/get/all + exec.
type Param = null | number | bigint | string | Uint8Array;

export interface DbStatement {
  run(...params: Param[]): unknown;
  get(...params: Param[]): unknown;
  all(...params: Param[]): unknown[];
}

export interface Db {
  prepare(sql: string): DbStatement;
  exec(sql: string): void;
}

// ---------- node:sqlite backend ----------

function nodeBackend(): Db {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const raw = new DatabaseSync(DB_PATH);
  raw.exec('PRAGMA journal_mode = WAL;');
  raw.exec('PRAGMA busy_timeout = 5000;');
  return raw;
}

// ---------- libsql (Turso embedded replica) backend ----------

interface LibsqlStatement {
  run(...params: Param[]): unknown;
  get(...params: Param[]): unknown;
  all(...params: Param[]): unknown[];
}
interface LibsqlDb {
  prepare(sql: string): LibsqlStatement;
  exec(sql: string): void;
  sync(): Promise<unknown>;
  close(): void;
}

// libsql rows carry a `_metadata` field — strip it so row objects stay clean.
function stripMeta<T>(row: T): T {
  if (row && typeof row === 'object' && '_metadata' in row) {
    const copy = { ...(row as Record<string, unknown>) };
    delete copy._metadata;
    return copy as T;
  }
  return row;
}

function libsqlBackend(): Db {
  // Loaded lazily so local dev never pays for the native binding.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Database } = require('libsql') as {
    Database: new (
      p: string,
      o: {
        syncUrl: string;
        authToken?: string;
        syncInterval?: number;
        offline?: boolean;
      },
    ) => LibsqlDb;
  };
  fs.mkdirSync(DB_DIR, { recursive: true });
  const raw = new Database(path.join(DB_DIR, 'tabi-replica.db'), {
    syncUrl: TURSO_URL!,
    authToken: TURSO_TOKEN,
    syncInterval: 60, // pull remote changes once a minute
    // write locally first, batch-push on sync — without this every write
    // round-trips to Turso synchronously (slow + hard-fails offline)
    offline: true,
  });

  // Push local writes to Turso shortly after the last one lands.
  let dirty = false;
  let timer: ReturnType<typeof setTimeout> | null = null;
  const doSync = () => {
    dirty = false;
    raw.sync().catch((e: unknown) => console.error('[tabi] Turso sync failed:', e));
  };
  const scheduleSync = () => {
    dirty = true;
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      if (!dirty) return;
      doSync();
    }, 2000);
    timer.unref?.();
  };

  // Flush pending writes on shutdown so the last write isn't lost when a
  // deploy terminates the process inside the 2s debounce window.
  const flush = (): Promise<void> => {
    if (timer) clearTimeout(timer);
    timer = null;
    if (!dirty) return Promise.resolve();
    dirty = false;
    return Promise.resolve(raw.sync()).then(
      () => undefined,
      (e: unknown) => console.error('[tabi] Turso sync failed:', e),
    );
  };
  const flushThenExit = () => {
    // Give the push max 1.5s, then exit — a handler must not block shutdown.
    Promise.race([flush(), new Promise((r) => setTimeout(r, 1500))]).finally(() =>
      process.exit(0),
    );
  };
  process.once('SIGTERM', flushThenExit);
  process.once('SIGINT', flushThenExit);
  process.on('beforeExit', () => void flush());

  return {
    prepare(sql: string): DbStatement {
      const st = raw.prepare(sql);
      return {
        run: (...p: Param[]) => {
          scheduleSync();
          return st.run(...p);
        },
        get: (...p: Param[]) => stripMeta(st.get(...p)),
        all: (...p: Param[]) => (st.all(...p) as unknown[]).map(stripMeta),
      };
    },
    exec(sql: string) {
      scheduleSync();
      raw.exec(sql);
    },
  };
}

// ---------- entry point ----------

export function getDb(): Db {
  if (typeof window !== 'undefined') {
    throw new Error('SQLite is server-only');
  }
  if (!db) {
    if (TURSO_URL) {
      try {
        db = libsqlBackend();
      } catch (e) {
        console.error(
          '[tabi] TURSO_DATABASE_URL is set but the replica could not open — ' +
            'falling back to local node:sqlite (data will NOT persist on serverless).',
          e,
        );
        db = nodeBackend();
      }
    } else {
      db = nodeBackend();
    }
    db.exec(SCHEMA);
    migrate(db);
    ensureProfile(db);
    ensureUserState(db);
  }
  return db;
}

/** Additive column migrations for DBs created before a column existed. */
function migrate(db: Db) {
  const addCol = (table: string, col: string, ddl: string) => {
    const cols = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
    if (!cols.some((c) => c.name === col)) {
      db.exec(`ALTER TABLE ${table} ADD COLUMN ${ddl}`);
    }
  };
  addCol('dialogue_progress', 'best_mistakes', 'best_mistakes INTEGER');
}

function ensureProfile(db: Db) {
  const row = db.prepare('SELECT id FROM profile WHERE id = 1').get();
  if (!row) {
    db.prepare(
      `INSERT INTO profile (id, display_name, level, goal, motivation)
       VALUES (1, '', 'complete_beginner', 'travel_japan',
               'Japanese culture, travelling independently, and communicating with local people.')`,
    ).run();
  }
}

function ensureUserState(db: Db) {
  db.prepare('INSERT OR IGNORE INTO user_state (id) VALUES (1)').run();
}
