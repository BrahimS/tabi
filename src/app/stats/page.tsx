import Link from 'next/link';
import { getStats } from '@/lib/data';
import { IconTarget, IconStar, IconZap, IconRefresh, IconPen } from '@/components/icons';

export const dynamic = 'force-dynamic';

function pct(n: number, d: number) {
  return d ? Math.round((n / d) * 100) : 0;
}

export default function StatsPage() {
  const s = getStats();
  const maxDayXp = Math.max(1, ...s.xpByDay.map((d) => d.xp));

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Your progress</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Everything the app knows about your Japanese so far.
        </p>
      </header>

      {/* headline numbers */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: <IconZap width={18} height={18} />, label: 'XP', value: s.xp.toLocaleString() },
          { icon: <IconStar width={18} height={18} />, label: 'Day streak', value: s.streak },
          {
            icon: <IconTarget width={18} height={18} />,
            label: 'Lessons',
            value: `${s.lessonsCompleted}/${s.lessonsTotal}`,
          },
          {
            icon: <IconRefresh width={18} height={18} />,
            label: 'Due today',
            value: s.dueToday,
          },
        ].map((c) => (
          <div key={c.label} className="card p-4">
            <div className="flex items-center gap-1.5 text-vermilion">{c.icon}
              <span className="text-[11px] font-bold uppercase tracking-wide text-ink-soft">
                {c.label}
              </span>
            </div>
            <p className="mt-1 text-2xl font-extrabold">{c.value}</p>
          </div>
        ))}
      </section>

      {/* XP chart */}
      <section className="card p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-soft">
          XP — last 14 days
        </h2>
        <div className="mt-4 flex h-32 items-end gap-1.5">
          {s.xpByDay.map((d) => (
            <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={`w-full rounded-t-md ${d.xp ? 'bg-vermilion' : 'bg-cream'}`}
                style={{ height: `${Math.max(4, (d.xp / maxDayXp) * 100)}%` }}
                title={`${d.date}: ${d.xp} XP`}
              />
              <span className="text-[9px] font-semibold text-ink-soft">
                {d.date.slice(8)}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-soft">
          {s.quizAttempts} quizzes taken · {Math.round(s.avgAccuracy * 100)}% average accuracy
        </p>
      </section>

      {/* unit mastery */}
      <section className="card p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-soft">
          Mastery by unit
        </h2>
        <div className="mt-4 space-y-4">
          {s.units.map((u) => (
            <div key={u.unitId}>
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-bold">{u.title}</p>
                <p className="text-xs font-semibold text-ink-soft">
                  {u.lessonsDone}/{u.lessonsTotal} lessons · {u.vocabMastered}/{u.vocabTotal} words mastered
                </p>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-cream">
                <div className="flex h-full">
                  <div
                    className="bg-emerald-600"
                    style={{ width: `${pct(u.vocabMastered, u.vocabTotal)}%` }}
                    title="Words mastered"
                  />
                  <div
                    className="bg-gold/70"
                    style={{
                      width: `${pct(u.vocabInDeck - u.vocabMastered, u.vocabTotal)}%`,
                    }}
                    title="Words in review deck"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-4 text-[11px] font-semibold text-ink-soft">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-600" /> mastered
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-gold/70" /> in review deck
          </span>
        </div>
      </section>

      {/* weakest words + writing */}
      <div className="grid gap-6 sm:grid-cols-2">
        <section className="card p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink-soft">
            Trickiest words
          </h2>
          {s.weakest.length === 0 ? (
            <p className="mt-3 text-sm text-ink-soft">
              Nothing in your review deck yet — finish a lesson to start building it.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {s.weakest.map((w) => (
                <li key={w.key} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-bold" lang="ja">{w.kana}</span>
                    <span className="ml-2 text-xs text-ink-soft">
                      {w.romaji} · {w.meaning}
                    </span>
                  </div>
                  <span className="chip shrink-0">
                    {w.lapses > 0 ? `${w.lapses} lapses` : `ease ${w.ease.toFixed(1)}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/review"
            className="mt-4 inline-block text-xs font-bold text-vermilion hover:underline"
          >
            Practice these in Review →
          </Link>
        </section>

        <section className="card p-5">
          <h2 className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-ink-soft">
            <IconPen width={14} height={14} /> Writing
          </h2>
          <p className="mt-3 text-2xl font-extrabold">
            {s.writingGlyphs}
            <span className="ml-1 text-sm font-semibold text-ink-soft">glyphs practiced</span>
          </p>
          <p className="text-sm text-ink-soft">{s.writingStrokes} total practice strokes</p>
          <Link
            href="/write"
            className="mt-4 inline-block text-xs font-bold text-vermilion hover:underline"
          >
            Open the writing pad →
          </Link>
        </section>
      </div>
    </div>
  );
}
