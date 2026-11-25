'use client';

import { useState } from 'react';
import { DIALOGUES, type DialogueScene } from '@/lib/dialogues';
import type { DialogueState } from '@/lib/data';
import { DialoguePlayer } from './DialoguePlayer';
import { IconCheck, IconPlay, IconZap } from './icons';

export function DialogueHub({ states }: { states: Record<string, DialogueState> }) {
  const [active, setActive] = useState<DialogueScene | null>(null);

  if (active) {
    return (
      <div className="mx-auto max-w-2xl">
        <DialoguePlayer scene={active} onExit={() => setActive(null)} />
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-2xl gap-4">
      {DIALOGUES.map((s) => {
        const st = states[s.id];
        return (
          <button
            key={s.id}
            onClick={() => setActive(s)}
            className="card p-5 text-left transition hover:border-vermilion/50"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-extrabold">{s.title}</p>
                <p className="text-sm text-ink-soft" lang="ja">
                  {s.subtitle}
                </p>
                <p className="mt-2 text-sm text-ink-soft">{s.setting}</p>
              </div>
              <span className="chip shrink-0">
                <IconZap width={12} height={12} /> {s.xp} XP
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-ink-soft">
                {st
                  ? `Played ${st.completions}× · best +${st.bestXp} XP`
                  : 'Not played yet'}
              </span>
              <span className="flex items-center gap-1 text-sm font-bold text-vermilion">
                {st && <IconCheck width={14} height={14} />}
                <IconPlay width={15} height={15} /> Start scene
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
