import type { Metadata } from 'next';
import { UNITS } from '@/lib/content';
import { PhrasebookClient, type PhraseSection } from '@/components/PhrasebookClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Phrasebook — Tabi',
  description: 'Every word and phrase from your curriculum, grouped by situation — searchable and printable.',
};

export default function PhrasesPage() {
  const sections: PhraseSection[] = UNITS.flatMap((unit) =>
    unit.lessons
      .map((lesson) => ({
        title: `${unit.title} — ${lesson.title}`,
        items: lesson.vocab.map((v) => ({
          kana: v.kana,
          romaji: v.romaji,
          meaning: v.meaning,
        })),
      }))
      .filter((s) => s.items.length > 0),
  );
  const total = sections.reduce((n, s) => n + s.items.length, 0);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Phrasebook</h1>
        <p className="mt-1 text-ink-soft">
          All {total} words and phrases from your curriculum, grouped by situation. Tap a phrase to
          hear it — or print this page for an offline cheat sheet.
        </p>
      </div>
      <PhrasebookClient sections={sections} />
    </div>
  );
}
