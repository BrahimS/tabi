'use client';

import { useEffect, useRef, useState } from 'react';
import {
  listenJapanese,
  scoreSpeech,
  speechRecognitionSupported,
  type SayVerdict,
  type SpeechError,
} from '@/lib/speech';
import { IconMic } from './icons';

type State =
  | { kind: 'idle' }
  | { kind: 'listening' }
  | { kind: 'result'; verdict: SayVerdict; heard: string }
  | { kind: 'error'; error: SpeechError };

const VERDICT_STYLE: Record<SayVerdict, string> = {
  exact: 'border-emerald-600 bg-emerald-600/10 text-emerald-700',
  close: 'border-gold bg-gold/10 text-gold',
  miss: 'border-vermilion bg-vermilion/10 text-vermilion',
};

const VERDICT_LABEL: Record<SayVerdict, string> = {
  exact: 'Sounds right!',
  close: 'Close — try again',
  miss: 'Not quite — try again',
};

const ERROR_LABEL: Record<SpeechError, string> = {
  unsupported: 'Speech recognition needs Chrome or Edge',
  denied: 'Microphone access blocked',
  'no-speech': 'No speech heard — try again',
  network: 'Speech service unavailable (offline?)',
  aborted: 'Cancelled',
  error: 'Something went wrong',
};

export function SayButton({
  kana,
  romaji,
  alt,
  label = 'Say it',
  className = '',
  onVerdict,
}: {
  kana: string;
  romaji: string;
  alt?: string[];
  label?: string;
  className?: string;
  onVerdict?: (v: SayVerdict) => void;
}) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [state, setState] = useState<State>({ kind: 'idle' });
  const busyRef = useRef(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() =>
      setSupported(speechRecognitionSupported())
    );
    return () => cancelAnimationFrame(raf);
  }, []);

  async function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (busyRef.current) return;
    busyRef.current = true;
    setState({ kind: 'listening' });
    try {
      const res = await listenJapanese();
      const score = scoreSpeech(res.transcript, { kana, romaji, alt });
      setState({ kind: 'result', verdict: score.verdict, heard: score.heard });
      onVerdict?.(score.verdict);
    } catch (err) {
      setState({ kind: 'error', error: (err as SpeechError) ?? 'error' });
    } finally {
      busyRef.current = false;
    }
  }

  if (supported === false) return null;
  if (supported === null) {
    // Avoid layout jump: reserve an invisible button while detecting.
    return <span className={`inline-block h-[34px] w-24 ${className}`} />;
  }

  const listening = state.kind === 'listening';
  const base =
    'inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold transition';

  return (
    <span className="inline-flex flex-col items-center gap-1">
      <button
        type="button"
        aria-label={`Practice saying: ${romaji}`}
        title={`Practice saying: ${romaji}`}
        onClick={handleClick}
        disabled={listening}
        className={`${base} ${
          listening
            ? 'border-vermilion bg-vermilion/10 text-vermilion'
            : 'border-line bg-white text-ink-soft hover:border-vermilion/50 hover:text-vermilion'
        } ${className}`}
      >
        <span className={listening ? 'animate-pulse' : ''}>
          <IconMic width={16} height={16} />
        </span>
        {listening ? 'Listening…' : label}
      </button>
      {state.kind === 'result' && (
        <span
          className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${VERDICT_STYLE[state.verdict]}`}
        >
          {VERDICT_LABEL[state.verdict]}
          {state.heard && state.heard !== kana && (
            <span className="opacity-70" lang="ja">
              heard: {state.heard}
            </span>
          )}
        </span>
      )}
      {state.kind === 'error' && (
        <span className="text-[11px] font-semibold text-ink-soft">
          {ERROR_LABEL[state.error]}
        </span>
      )}
    </span>
  );
}
