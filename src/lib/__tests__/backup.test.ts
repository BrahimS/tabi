import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

let dir = '';
let exportProgress: typeof import('../data').exportProgress;
let importProgress: typeof import('../data').importProgress;
let getDb: typeof import('../db').getDb;

beforeAll(async () => {
  dir = mkdtempSync(join(tmpdir(), 'tabi-test-'));
  process.env.TABI_DB_DIR = dir;
  // Import AFTER env is set so db.ts resolves the temp path.
  const data = await import('../data');
  const db = await import('../db');
  exportProgress = data.exportProgress;
  importProgress = data.importProgress;
  getDb = db.getDb;
});

afterAll(() => {
  delete process.env.TABI_DB_DIR;
  if (dir) rmSync(dir, { recursive: true, force: true });
});

describe('backup round-trip', () => {
  it('exports empty state and restores it', () => {
    const b = exportProgress();
    expect(b.format).toBe('tabi-backup');
    expect(b.version).toBe(1);
    expect(importProgress(b).ok).toBe(true);
  });

  it('round-trips written rows', () => {
    const db = getDb();
    db.prepare(
      `INSERT INTO lesson_progress (lesson_id, status, best_accuracy, attempts, xp_earned)
       VALUES ('u1-l1', 'completed', 0.92, 1, 20)`,
    ).run();
    db.prepare(
      `INSERT INTO writing_practice (glyph, count, correct) VALUES ('あ', 5, 4)`,
    ).run();
    db.prepare(`UPDATE user_state SET xp = 42, streak = 3 WHERE id = 1`).run();

    const b = JSON.parse(JSON.stringify(exportProgress()));
    expect(b.tables.lesson_progress).toHaveLength(1);
    expect(b.user_state.xp).toBe(42);

    // Wipe, then restore.
    db.prepare('DELETE FROM lesson_progress').run();
    db.prepare('DELETE FROM writing_practice').run();
    db.prepare('UPDATE user_state SET xp = 0, streak = 0 WHERE id = 1').run();

    expect(importProgress(b).ok).toBe(true);
    const lp = db.prepare(`SELECT * FROM lesson_progress`).all() as {
      status: string;
      xp_earned: number;
    }[];
    expect(lp).toHaveLength(1);
    expect(lp[0].status).toBe('completed');
    const us = db.prepare(`SELECT xp, streak FROM user_state WHERE id = 1`).get() as {
      xp: number;
      streak: number;
    };
    expect(us.xp).toBe(42);
    expect(us.streak).toBe(3);
  });

  it('rejects non-backup JSON', () => {
    expect(importProgress({ hello: 'world' }).ok).toBe(false);
    expect(importProgress('not an object').ok).toBe(false);
    expect(importProgress({ format: 'tabi-backup', version: 99 }).ok).toBe(false);
  });

  it('rejects rows with unknown columns (no injection)', () => {
    const b = exportProgress();
    b.tables.writing_practice = [{ glyph: 'あ', 'evil_column; DROP TABLE x--': 1 }];
    expect(importProgress(b).ok).toBe(false);
  });
});
