'use client';

import { useEffect, useRef, useState } from 'react';
import { speakJapanese, primeSpeech } from '@/lib/speak';
import { IconVolume } from './icons';

export function SpeakButton({
  text,
  label = 'Listen',
  className = '',
  iconOnly = false,
}: {
  text: string;
  label?: string;
  className?: string;
  iconOnly?: boolean;
}) {
  const [speaking, setSpeaking] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    []
  );

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    primeSpeech();
    speakJapanese(text);
    setSpeaking(true);
    if (timerRef.current) clearInterval(timerRef.current);
    // Reflect actual speech state; clear after 4s max as a safety net.
    let elapsed = 0;
    timerRef.current = setInterval(() => {
      elapsed += 150;
      const stillSpeaking =
        'speechSynthesis' in window && window.speechSynthesis.speaking;
      if (!stillSpeaking || elapsed > 4000) {
        if (timerRef.current) clearInterval(timerRef.current);
        setSpeaking(false);
      }
    }, 150);
  }

  return (
    <button
      type="button"
      aria-label={iconOnly ? `Listen: ${text}` : undefined}
      title={iconOnly ? `Listen: ${text}` : `Listen: ${text}`}
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${
        speaking
          ? 'border-vermilion bg-vermilion/10 text-vermilion'
          : 'border-line bg-white text-ink-soft hover:border-vermilion/50 hover:text-vermilion'
      } ${className}`}
    >
      <span className={speaking ? 'animate-pulse' : ''}>
        <IconVolume width={16} height={16} />
      </span>
      {!iconOnly && (speaking ? 'Playing…' : label)}
    </button>
  );
}
