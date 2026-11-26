'use client';

import { useState } from 'react';
import { ReviewSession } from './ReviewSession';
import type { ReviewCard } from '@/lib/data';

type Mode = 'due' | 'weak';

/** Tabs between the scheduled SRS deck and the weak-spots drill. */
export function ReviewHub({
  dueCards,
  weakCards,
  remaining,
}: {
  dueCards: ReviewCard[];
  weakCards: ReviewCard[];
  remaining: number;
}) {
  const [mode, setMode] = useState<Mode>(dueCards.length > 0 ? 'due' : 'weak');
  const cards = mode === 'due' ? dueCards : weakCards;

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        {(
          [
            ['due', `Due now (${dueCards.length})`],
            ['weak', `Weak spots (${weakCards.length})`],
          ] as const
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
              mode === m
                ? 'bg-ink text-paper'
                : 'bg-cream text-ink-soft hover:text-ink'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === 'weak' && (
        <p className="text-center text-sm text-ink-soft">
          Your trickiest words — the ones you miss most, drilled until they stick.
        </p>
      )}
      {mode === 'due' && remaining > 0 && (
        <p className="text-center text-sm text-ink-soft">
          Showing {cards.length} of {remaining + cards.length} due words — the rest will follow in
          the next session.
        </p>
      )}

      <ReviewSession key={mode} cards={cards} remaining={mode === 'due' ? remaining : 0} />
    </div>
  );
}
