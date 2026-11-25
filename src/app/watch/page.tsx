import type { Metadata } from 'next';
import { VIDEOS, type VideoItem } from '@/lib/videos';
import { UNIT_INDEX } from '@/lib/content';
import { VideoCard } from '@/components/VideoCard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Watch & learn — Tabi',
};

const SECTIONS: { id: VideoItem['section']; title: string; blurb: string }[] = [
  {
    id: 'scripts',
    title: 'The scripts',
    blurb: 'Hiragana and katakana, with stroke order — grab your stylus and write along.',
  },
  {
    id: 'phrases',
    title: 'Phrases by situation',
    blurb: 'Matched to your curriculum units — greetings, money, restaurants, and stations.',
  },
  {
    id: 'survival',
    title: 'Survival Japanese',
    blurb: 'The big phrase checklists — review these before you fly.',
  },
];

export default function WatchPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Watch &amp; learn</h1>
        <p className="mt-1 text-ink-soft">
          Hand-picked beginner videos matched to your units — tap a thumbnail to play it right
          here. Videos stream from YouTube, so you&apos;ll need an internet connection.
        </p>
      </div>

      <div className="space-y-10">
        {SECTIONS.map((section) => {
          const vids = VIDEOS.filter((v) => v.section === section.id);
          if (vids.length === 0) return null;
          return (
            <section key={section.id}>
              <h2 className="text-xl font-extrabold">{section.title}</h2>
              <p className="mt-0.5 text-sm text-ink-soft">{section.blurb}</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {vids.map((v) => (
                  <div key={v.id}>
                    <VideoCard video={v} />
                    <p className="mt-1.5 text-xs text-ink-soft">
                      Fits:{' '}
                      <span className="font-bold text-ink">
                        {UNIT_INDEX.get(v.unitId)?.title ?? v.unitId}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
