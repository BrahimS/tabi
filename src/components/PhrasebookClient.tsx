'use client';

import { useMemo, useState } from 'react';
import { SpeakButton } from './SpeakButton';

export interface PhraseSection {
  title: string;
  subtitle?: string;
  items: { kana: string; romaji: string; meaning: string }[];
}

/** Searchable survival phrasebook — every curriculum word grouped by situation. */
export function PhrasebookClient({ sections }: { sections: PhraseSection[] }) {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return sections;
    return sections
      .map((s) => ({
        ...s,
        items: s.items.filter(
          (i) =>
            i.meaning.toLowerCase().includes(needle) ||
            i.romaji.toLowerCase().includes(needle) ||
            i.kana.includes(needle),
        ),
      }))
      .filter((s) => s.items.length > 0);
  }, [q, sections]);

  const total = filtered.reduce((n, s) => n + s.items.length, 0);

  return (
    <div>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search English, romaji, or Japanese… (e.g. water, eki, 駅)"
        className="mb-6 w-full rounded-xl border border-line bg-white px-4 py-2.5 outline-none transition focus:border-vermilion"
        aria-label="Search phrases"
      />
      {total === 0 && (
        <p className="py-8 text-center text-ink-soft">No phrases match “{q}”.</p>
      )}
      <div className="space-y-8">
        {filtered.map((s) => (
          <section key={s.title}>
            <h2 className="text-lg font-extrabold tracking-tight">{s.title}</h2>
            {s.subtitle && <p className="mb-2 text-xs text-ink-soft">{s.subtitle}</p>}
            <div className="mt-2 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper">
              {s.items.map((i, idx) => (
                <div key={`${i.kana}-${idx}`} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="min-w-24 text-lg font-bold">{i.kana}</span>
                  <span className="min-w-24 text-sm text-ink-soft">{i.romaji}</span>
                  <span className="flex-1 text-sm">{i.meaning}</span>
                  <SpeakButton text={i.kana} iconOnly />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
