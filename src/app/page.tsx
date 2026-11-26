import Link from 'next/link';
import { getDashboardData } from '@/lib/data';
import { ProgressBar } from '@/components/ProgressBar';
import { SpeakButton } from '@/components/SpeakButton';
import {
  IconArrowRight,
  IconBook,
  IconClock,
  IconRefresh,
  IconStar,
  IconTarget,
  IconUser,
  IconZap,
} from '@/components/icons';

export const dynamic = 'force-dynamic';

const LEVEL_LABELS: Record<string, string> = {
  complete_beginner: 'Complete beginner',
  beginner: 'Beginner',
  elementary: 'Elementary',
};

const GOAL_LABELS: Record<string, string> = {
  travel_japan: 'Traveling to Japan',
  culture: 'Japanese culture',
  live_in_japan: 'Living in Japan',
  work_study: 'Work or study',
  hobby: 'Hobby',
  other: 'Other',
};

function GoalRing({ value, goal }: { value: number; goal: number }) {
  const pct = Math.min(1, goal > 0 ? value / goal : 0);
  const r = 15;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={40} height={40} viewBox="0 0 40 40" className="-rotate-90">
      <circle cx={20} cy={20} r={r} fill="none" strokeWidth={5} className="stroke-line" />
      <circle
        cx={20}
        cy={20}
        r={r}
        fill="none"
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct)}
        className="stroke-vermilion transition-all"
      />
    </svg>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent: string;
}) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="truncate text-xl font-extrabold leading-tight">{value}</p>
        <p className="truncate text-xs font-semibold text-ink-soft">{label}</p>
        {sub && <p className="truncate text-[11px] text-ink-soft/70">{sub}</p>}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const d = getDashboardData();
  const { profile, state, stats, nextLesson, currentLesson, recentAttempts, todayXp } = d;
  const dailyGoal = Math.max(1, profile.daily_goal_xp || 25);
  const name = profile.display_name?.trim();
  const hour = new Date().getHours();
  const greeting = hour < 11 ? 'おはよう' : hour < 18 ? 'こんにちは' : 'こんばんは';

  return (
    <div className="space-y-8">
      {/* hero */}
      <section className="card relative overflow-hidden p-6 sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-10 select-none text-[10rem] font-extrabold leading-none text-vermilion/5"
          lang="ja"
        >
          旅
        </div>
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-vermilion">{greeting}</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {name ? `Welcome back, ${name}` : 'Welcome to Tabi'}
            </h1>
            <p className="mt-2 max-w-xl text-ink-soft">
              Your goal: <span className="font-bold text-ink">{GOAL_LABELS[profile.goal] ?? profile.goal}</span>
              {profile.motivation && (
                <>
                  {' '}· {profile.motivation}
                </>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SpeakButton text={greeting} label="Hear it" />
            <Link href="/profile" className="btn-ghost">
              <IconUser width={16} height={16} />
              Profile
            </Link>
          </div>
        </div>

        <div className="relative mt-5 flex flex-wrap gap-2">
          <span className="chip">{LEVEL_LABELS[profile.level] ?? profile.level}</span>
          <span className="chip">{GOAL_LABELS[profile.goal] ?? profile.goal}</span>
          {stats.dueReviews > 0 && (
            <Link href="/review" className="chip border-vermilion/40 bg-vermilion/10 text-vermilion">
              {stats.dueReviews} review{stats.dueReviews === 1 ? '' : 's'} due
            </Link>
          )}
        </div>
      </section>

      {/* stats */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          icon={<IconZap width={20} height={20} className="text-gold" />}
          label="day streak"
          value={String(state.streak)}
          accent="bg-gold/15"
        />
        <StatCard
          icon={<IconStar width={20} height={20} className="text-gold" />}
          label="total XP"
          value={state.xp.toLocaleString()}
          sub={`of ~${stats.totalXpPossible.toLocaleString()} possible`}
          accent="bg-gold/15"
        />
        <StatCard
          icon={<IconBook width={20} height={20} className="text-vermilion" />}
          label="lessons"
          value={`${stats.lessonsCompleted}/${stats.totalLessons}`}
          accent="bg-vermilion/10"
        />
        <StatCard
          icon={<IconTarget width={20} height={20} className="text-indigo" />}
          label="words & kana"
          value={String(stats.wordsLearned)}
          sub={`${stats.masteredWords} mastered`}
          accent="bg-indigo/10"
        />
        <StatCard
          icon={<IconClock width={20} height={20} className="text-matcha" />}
          label="reviews due"
          value={String(stats.dueReviews)}
          accent="bg-matcha/10"
        />
        <StatCard
          icon={<GoalRing value={todayXp} goal={dailyGoal} />}
          label="today's goal"
          value={`${todayXp}/${dailyGoal} XP`}
          sub={todayXp >= dailyGoal ? 'goal reached!' : `${dailyGoal - todayXp} to go`}
          accent="bg-vermilion/10"
        />
      </section>

      {/* continue + review */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="card relative overflow-hidden p-6 lg:col-span-2">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
            {currentLesson && currentLesson.lesson.id !== nextLesson?.lesson.id
              ? 'Continue where you left off'
              : 'Up next'}
          </p>
          {nextLesson || currentLesson ? (
            <>
              <p className="mt-1 text-sm font-semibold text-vermilion">
                {currentLesson?.unit.title ?? nextLesson?.unit.title}
              </p>
              <h2 className="mt-1 text-2xl font-extrabold">
                {(currentLesson?.lesson ?? nextLesson?.lesson)?.title}
              </h2>
              <p className="mt-1 text-ink-soft">
                {(currentLesson?.lesson ?? nextLesson?.lesson)?.subtitle}
              </p>
              <div className="mt-4">
                <ProgressBar
                  value={stats.lessonsCompleted}
                  max={stats.totalLessons}
                  className="max-w-xs"
                />
                <p className="mt-1 text-xs font-semibold text-ink-soft">
                  {stats.lessonsCompleted} of {stats.totalLessons} lessons complete
                </p>
              </div>
              <Link
                href={`/lesson/${(currentLesson?.lesson ?? nextLesson?.lesson)?.id}`}
                className="btn-primary mt-5 px-6 py-3"
              >
                {(currentLesson?.lesson ?? nextLesson?.lesson)?.title?.startsWith('Hiragana') ||
                (currentLesson?.lesson ?? nextLesson?.lesson)?.title?.startsWith('Katakana')
                  ? 'Start lesson'
                  : 'Continue lesson'}
                <IconArrowRight width={16} height={16} />
              </Link>
            </>
          ) : (
            <>
              <h2 className="mt-1 text-2xl font-extrabold">You finished the path!</h2>
              <p className="mt-2 text-ink-soft">
                すべてのレッスンを完了しました — every lesson done. Keep reviewing to make it
                permanent, or revisit any lesson.
              </p>
              <Link href="/learn" className="btn-primary mt-5 px-6 py-3">
                Review the path
                <IconArrowRight width={16} height={16} />
              </Link>
            </>
          )}
        </div>

        <div className="card flex flex-col p-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-matcha/15 text-matcha">
              <IconRefresh width={20} height={20} />
            </div>
            <div>
              <p className="text-xl font-extrabold">{stats.dueReviews}</p>
              <p className="text-xs font-semibold text-ink-soft">words due for review</p>
            </div>
          </div>
          <p className="mt-3 flex-1 text-sm text-ink-soft">
            Spaced repetition moves words from &ldquo;seen once&rdquo; to &ldquo;never forgotten&rdquo;. Five minutes a
            day beats an hour on Sunday.
          </p>
          <Link
            href="/review"
            className={`mt-4 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition ${
              stats.dueReviews > 0
                ? 'bg-matcha text-white hover:opacity-90'
                : 'border border-line bg-white text-ink-soft hover:text-ink'
            }`}
          >
            <IconRefresh width={16} height={16} />
            {stats.dueReviews > 0 ? 'Start review' : 'All caught up'}
          </Link>
        </div>
      </section>

      {/* recent activity */}
      {recentAttempts.length > 0 && (
        <section className="card p-6">
          <h2 className="text-lg font-extrabold">Recent quiz results</h2>
          <div className="mt-3 divide-y divide-line">
            {recentAttempts.map((a, i) => {
              const acc = a.total > 0 ? Math.round((a.correct / a.total) * 100) : 0;
              return (
                <div key={i} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="font-semibold">{a.lessonTitle}</span>
                  <span className="flex items-center gap-4 text-ink-soft">
                    <span>
                      {a.correct}/{a.total} · {acc}%
                    </span>
                    <span className="font-bold text-gold">+{a.xp_earned} XP</span>
                    <span className="text-xs">{a.created_at.slice(0, 10)}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
