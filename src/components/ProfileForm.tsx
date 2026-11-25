'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfile } from '@/lib/actions';
import { IconCheck } from './icons';

const LEVELS = [
  { id: 'complete_beginner', label: 'Complete beginner' },
  { id: 'beginner', label: 'Beginner (know some kana)' },
  { id: 'elementary', label: 'Elementary' },
];

const GOALS = [
  { id: 'travel_japan', label: 'Traveling to Japan' },
  { id: 'culture', label: 'Japanese culture' },
  { id: 'live_in_japan', label: 'Living in Japan' },
  { id: 'work_study', label: 'Work or study' },
  { id: 'hobby', label: 'Hobby / fun' },
  { id: 'other', label: 'Other' },
];

export function ProfileForm({
  initial,
}: {
  initial: { display_name: string; level: string; goal: string; motivation: string };
}) {
  const [name, setName] = useState(initial.display_name);
  const [level, setLevel] = useState(initial.level);
  const [goal, setGoal] = useState(initial.goal);
  const [motivation, setMotivation] = useState(initial.motivation);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  function save() {
    setSaved(false);
    setError(false);
    startTransition(async () => {
      const res = await updateProfile({
        display_name: name,
        level,
        goal,
        motivation,
      });
      if (res.ok) {
        setSaved(true);
        router.refresh();
      } else {
        setError(true);
      }
    });
  }

  return (
    <div className="card p-6">
      <h2 className="text-lg font-extrabold">Your learning profile</h2>
      <p className="mt-1 text-sm text-ink-soft">
        This shapes your lessons — update it as your goals change.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-bold" htmlFor="pf-name">
            Display name
          </label>
          <input
            id="pf-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What should we call you?"
            className="w-full rounded-xl border border-line bg-white px-4 py-2.5 outline-none transition focus:border-vermilion"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-bold" htmlFor="pf-level">
              Current level
            </label>
            <select
              id="pf-level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full rounded-xl border border-line bg-white px-4 py-2.5 outline-none transition focus:border-vermilion"
            >
              {LEVELS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold" htmlFor="pf-goal">
              Goal
            </label>
            <select
              id="pf-goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full rounded-xl border border-line bg-white px-4 py-2.5 outline-none transition focus:border-vermilion"
            >
              {GOALS.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold" htmlFor="pf-motivation">
            Motivation
          </label>
          <textarea
            id="pf-motivation"
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-line bg-white px-4 py-2.5 outline-none transition focus:border-vermilion"
          />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button onClick={save} className="btn-primary px-6 py-2.5">
          Save profile
        </button>
        {saved && (
          <span className="flex items-center gap-1 text-sm font-bold text-matcha">
            <IconCheck width={16} height={16} /> Saved
          </span>
        )}
        {error && <span className="text-sm font-bold text-vermilion">Save failed — try again</span>}
      </div>
    </div>
  );
}
