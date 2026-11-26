'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchTripDeck, logTripSession } from '@/lib/actions';
import {
  TRIP_SCENARIOS,
  type TripItem,
  type TripScenario,
} from '@/lib/trip';
import { IconZap, IconClock, IconCheck, IconArrowRight } from './icons';
import { SpeakButton } from './SpeakButton';

const DURATIONS = [30, 60, 90] as const;

interface Question {
  prompt: string;
  /** romaji shown under the prompt for kana→meaning questions */
  promptKana?: string;
  choices: string[];
  answer: string;
  item: TripItem;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeQuestion(item: TripItem, deck: TripItem[], kanaMode: boolean): Question {
  const distract = shuffle(deck.filter((d) => d.key !== item.key)).slice(0, 3);
  if (kanaMode) {
    const choices = shuffle([item, ...distract]).map((d) => d.romaji);
    return { prompt: item.kana, choices, answer: item.romaji, item };
  }
  const choices = shuffle([item, ...distract]).map((d) => d.kana);
  return { prompt: item.meaning, promptKana: item.romaji, choices, answer: item.kana, item };
}

type Phase =
  | { kind: 'pick' }
  | { kind: 'play'; deck: TripItem[]; kanaMode: boolean }
  | { kind: 'done'; score: number; answered: number; missed: TripItem[] };

export function TripSession() {
  const [phase, setPhase] = useState<Phase>({ kind: 'pick' });
  const [scenario, setScenario] = useState<TripScenario>('everything');
  const [duration, setDuration] = useState<number>(60);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  async function start() {
    setLoading(true);
    setLoadError('');
    try {
      const deck = await fetchTripDeck(scenario);
      if (deck.length < 4) {
        setLoadError('Not enough words in this scenario yet — try Everything.');
        return;
      }
      setPhase({ kind: 'play', deck: shuffle(deck), kanaMode: scenario === 'kana' });
    } catch {
      setLoadError('Could not load the deck — try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {phase.kind === 'pick' && (
        <PickView
          scenario={scenario}
          setScenario={setScenario}
          duration={duration}
          setDuration={setDuration}
          loading={loading}
          error={loadError}
          onStart={start}
        />
      )}
      {phase.kind === 'play' && (
        <PlayView
          deck={phase.deck}
          kanaMode={phase.kanaMode}
          duration={duration}
          scenario={scenario}
          onDone={(score, answered, missed) => setPhase({ kind: 'done', score, answered, missed })}
        />
      )}
      {phase.kind === 'done' && (
        <DoneView
          score={phase.score}
          answered={phase.answered}
          missed={phase.missed}
          onAgain={() => setPhase({ kind: 'pick' })}
        />
      )}
    </div>
  );
}

function PickView({
  scenario,
  setScenario,
  duration,
  setDuration,
  loading,
  error,
  onStart,
}: {
  scenario: TripScenario;
  setScenario: (s: TripScenario) => void;
  duration: number;
  setDuration: (d: number) => void;
  loading: boolean;
  error: string;
  onStart: () => void;
}) {
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {TRIP_SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => setScenario(s.id)}
            className={`card p-5 text-left transition ${
              scenario === s.id
                ? 'border-vermilion ring-2 ring-vermilion/30'
                : 'hover:border-ink-soft/40'
            }`}
          >
            <p className="font-extrabold">{s.title}</p>
            <p className="mt-0.5 text-sm text-ink-soft">{s.blurb}</p>
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        <IconClock width={16} height={16} />
        {DURATIONS.map((d) => (
          <button
            key={d}
            onClick={() => setDuration(d)}
            className={`rounded-lg border px-3 py-1.5 text-sm font-bold transition ${
              duration === d
                ? 'border-vermilion bg-vermilion text-white'
                : 'border-line bg-white text-ink-soft hover:border-ink-soft/40'
            }`}
          >
            {d}s
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-center text-sm font-semibold text-vermilion">{error}</p>}

      <button onClick={onStart} disabled={loading} className="btn-primary mx-auto mt-6 flex px-8 py-3">
        <IconZap width={18} height={18} />
        {loading ? 'Loading…' : 'Start the clock'}
      </button>
    </div>
  );
}

function PlayView({
  deck,
  kanaMode,
  duration,
  scenario,
  onDone,
}: {
  deck: TripItem[];
  kanaMode: boolean;
  duration: number;
  scenario: TripScenario;
  onDone: (score: number, answered: number, missed: TripItem[]) => void;
}) {
  const [q, setQ] = useState<Question>(() => makeQuestion(deck[0], deck, kanaMode));
  const [idx, setIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const missedRef = useRef<TripItem[]>([]);
  const scoreRef = useRef(0);
  const answeredRef = useRef(0);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    logTripSession(scenario, duration, scoreRef.current, answeredRef.current);
    onDone(scoreRef.current, answeredRef.current, missedRef.current);
  }, [onDone, scenario, duration]);

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft((v) => {
        if (v <= 1) {
          clearInterval(t);
          finish();
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [finish]);

  const answer = useCallback(
    (choice: string) => {
      if (flash) return;
      const correct = choice === q.answer;
      answeredRef.current += 1;
      setAnswered(answeredRef.current);
      if (correct) {
        scoreRef.current += 1;
        setScore(scoreRef.current);
      } else {
        missedRef.current.push(q.item);
      }
      setPicked(choice);
      setFlash(correct ? 'correct' : 'wrong');
      setTimeout(() => {
        const next = idx + 1;
        setIdx(next);
        setQ(makeQuestion(deck[next % deck.length], deck, kanaMode));
        setFlash(null);
        setPicked(null);
      }, 650);
    },
    [flash, q, idx, deck, kanaMode],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= q.choices.length) answer(q.choices[n - 1]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [answer, q.choices]);

  const urgent = timeLeft <= 10;

  return (
    <div>
      <div className="flex items-center justify-between">
        <span
          className={`rounded-xl px-3 py-1.5 font-mono text-lg font-extrabold ${
            urgent ? 'bg-vermilion text-white animate-pulse' : 'bg-cream'
          }`}
        >
          {timeLeft}s
        </span>
        <span className="text-sm font-bold text-ink-soft">
          Score <span className="text-lg font-extrabold text-ink">{score}</span>
          <span className="ml-2 opacity-60">/ {answered}</span>
        </span>
      </div>

      <div
        className={`card mt-5 p-8 text-center transition-colors ${
          flash === 'correct' ? 'border-emerald-600 bg-emerald-50' : ''
        } ${flash === 'wrong' ? 'border-vermilion bg-vermilion/5' : ''}`}
      >
        <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
          {kanaMode ? 'How does this read?' : 'How do you say…'}
        </p>
        <p
          className={`mt-3 font-extrabold ${kanaMode ? 'text-6xl' : 'text-3xl'}`}
          lang={kanaMode ? 'ja' : undefined}
        >
          {q.prompt}
        </p>
        {q.promptKana && <p className="mt-1 text-sm font-semibold text-ink-soft">{q.promptKana}</p>}

        <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-2">
          {q.choices.map((c, i) => {
            const isAnswer = c === q.answer;
            const wasPicked = c === picked;
            return (
              <button
                key={`${idx}-${i}`}
                onClick={() => answer(c)}
                disabled={flash !== null}
                lang={kanaMode ? undefined : 'ja'}
                className={`rounded-xl border-2 px-3 py-3 text-sm font-bold transition disabled:opacity-90 ${
                  flash && isAnswer
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : flash && wasPicked
                      ? 'border-vermilion bg-vermilion text-white'
                      : 'border-line bg-white hover:border-vermilion/50'
                }`}
              >
                <span className="mr-1.5 font-mono text-[10px] opacity-40">{i + 1}</span>
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <button onClick={finish} className="mt-4 text-xs font-semibold text-ink-soft hover:text-ink">
        End session early
      </button>
    </div>
  );
}

function DoneView({
  score,
  answered,
  missed,
  onAgain,
}: {
  score: number;
  answered: number;
  missed: TripItem[];
  onAgain: () => void;
}) {
  const acc = answered ? Math.round((score / answered) * 100) : 0;
  const unique = [...new Map(missed.map((m) => [m.key, m])).values()];

  return (
    <div className="card p-8 text-center">
      <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">Session complete</p>
      <p className="mt-2 text-6xl font-extrabold text-vermilion">{score}</p>
      <p className="mt-1 text-sm font-semibold text-ink-soft">
        {answered} answered · {acc}% accuracy
      </p>

      {unique.length > 0 && (
        <div className="mx-auto mt-6 max-w-md text-left">
          <p className="text-sm font-bold">Missed — drill these next:</p>
          <ul className="mt-2 space-y-2">
            {unique.slice(0, 10).map((m) => (
              <li
                key={m.key}
                className="flex items-center justify-between gap-2 rounded-xl bg-cream px-3 py-2"
              >
                <div>
                  <span className="font-bold" lang="ja">{m.kana}</span>
                  <span className="ml-2 text-xs text-ink-soft">{m.romaji}</span>
                  <p className="text-xs text-ink-soft">{m.meaning}</p>
                </div>
                <SpeakButton text={m.kana} iconOnly />
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={onAgain} className="btn-primary mt-6 px-8 py-3">
        <IconCheck width={16} height={16} /> Play again <IconArrowRight width={16} height={16} />
      </button>
    </div>
  );
}
