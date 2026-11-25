import { getDashboardData, getProfile } from '@/lib/data';
import { ProfileForm } from '@/components/ProfileForm';
import { BackupPanel } from '@/components/BackupPanel';
import { IconStar, IconTarget, IconBook, IconZap } from '@/components/icons';

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

export default function ProfilePage() {
  const d = getDashboardData();
  const profile = getProfile();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Profile</h1>
        <p className="mt-1 text-ink-soft">Your learning profile and journey so far.</p>
      </div>

      {/* journey stats */}
      <div className="card p-6">
        <h2 className="text-lg font-extrabold">Journey so far</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-cream px-4 py-3 text-center">
            <IconZap width={20} height={20} className="mx-auto text-gold" />
            <p className="mt-1 text-2xl font-extrabold">{d.state.streak}</p>
            <p className="text-xs font-semibold text-ink-soft">day streak</p>
          </div>
          <div className="rounded-xl bg-cream px-4 py-3 text-center">
            <IconStar width={20} height={20} className="mx-auto text-gold" />
            <p className="mt-1 text-2xl font-extrabold">{d.state.xp.toLocaleString()}</p>
            <p className="text-xs font-semibold text-ink-soft">total XP</p>
          </div>
          <div className="rounded-xl bg-cream px-4 py-3 text-center">
            <IconBook width={20} height={20} className="mx-auto text-vermilion" />
            <p className="mt-1 text-2xl font-extrabold">
              {d.stats.lessonsCompleted}/{d.stats.totalLessons}
            </p>
            <p className="text-xs font-semibold text-ink-soft">lessons done</p>
          </div>
          <div className="rounded-xl bg-cream px-4 py-3 text-center">
            <IconTarget width={20} height={20} className="mx-auto text-indigo" />
            <p className="mt-1 text-2xl font-extrabold">{d.stats.wordsLearned}</p>
            <p className="text-xs font-semibold text-ink-soft">words & kana</p>
          </div>
        </div>
        {profile.created_at && (
          <p className="mt-4 text-center text-xs text-ink-soft">
            Learning since {profile.created_at.slice(0, 10)}
          </p>
        )}
      </div>

      {/* current profile summary */}
      <div className="card p-6">
        <h2 className="text-lg font-extrabold">Current profile</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="chip">{LEVEL_LABELS[profile.level] ?? profile.level}</span>
          <span className="chip">{GOAL_LABELS[profile.goal] ?? profile.goal}</span>
          {profile.motivation && <span className="chip">{profile.motivation}</span>}
        </div>
      </div>

      <ProfileForm
        initial={{
          display_name: profile.display_name,
          level: profile.level,
          goal: profile.goal,
          motivation: profile.motivation,
        }}
      />

      <BackupPanel />
    </div>
  );
}
