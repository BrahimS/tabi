import Link from 'next/link';
import { getDueVocab, getDueCount } from '@/lib/data';
import { ReviewSession } from '@/components/ReviewSession';
import { IconBook } from '@/components/icons';

export const dynamic = 'force-dynamic';

export default function ReviewPage() {
  const total = getDueCount();
  const cards = getDueVocab(40);
  const remaining = Math.max(0, total - cards.length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Review deck</h1>
        <p className="mt-1 text-ink-soft">
          Spaced repetition — the words you forget come back sooner, the ones you know fade away.
        </p>
      </div>

      {cards.length === 0 ? (
        <div className="card mx-auto max-w-lg p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-matcha/15 text-matcha">
            <IconBook width={28} height={28} />
          </div>
          <h2 className="text-2xl font-extrabold">All caught up!</h2>
          <p className="mt-2 text-ink-soft">
            Nothing due right now. Complete a lesson to add new words, or come back tomorrow — your
            deck schedules itself.
          </p>
          <Link href="/learn" className="btn-primary mt-6 px-6 py-2.5">
            Go to learning path
          </Link>
        </div>
      ) : (
        <>
          {remaining > 0 && (
            <p className="text-center text-sm text-ink-soft">
              Showing {cards.length} of {total} due words — the rest will follow in the next session.
            </p>
          )}
          <ReviewSession cards={cards} remaining={remaining} />
        </>
      )}
    </div>
  );
}
