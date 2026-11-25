# Tabi — Japanese for travel

A Next.js app for learning Japanese, built for a complete beginner traveling to Japan.
Lessons, quizzes, spaced-repetition review, a pressure-sensitive writing pad with
stroke-order guides, speech practice, scenario dialogues, trip mode, stats, and a
curated video library — all persisted in SQLite.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # vitest
npm run build    # production build
```

Progress is stored in `data/japan.db` (created on first run, gitignored).
Override with `TABI_DB_DIR` / `TABI_DB_PATH` if needed.

## Deploy to Vercel

The local SQLite **file will not persist** on Vercel (serverless filesystem is
ephemeral). Tabi supports **Turso** (managed libsql) via an embedded replica:

1. Create a Turso database:
   ```bash
   brew install tursodatabase/tap/turso   # or curl -sSfL https://get.tur.so/install.sh | bash
   turso auth signup && turso auth login
   turso db create tabi
   turso db show tabi --url             # libsql://tabi-xxx.turso.io
   turso db tokens create tabi          # auth token
   ```
2. In Vercel → Project → Settings → Environment Variables, add:
   - `TURSO_DATABASE_URL` = `libsql://tabi-xxx.turso.io`
   - `TURSO_AUTH_TOKEN` = the token
3. Import the repo on vercel.com → Framework: Next.js → Deploy. No other config needed.

How it works: `src/lib/db.ts` opens a **libsql embedded replica** (a local file that
syncs to Turso) when `TURSO_DATABASE_URL` is set; otherwise it uses `node:sqlite`
unchanged. Writes are local-first (`offline` mode) and batch-pushed ~2s after the
last write; remote changes pull in every 60s. If the Turso replica can't open at
boot, the app logs loudly and falls back to local SQLite so the site stays up.

> One instance per user: embedded replicas converge via Turso, but concurrent
> writes from two instances at once are last-writer-wins per row.

## Backup

Profile page → "Backup & restore" exports/imports all progress as JSON —
useful before switching storage backends.
