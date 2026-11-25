import Link from 'next/link';
import { getPathStates, UNITS, LESSONS } from '@/lib/data';
import { lessonXp } from '@/lib/content';
import { ProgressBar } from '@/components/ProgressBar';
import { IconArrowRight, IconCheck, IconLock, IconPlay } from '@/components/icons';

export const dynamic = 'force-dynamic';

export default function LearnPage() {
  const states = getPathStates();
  const stateMap = new Map(states.map((s) => [s.lessonId, s]));
  const completedCount = states.filter((s) => s.status === 'completed').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Learning path</h1>
        <p className="mt-1 text-ink-soft">
          Six units from first kana to travel confidence. Finish a lesson to unlock the next.
        </p>
        <div className="mt-4 max-w-md">
          <ProgressBar value={completedCount} max={LESSONS.length} />
          <p className="mt-1 text-xs font-semibold text-ink-soft">
            {completedCount} / {LESSONS.length} lessons complete
          </p>
        </div>
      </div>

      {UNITS.map((unit) => {
        const unitStates = unit.lessons.map((l) => stateMap.get(l.id)!);
        const unitDone = unitStates.filter((s) => s.status === 'completed').length;
        return (
          <section key={unit.id} className="card overflow-hidden">
            <div className="border-b border-line bg-cream/60 px-6 py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-vermilion">
                    Unit {unit.order}
                  </p>
                  <h2 className="text-xl font-extrabold">{unit.title}</h2>
                  <p className="text-sm text-ink-soft">{unit.subtitle}</p>
                </div>
                <span className="chip">
                  {unitDone}/{unit.lessons.length} done
                </span>
              </div>
              <p className="mt-2 max-w-2xl text-sm text-ink-soft">{unit.description}</p>
              <div className="mt-3">
                <ProgressBar value={unitDone} max={unit.lessons.length} className="max-w-xs" />
              </div>
            </div>

            <ul className="divide-y divide-line">
              {unit.lessons.map((lesson) => {
                const st = stateMap.get(lesson.id)!;
                const xp = lessonXp(lesson);
                const inner = (
                  <>
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                        st.status === 'completed'
                          ? 'bg-gold/20 text-gold'
                          : st.unlocked
                            ? 'bg-vermilion/10 text-vermilion'
                            : 'bg-cream text-ink-soft/50'
                      }`}
                    >
                      {st.status === 'completed' ? (
                        <IconCheck width={18} height={18} />
                      ) : st.unlocked ? (
                        lesson.order
                      ) : (
                        <IconLock width={16} height={16} />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span
                          className={`font-bold ${
                            st.unlocked ? 'text-ink' : 'text-ink-soft/60'
                          }`}
                        >
                          {lesson.title}
                        </span>
                        {st.status === 'in_progress' && st.unlocked && (
                          <span className="chip border-vermilion/40 bg-vermilion/10 text-vermilion">
                            In progress
                          </span>
                        )}
                        {st.status === 'completed' && (
                          <span className="chip border-gold/40 bg-gold/10 text-gold">
                            Done
                            {st.bestAccuracy > 0 &&
                              ` · ${Math.round(st.bestAccuracy * 100)}%`}
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block truncate text-sm text-ink-soft">
                        {lesson.subtitle}
                      </span>
                    </span>
                    <span className="hidden shrink-0 text-right text-xs font-semibold text-ink-soft sm:block">
                      <span className="block">{lesson.vocab.length} words</span>
                      <span className="block text-gold">+{xp} XP</span>
                    </span>
                    {st.unlocked ? (
                      <IconArrowRight
                        width={18}
                        height={18}
                        className="shrink-0 text-ink-soft"
                      />
                    ) : (
                      <IconLock width={16} height={16} className="shrink-0 text-ink-soft/40" />
                    )}
                  </>
                );

                const cls = `flex items-center gap-4 px-6 py-4 transition ${
                  st.unlocked ? 'hover:bg-cream/50' : 'opacity-60'
                }`;

                return (
                  <li key={lesson.id}>
                    {st.unlocked ? (
                      <Link href={`/lesson/${lesson.id}`} className={cls}>
                        {inner}
                      </Link>
                    ) : (
                      <div className={cls} title="Complete the previous lesson to unlock">
                        {inner}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <div className="card flex items-center gap-4 p-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-vermilion/10 text-vermilion">
          <IconPlay width={20} height={20} />
        </div>
        <div className="flex-1">
          <p className="font-bold">Stuck on a word?</p>
          <p className="text-sm text-ink-soft">
            The review deck uses spaced repetition — the words you struggle with come back sooner,
            the ones you know fade away.
          </p>
        </div>
        <Link href="/review" className="btn-ghost shrink-0">
          Review deck
        </Link>
      </div>
    </div>
  );
}
