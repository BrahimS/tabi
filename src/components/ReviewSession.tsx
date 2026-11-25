'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { submitReview } from '@/lib/actions';
import { primeSpeech } from '@/lib/speak';
import { SpeakButton } from './SpeakButton';
import { ProgressBar } from './ProgressBar';
import { IconArrowRight, IconCheck, IconRefresh } from './icons';

export interface ReviewCardData {
  key: string;
  lessonId: string;
  lessonTitle: string;
  unitTitle: string;
  kana: string;
  romaji: string;
  meaning: string;
  tag?: string;
  note?: string;
  example?: { kana: string; romaji: string; meaning: string };
}

type Grade = 'again' | 'hard' | 'good' | 'easy';

const GRADES: { id: Grade; label: string; hint: string; cls: string }[] = [
  { id: 'again', label: 'Again', hint: 'forgot it', cls: 'border-vermilion/60 text-vermilion hover:bg-vermilion hover:text-white' },
  { id: 'hard', label: 'Hard', hint: 'barely knew it', cls: 'border-gold/60 text-gold hover:bg-gold hover:text-white' },
  { id: 'good', label: 'Good', hint: 'knew it', cls: 'border-matcha/60 text-matcha hover:bg-matcha hover:text-white' },
  { id: 'easy', label: 'Easy', hint: 'instant recall', cls: 'border-indigo/60 text-indigo hover:bg-indigo hover:text-white' },
];

export function ReviewSession({
  cards,
  remaining,
}: {
  cards: ReviewCardData[];
  remaining: number;
}) {
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [counts, setCounts] = useState<Record<Grade, number>>({ again: 0, hard: 0, good: 0, easy: 0 });
  const [xp, setXp] = useState(0);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  const card = cards[idx];
  const reviewed = Object.values(counts).reduce((a, b) => a + b, 0);

  useEffect(() => {
    primeSpeech();
  }, []);

  // keyboard shortcuts — Space/Enter reveal, 1-4 grade
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return;
      if (!revealed) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setRevealed(true);
        }
        return;
      }
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= GRADES.length) grade(GRADES[n - 1].id);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, card, pending, idx]);

  function grade(g: Grade) {
    if (!card || pending) return;
    setPending(true);
    startTransition(async () => {
      try {
        const res = await submitReview(card.key, g);
        if (res.ok) setXp((x) => x + (res.xp as number));
      } finally {
        setPending(false);
        setCounts((c) => ({ ...c, [g]: c[g] + 1 }));
        setRevealed(false);
        if (idx + 1 >= cards.length) {
          setDone(true);
          router.refresh();
        } else {
          setIdx((i) => i + 1);
        }
      }
    });
  }

  if (done || cards.length === 0) {
    return (
      <div className="card mx-auto max-w-lg p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-matcha/15 text-matcha">
          <IconCheck width={32} height={32} />
        </div>
        <h2 className="text-2xl font-extrabold">Review complete!</h2>
        <p className="mt-1 text-ink-soft">
          {reviewed} cards reviewed · +{xp} XP earned
        </p>
        <div className="mx-auto mt-6 grid max-w-sm grid-cols-4 gap-2 text-center">
          {GRADES.map((g) => (
            <div key={g.id} className="rounded-xl bg-cream px-2 py-3">
              <p className="text-xl font-extrabold">{counts[g.id]}</p>
              <p className="text-[11px] font-semibold text-ink-soft">{g.label}</p>
            </div>
          ))}
        </div>
        {remaining > 0 && (
          <p className="mt-4 text-sm text-ink-soft">
            {remaining} more word{remaining === 1 ? '' : 's'} still due — they will be here tomorrow.
          </p>
        )}
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/" className="btn-primary px-6 py-2.5">
            Back to dashboard
          </Link>
          {remaining > 0 && (
            <Link href="/review" className="btn-ghost px-6 py-2.5">
              <IconRefresh width={16} height={16} />
              Review more
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-ink-soft">
          Card {idx + 1} / {cards.length}
        </span>
        <ProgressBar value={reviewed} max={cards.length} className="w-40" />
      </div>

      <div className="card p-8 text-center">
        <div className="flex items-center justify-center gap-2">
          {card.tag && <span className="chip">{card.tag}</span>}
          <span className="chip">{card.lessonTitle}</span>
        </div>

        {/* front */}
        <div
          className="mt-6 cursor-pointer select-none"
          onClick={() => !revealed && setRevealed(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && !revealed && setRevealed(true)}
        >
          <div className="text-7xl font-extrabold tracking-wide" lang="ja">
            {card.kana}
          </div>
          {!revealed && (
            <p className="mt-4 text-sm font-semibold text-ink-soft">
              Tap to reveal the answer
            </p>
          )}
        </div>

        {/* back */}
        {revealed && (
          <div className="mt-6 border-t border-line pt-6">
            <div className="text-2xl font-bold text-vermilion">{card.romaji}</div>
            <div className="mt-1 text-lg font-semibold">{card.meaning}</div>
            {card.note && (
              <p className="mx-auto mt-3 max-w-sm text-sm text-ink-soft">{card.note}</p>
            )}
            {card.example && (
              <div className="mx-auto mt-4 max-w-sm rounded-xl bg-cream px-4 py-3 text-left">
                <p className="font-bold" lang="ja">
                  {card.example.kana}
                </p>
                <p className="text-sm text-ink-soft">{card.example.romaji}</p>
                <p className="text-sm text-ink-soft">{card.example.meaning}</p>
              </div>
            )}
            <div className="mt-4 flex items-center justify-center gap-2">
              <SpeakButton text={card.kana} label="Listen" />
            </div>
          </div>
        )}
      </div>

      {/* grade buttons */}
      {revealed ? (
        <div className="mt-6 grid grid-cols-4 gap-2">
          {GRADES.map((g, gi) => (
            <button
              key={g.id}
              onClick={() => grade(g.id)}
              disabled={pending}
              className={`rounded-xl border-2 bg-white px-2 py-3 transition ${g.cls} disabled:opacity-50`}
            >
              <p className="text-sm font-extrabold">
                <span className="mr-1 font-mono text-[10px] opacity-40">{gi + 1}</span>
                {g.label}
              </p>
              <p className="text-[10px] font-semibold opacity-70">{g.hint}</p>
            </button>
          ))}
        </div>
      ) : (
        <button
          onClick={() => setRevealed(true)}
          className="btn-primary mt-6 w-full py-3"
        >
          Reveal answer
        </button>
      )}

      <p className="mt-4 flex items-center justify-center gap-1 text-center text-xs text-ink-soft">
        <IconArrowRight width={12} height={12} />
        Grade honestly — Space to reveal, keys 1–4 to grade
      </p>
    </div>
  );
}
