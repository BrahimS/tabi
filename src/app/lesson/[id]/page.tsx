import { notFound } from 'next/navigation';
import Link from 'next/link';
import { LESSON_INDEX, UNIT_INDEX, LESSONS } from '@/lib/content';
import { getPathStates } from '@/lib/data';
import { buildQuiz } from '@/lib/quiz';
import { videosForLesson } from '@/lib/videos';
import { LessonPlayer } from '@/components/LessonPlayer';
import { IconArrowLeft, IconLock } from '@/components/icons';

export const dynamic = 'force-dynamic';

export default async function LessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ phase?: string }>;
}) {
  const { id } = await params;
  const { phase } = await searchParams;
  const lesson = LESSON_INDEX.get(id);
  if (!lesson) notFound();

  const unit = UNIT_INDEX.get(lesson.unitId)!;
  const states = getPathStates();
  const idx = LESSONS.findIndex((l) => l.id === lesson.id);
  const state = states[idx];
  const nextLesson = LESSONS[idx + 1]
    ? {
        id: LESSONS[idx + 1].id,
        title: LESSONS[idx + 1].title,
        unitTitle: UNIT_INDEX.get(LESSONS[idx + 1].unitId)!.title,
      }
    : null;

  if (!state.unlocked) {
    const prevLesson = LESSONS[idx - 1];
    return (
      <div className="mx-auto max-w-lg">
        <div className="card p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream text-ink-soft">
            <IconLock width={28} height={28} />
          </div>
          <h1 className="text-2xl font-extrabold">This lesson is locked</h1>
          <p className="mt-2 text-ink-soft">
            Finish{' '}
            <span className="font-bold text-ink">
              {prevLesson ? `“${prevLesson.title}”` : 'the previous lesson'}
            </span>{' '}
            to unlock <span className="font-bold text-ink">“{lesson.title}”</span>.
          </p>
          <div className="mt-4 rounded-xl bg-cream px-4 py-3 text-sm text-ink-soft">
            <span className="font-bold text-ink">Coming up:</span> {lesson.subtitle} —{' '}
            {lesson.vocab.length} words to learn.
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link href="/learn" className="btn-primary px-6 py-2.5">
              <IconArrowLeft width={16} height={16} />
              Back to path
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const questions = buildQuiz(lesson);

  return (
    <LessonPlayer
      key={phase === 'learn' ? 'learn' : 'intro'}
      lesson={lesson}
      unitTitle={unit.title}
      questions={questions}
      nextLesson={nextLesson}
      bestAccuracy={state.bestAccuracy > 0 ? state.bestAccuracy : null}
      videos={videosForLesson(lesson.id)}
      initialPhase={phase === 'learn' ? 'learn' : 'intro'}
    />
  );
}
