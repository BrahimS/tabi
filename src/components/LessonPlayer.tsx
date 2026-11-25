'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Lesson, VocabItem } from '@/lib/types';
import type { QuizQuestion } from '@/lib/quiz';
import { checkRomajiAnswer } from '@/lib/quiz';
import { completeLesson, markLessonStarted } from '@/lib/actions';
import { VideoCard } from './VideoCard';
import type { VideoItem } from '@/lib/videos';
import { primeSpeech, speakJapanese } from '@/lib/speak';
import { SpeakButton } from './SpeakButton';
import { SayButton } from './SayButton';
import { ProgressBar } from './ProgressBar';
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconPlay,
  IconStar,
  IconVolume,
} from './icons';

type Phase = 'intro' | 'learn' | 'quiz' | 'done';

interface Props {
  lesson: Lesson;
  unitTitle: string;
  questions: QuizQuestion[];
  nextLesson: { id: string; title: string; unitTitle: string } | null;
  bestAccuracy: number | null;
  videos?: VideoItem[];
  initialPhase?: Phase;
}

export function LessonPlayer({
  lesson,
  unitTitle,
  questions,
  nextLesson,
  bestAccuracy,
  videos = [],
  initialPhase = 'intro',
}: Props) {
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [cardIdx, setCardIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [typeVal, setTypeVal] = useState('');
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [xpEarned, setXpEarned] = useState<number | null>(null);
  const [saveError, setSaveError] = useState(false);
  const doneRef = useRef(false);
  const router = useRouter();
  const [, startTransition] = useTransition();

  const vocab = lesson.vocab;
  const card = vocab[cardIdx];
  const q = questions[qIdx];
  const isLastCard = cardIdx === vocab.length - 1;
  const isLastQuestion = qIdx === questions.length - 1;

  useEffect(() => {
    primeSpeech();
    if (initialPhase === 'learn') void markLessonStarted(lesson.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist completion once when quiz finishes
  useEffect(() => {
    if (phase !== 'done' || doneRef.current) return;
    doneRef.current = true;
    startTransition(async () => {
      try {
        const res = await completeLesson(lesson.id, correctCount, questions.length);
        if (res.ok) {
          setXpEarned(res.xpEarned as number);
          router.refresh();
        } else {
          setXpEarned(lesson.vocab.length * 2);
          setSaveError(true);
        }
      } catch {
        setXpEarned(lesson.vocab.length * 2);
        setSaveError(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const learnHref = `/lesson/${lesson.id}?phase=learn`;

  // keyboard shortcuts — quiz: 1-9 pick / Enter next / Space replay audio;
  // learn: arrow keys flip cards
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return;
      if (phase === 'quiz' && q) {
        if (answered !== null) {
          if (e.key === 'Enter') {
            e.preventDefault();
            nextQuestion();
          }
          return;
        }
        if (q.choices && /^[1-9]$/.test(e.key)) {
          const i = parseInt(e.key, 10) - 1;
          if (i < q.choices.length) pickChoice(q.choices[i].id);
        }
        if (q.type === 'listen' && e.key === ' ') {
          e.preventDefault();
          speakJapanese(q.promptKana);
        }
      } else if (phase === 'learn') {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          if (isLastCard) finishLearn();
          else setCardIdx((i) => i + 1);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setCardIdx((i) => Math.max(0, i - 1));
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, q, answered, cardIdx, isLastCard]);

  function finishLearn() {
    setPhase('quiz');
    setQIdx(0);
    resetQuestion();
  }

  function resetQuestion() {
    setPicked(null);
    setTypeVal('');
    setAnswered(null);
  }

  function pickChoice(optId: string) {
    if (answered !== null || !q?.choices) return;
    setPicked(optId);
    const opt = q.choices.find((o) => o.id === optId);
    const ok = !!opt?.correct;
    setAnswered(ok);
    if (ok) setCorrectCount((c) => c + 1);
  }

  function submitType() {
    if (answered !== null || !q?.accept || !typeVal.trim()) return;
    const ok = checkRomajiAnswer(typeVal, q.accept);
    setAnswered(ok);
    if (ok) setCorrectCount((c) => c + 1);
  }

  function nextQuestion() {
    if (isLastQuestion) {
      setPhase('done');
      return;
    }
    setQIdx((i) => i + 1);
    resetQuestion();
  }

  const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-3xl">
      {/* header breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-ink-soft">
        <Link href="/learn" className="hover:text-ink">
          Learning path
        </Link>
        <span>/</span>
        <span className="font-semibold text-ink">{unitTitle}</span>
        <span>/</span>
        <span className="text-ink">{lesson.title}</span>
      </div>

      {phase === 'intro' && (
        <IntroView
          lesson={lesson}
          unitTitle={unitTitle}
          questions={questions}
          bestAccuracy={bestAccuracy}
          learnHref={learnHref}
          videos={videos}
        />
      )}

      {phase === 'learn' && card && (
        <LearnView
          card={card}
          idx={cardIdx}
          total={vocab.length}
          isScript={lesson.focus === 'script'}
          onPrev={() => setCardIdx((i) => Math.max(0, i - 1))}
          onNext={() => (isLastCard ? finishLearn() : setCardIdx((i) => i + 1))}
          onFinish={finishLearn}
          canPrev={cardIdx > 0}
          isLast={isLastCard}
        />
      )}

      {phase === 'quiz' && q && (
        <QuizView
          q={q}
          idx={qIdx}
          total={questions.length}
          picked={picked}
          typeVal={typeVal}
          answered={answered}
          isLast={isLastQuestion}
          onPick={pickChoice}
          onTypeChange={setTypeVal}
          onSubmitType={submitType}
          onNext={nextQuestion}
        />
      )}

      {phase === 'done' && (
        <DoneView
          lesson={lesson}
          accuracy={accuracy}
          correct={correctCount}
          total={questions.length}
          xpEarned={xpEarned}
          saveError={saveError}
          nextLesson={nextLesson}
        />
      )}
    </div>
  );
}

// ---------- intro ----------

function IntroView({
  lesson,
  unitTitle,
  questions,
  bestAccuracy,
  learnHref,
  videos,
}: {
  lesson: Lesson;
  unitTitle: string;
  questions: QuizQuestion[];
  bestAccuracy: number | null;
  learnHref: string;
  videos: VideoItem[];
}) {
  return (
    <div className="card p-8">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="chip">{unitTitle}</span>
        <span className="chip">Lesson {lesson.order}</span>
        {bestAccuracy !== null && (
          <span className="chip border-gold/40 bg-gold/10 text-gold">
            Best: {Math.round(bestAccuracy * 100)}%
          </span>
        )}
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight">{lesson.title}</h1>
      <p className="mt-1 text-lg text-ink-soft">{lesson.subtitle}</p>
      <p className="mt-4 leading-relaxed text-ink-soft">{lesson.description}</p>

      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-cream px-3 py-3">
          <p className="text-2xl font-extrabold text-vermilion">{lesson.vocab.length}</p>
          <p className="text-xs font-semibold text-ink-soft">words to learn</p>
        </div>
        <div className="rounded-xl bg-cream px-3 py-3">
          <p className="text-2xl font-extrabold text-vermilion">{questions.length}</p>
          <p className="text-xs font-semibold text-ink-soft">quiz questions</p>
        </div>
        <div className="rounded-xl bg-cream px-3 py-3">
          <p className="text-2xl font-extrabold text-vermilion">+{lesson.vocab.length * 2}</p>
          <p className="text-xs font-semibold text-ink-soft">XP to earn</p>
        </div>
      </div>

      {lesson.culture.length > 0 && (
        <div className="mt-6 space-y-3">
          {lesson.culture.map((c) => (
            <div key={c.title} className="rounded-xl border border-gold/30 bg-gold/5 p-4">
              <p className="text-sm font-bold text-ink">{c.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{c.body}</p>
            </div>
          ))}
        </div>
      )}

      {videos.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-sm font-bold text-ink-soft">
            Watch before you start{' '}
            <span className="font-normal">— a video for this lesson</span>
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {videos.slice(0, 2).map((v) => (
              <VideoCard key={v.id} video={v} compact />
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center gap-3">
        <Link href={learnHref} className="btn-primary px-6 py-3 text-base">
          <IconPlay width={18} height={18} />
          Start lesson
        </Link>
        <Link href="/learn" className="btn-ghost">
          Back to path
        </Link>
      </div>
    </div>
  );
}

// ---------- learn (flashcards) ----------

function LearnView({
  card,
  idx,
  total,
  isScript,
  canPrev,
  isLast,
  onPrev,
  onNext,
  onFinish,
}: {
  card: VocabItem;
  idx: number;
  total: number;
  isScript: boolean;
  canPrev: boolean;
  isLast: boolean;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
}) {
  const kanaSize =
    card.kana.length <= 2 ? 'text-8xl' : card.kana.length <= 5 ? 'text-6xl' : 'text-4xl';

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button onClick={onPrev} disabled={!canPrev} className="btn-ghost disabled:opacity-40">
          <IconArrowLeft width={16} height={16} />
          Back
        </button>
        <span className="text-sm font-semibold text-ink-soft">
          {idx + 1} / {total}
        </span>
        <button onClick={onFinish} className="btn-ghost">
          Skip to practice
        </button>
      </div>
      <ProgressBar value={idx + 1} max={total} className="mb-6" />

      <div className="card p-8 text-center">
        {card.tag && <span className="chip mb-4">{card.tag}</span>}
        <div className={`font-extrabold tracking-wide ${kanaSize}`} lang="ja">
          {card.kana}
        </div>
        <div className="mt-3 text-2xl font-semibold text-ink-soft">{card.romaji}</div>
        {card.meaning && card.meaning !== card.romaji && (
          <div className="mt-2 text-lg font-bold text-vermilion">{card.meaning}</div>
        )}

        {card.note && (
          <div className="mx-auto mt-6 max-w-md rounded-xl bg-cream px-4 py-3 text-left text-sm text-ink-soft">
            {card.note}
          </div>
        )}

        {card.example && (
          <div className="mx-auto mt-4 max-w-md rounded-xl border border-line bg-white p-4 text-left">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-bold" lang="ja">
                  {card.example.kana}
                </p>
                <p className="text-sm text-ink-soft">{card.example.romaji}</p>
                <p className="mt-1 text-sm text-ink-soft">{card.example.meaning}</p>
              </div>
              <SpeakButton text={card.example.kana} iconOnly />
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-3">
          <SpeakButton text={card.kana} label="Hear it" className="px-4 py-2" />
          <SayButton kana={card.kana} romaji={card.romaji} alt={card.alt} label="Say it" />
          <button onClick={onNext} className="btn-primary px-6 py-2.5">
            {isLast ? (
              <>
                Practice time <IconArrowRight width={16} height={16} />
              </>
            ) : (
              <>
                Next <IconArrowRight width={16} height={16} />
              </>
            )}
          </button>
        </div>
      </div>

      {isScript && (
        <p className="mt-4 text-center text-sm text-ink-soft">
          Tip: say each character out loud as you flip — hearing yourself is the fastest way to
          remember kana.
        </p>
      )}
    </div>
  );
}

// ---------- quiz ----------

function QuizView({
  q,
  idx,
  total,
  picked,
  typeVal,
  answered,
  isLast,
  onPick,
  onTypeChange,
  onSubmitType,
  onNext,
}: {
  q: QuizQuestion;
  idx: number;
  total: number;
  picked: string | null;
  typeVal: string;
  answered: boolean | null;
  isLast: boolean;
  onPick: (id: string) => void;
  onTypeChange: (v: string) => void;
  onSubmitType: () => void;
  onNext: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (q.type === 'type-romaji' && answered === null) {
      inputRef.current?.focus();
    }
  }, [q, answered]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-ink-soft">
          Question {idx + 1} / {total}
        </span>
        <ProgressBar value={idx + (answered !== null ? 1 : 0)} max={total} className="w-40" />
      </div>

      <div className="card p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
          {q.promptLabel}
        </p>

        {/* prompt */}
        <div className="mt-4 text-center">
          {q.type === 'listen' ? (
            <ListenPrompt kana={q.promptKana} answered={answered !== null} />
          ) : (
            <>
              {q.promptKana && (
                <div className="text-6xl font-extrabold tracking-wide" lang="ja">
                  {q.promptKana}
                </div>
              )}
              {q.promptRomaji && (
                <div className="mt-2 text-3xl font-bold text-vermilion">{q.promptRomaji}</div>
              )}
              {q.promptHint && (
                <div className="mt-2 text-sm text-ink-soft">({q.promptHint})</div>
              )}
            </>
          )}
        </div>

        {/* choices */}
        {q.choices && (
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {q.choices.map((opt, oi) => {
              let cls = 'border-line bg-white hover:border-vermilion/60 hover:bg-vermilion/5';
              if (answered !== null) {
                if (opt.correct) cls = 'border-matcha bg-matcha/10 text-matcha';
                else if (picked === opt.id)
                  cls = 'border-vermilion bg-vermilion/10 text-vermilion';
                else cls = 'border-line bg-white opacity-50';
              }
              return (
                <button
                  key={opt.id}
                  onClick={() => onPick(opt.id)}
                  disabled={answered !== null}
                  className={`rounded-xl border-2 px-4 py-4 text-lg font-bold transition ${cls}`}
                  lang={q.choicesInJapanese ? 'ja' : undefined}
                >
                  <span className="mr-2 hidden font-mono text-xs font-semibold opacity-40 sm:inline">
                    {oi + 1}
                  </span>
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}
        {q.choices && answered === null && (
          <p className="mt-3 text-center text-xs text-ink-soft">
            Keys 1–{Math.min(q.choices.length, 9)} to answer · Enter to continue
          </p>
        )}

        {/* type answer */}
        {q.type === 'type-romaji' && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="flex w-full max-w-sm items-center gap-2">
              <input
                ref={inputRef}
                value={typeVal}
                onChange={(e) => onTypeChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && answered === null && onSubmitType()}
                disabled={answered !== null}
                placeholder="e.g. arigatou"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                className="w-full rounded-xl border-2 border-line bg-white px-4 py-3 text-center text-lg font-bold outline-none transition focus:border-vermilion disabled:opacity-60"
              />
              <button
                onClick={onSubmitType}
                disabled={answered !== null || !typeVal.trim()}
                className="btn-primary shrink-0 px-4 py-3"
              >
                Check
              </button>
            </div>
            {answered === false && (
              <p className="text-sm font-semibold text-vermilion">
                Not quite — the answer was “{q.accept?.[0]}”
              </p>
            )}
          </div>
        )}

        {/* feedback + next */}
        {answered !== null && (
          <div className="mt-6">
            <div
              className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${
                answered ? 'bg-matcha/10 text-matcha' : 'bg-vermilion/10 text-vermilion'
              }`}
            >
              {answered ? <IconCheck width={18} height={18} /> : <IconVolume width={18} height={18} />}
              {answered ? 'Correct!' : 'Not quite.'}
              {q.explain && <span className="font-semibold opacity-80">— {q.explain}</span>}
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={onNext} className="btn-primary px-6 py-2.5">
                {isLast ? 'See results' : 'Next'}
                <IconArrowRight width={16} height={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ListenPrompt({ kana, answered }: { kana: string; answered: boolean }) {
  // auto-play once when the question appears (answer reveal stops re-plays)
  useEffect(() => {
    if (answered) return;
    const t = setTimeout(() => speakJapanese(kana), 350);
    return () => clearTimeout(t);
  }, [kana, answered]);

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <button
        type="button"
        onClick={() => speakJapanese(kana)}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-vermilion text-white shadow-md transition hover:scale-105 active:scale-95"
        aria-label="Replay audio"
      >
        <IconVolume width={34} height={34} />
      </button>
      <p className="text-xs text-ink-soft">Tap to replay · Space</p>
      {answered && (
        <p className="text-4xl font-extrabold tracking-wide" lang="ja">
          {kana}
        </p>
      )}
    </div>
  );
}

// ---------- done ----------

function DoneView({
  lesson,
  accuracy,
  correct,
  total,
  xpEarned,
  saveError,
  nextLesson,
}: {
  lesson: Lesson;
  accuracy: number;
  correct: number;
  total: number;
  xpEarned: number | null;
  saveError: boolean;
  nextLesson: { id: string; title: string; unitTitle: string } | null;
}) {
  const router = useRouter();
  return (
    <div className="card p-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold">
        <IconStar width={32} height={32} />
      </div>
      <h2 className="text-2xl font-extrabold">Lesson complete!</h2>
      <p className="mt-1 text-ink-soft">{lesson.title}</p>

      <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-3">
        <div className="rounded-xl bg-cream px-3 py-3">
          <p className="text-2xl font-extrabold text-vermilion">{accuracy}%</p>
          <p className="text-xs font-semibold text-ink-soft">accuracy</p>
        </div>
        <div className="rounded-xl bg-cream px-3 py-3">
          <p className="text-2xl font-extrabold text-vermilion">
            {correct}/{total}
          </p>
          <p className="text-xs font-semibold text-ink-soft">correct</p>
        </div>
        <div className="rounded-xl bg-cream px-3 py-3">
          <p className="text-2xl font-extrabold text-vermilion">
            {xpEarned === null ? '…' : `+${xpEarned}`}
          </p>
          <p className="text-xs font-semibold text-ink-soft">XP earned</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-ink-soft">
        {lesson.vocab.length} words & characters added to your review deck.
      </p>
      {saveError && (
        <p className="mt-2 text-sm font-semibold text-vermilion">
          Progress could not be saved — check your connection and refresh.
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/review" className="btn-primary px-6 py-2.5" onClick={() => router.refresh()}>
          Review words
          <IconArrowRight width={16} height={16} />
        </Link>
        {nextLesson && (
          <Link href={`/lesson/${nextLesson.id}`} className="btn-ghost px-6 py-2.5">
            Next: {nextLesson.title}
            <IconArrowRight width={16} height={16} />
          </Link>
        )}
        <Link href="/learn" className="btn-ghost px-6 py-2.5">
          Back to path
        </Link>
      </div>
    </div>
  );
}
