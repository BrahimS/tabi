import type { Metadata } from 'next';
import { getWritingDeck } from '@/lib/data';
import { WritingPad } from '@/components/WritingPad';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Writing practice — Tabi',
};

export default function WritePage() {
  const deck = getWritingDeck();
  const total = deck.hiragana.length + deck.katakana.length + deck.words.length;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Writing practice</h1>
        <p className="mt-1 text-ink-soft">
          Pick a character and write it with your stylus (or finger / mouse). Follow the ghost
          guide — stroke order goes left to right, top to bottom. {total} characters and words from
          your curriculum.
        </p>
      </div>
      <WritingPad deck={deck} />
    </div>
  );
}
