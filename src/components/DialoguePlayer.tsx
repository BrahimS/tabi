'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { DialogueChoice, DialogueScene } from '@/lib/dialogues';
import { completeDialogue } from '@/lib/actions';
import { IconCheck, IconArrowRight, IconArrowLeft, IconRefresh } from './icons';
import { SpeakButton } from './SpeakButton';
import { SayButton } from './SayButton';

interface Bubble {
  speaker: 'them' | 'you' | 'narrator' | 'system';
  kana?: string;
  romaji?: string;
  meaning?: string;
  wrong?: boolean;
}

export function DialoguePlayer({
  scene,
  onExit,
}: {
  scene: DialogueScene;
  onExit: () => void;
}) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [turnIdx, setTurnIdx] = useState(0);
  const [activeChoices, setActiveChoices] = useState<DialogueChoice[] | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [done, setDone] = useState(false);
  const [xpEarned, setXpEarned] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reveal the current turn: narrator/them auto-append + advance; 'you' waits for a choice.
  const advance = useCallback(
    (idx: number, extra?: Bubble[]) => {
      let i = idx;
      const next: Bubble[] = [...(extra ?? [])];
      while (i < scene.turns.length) {
        const t = scene.turns[i];
        if (t.speaker === 'you') {
          setActiveChoices(t.choices ?? []);
          setTurnIdx(i);
          setBubbles((b) => [...b, ...next]);
          return;
        }
        next.push({ speaker: t.speaker, kana: t.kana, romaji: t.romaji, meaning: t.meaning });
        i += 1;
      }
      setActiveChoices(null);
      setBubbles((b) => [...b, ...next]);
      setTurnIdx(i);
      setDone(true);
    },
    [scene],
  );

  useEffect(() => {
    const raf = requestAnimationFrame(() => advance(0));
    return () => cancelAnimationFrame(raf);
  }, [advance]);

  // Auto-scroll to the newest bubble.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [bubbles, activeChoices]);

  // Award XP once when finished.
  useEffect(() => {
    if (!done || xpEarned !== null) return;
    completeDialogue(scene.id, mistakes).then((res) => {
      if (res.ok && typeof res.xp === 'number') setXpEarned(res.xp);
      else setXpEarned(0);
    });
  }, [done, mistakes, scene.id, xpEarned]);

  function pick(choice: DialogueChoice) {
    if (!activeChoices || done) return;
    if (choice.correct) {
      const idx = turnIdx + 1;
      advance(idx, [
        {
          speaker: 'you',
          kana: choice.kana,
          romaji: choice.romaji,
          meaning: choice.meaning,
        },
      ]);
    } else {
      setMistakes((m) => m + 1);
      setBubbles((b) => [
        ...b,
        { speaker: 'you', kana: choice.kana, romaji: choice.romaji, wrong: true },
        { speaker: 'system', meaning: choice.feedback ?? 'Not quite — try again.' },
      ]);
    }
  }

  function restart() {
    setBubbles([]);
    setMistakes(0);
    setDone(false);
    setXpEarned(null);
    setActiveChoices(null);
    advance(0);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          onClick={onExit}
          className="flex items-center gap-1 text-sm font-semibold text-ink-soft hover:text-ink"
        >
          <IconArrowLeft width={15} height={15} /> All scenes
        </button>
        <span className="text-xs font-bold text-ink-soft">
          {scene.title} · {mistakes} {mistakes === 1 ? 'mistake' : 'mistakes'}
        </span>
      </div>

      <div
        ref={scrollRef}
        className="card mt-4 flex max-h-[60vh] min-h-[320px] flex-col gap-3 overflow-y-auto p-5"
      >
        {bubbles.map((b, i) => {
          if (b.speaker === 'narrator') {
            return (
              <p key={i} className="text-center text-xs italic text-ink-soft">
                — {b.meaning} —
              </p>
            );
          }
          if (b.speaker === 'system') {
            return (
              <div
                key={i}
                className="mx-auto max-w-sm rounded-xl border border-gold/50 bg-gold/10 px-3 py-2 text-center text-xs font-semibold text-ink"
              >
                {b.meaning}
              </div>
            );
          }
          const you = b.speaker === 'you';
          return (
            <div key={i} className={`flex ${you ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  you
                    ? b.wrong
                      ? 'rounded-br-sm bg-vermilion/15 text-ink'
                      : 'rounded-br-sm bg-vermilion text-white'
                    : 'rounded-bl-sm bg-cream text-ink'
                }`}
              >
                {b.kana && (
                  <p className="font-bold" lang="ja">
                    {b.kana}
                    {b.wrong && <span className="ml-1.5 text-vermilion">✗</span>}
                  </p>
                )}
                {b.romaji && (
                  <p className={`text-xs ${you && !b.wrong ? 'text-white/80' : 'text-ink-soft'}`}>
                    {b.romaji}
                  </p>
                )}
                {b.meaning && (
                  <p
                    className={`mt-0.5 text-xs italic ${you && !b.wrong ? 'text-white/70' : 'text-ink-soft'}`}
                  >
                    {b.meaning}
                  </p>
                )}
                {you && !b.wrong && b.kana && (
                  <div className="mt-1.5">
                    <SayButton
                      kana={b.kana}
                      romaji={b.romaji ?? ''}
                      label="Say it"
                      className="!border-transparent !bg-white/25 !text-white !px-2 !py-1 hover:!bg-white/40"
                    />
                  </div>
                )}
                {!you && b.kana && (
                  <div className="mt-1.5">
                    <SpeakButton text={b.kana} iconOnly className="!border-transparent !bg-white/60 !px-2 !py-1" />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {activeChoices && !done && (
          <div className="mt-2 space-y-2 border-t border-line pt-3">
            <p className="text-center text-xs font-bold uppercase tracking-wide text-ink-soft">
              Your reply
            </p>
            {activeChoices.map((c, i) => (
              <button
                key={i}
                onClick={() => pick(c)}
                className="w-full rounded-xl border-2 border-line bg-white px-4 py-3 text-left transition hover:border-vermilion/50"
              >
                <span className="font-bold" lang="ja">{c.kana}</span>
                <span className="ml-2 text-xs text-ink-soft">{c.romaji}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {done && (
        <div className="card mt-4 p-6 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">Scene complete</p>
          <p className="mt-1 text-4xl font-extrabold text-vermilion">
            {xpEarned === null ? '…' : `+${xpEarned} XP`}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            {mistakes === 0 ? 'Perfect run — not a single misstep!' : `${mistakes} ${mistakes === 1 ? 'mistake' : 'mistakes'} — replay for a clean run.`}
            {xpEarned === 0 && (
              <span className="mt-1 block text-xs">
                No XP this time — you already matched your best run. Fewer mistakes earns the difference.
              </span>
            )}
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <button onClick={restart} className="btn-secondary">
              <IconRefresh width={15} height={15} /> Replay
            </button>
            <button onClick={onExit} className="btn-primary">
              <IconCheck width={15} height={15} /> More scenes <IconArrowRight width={15} height={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
