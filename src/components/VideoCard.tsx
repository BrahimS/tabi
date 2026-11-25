'use client';

import { useState } from 'react';
import { IconPlay } from './icons';
import type { VideoItem } from '@/lib/videos';

export function VideoCard({ video, compact = false }: { video: VideoItem; compact?: boolean }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      {playing ? (
        <div className="aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group relative block aspect-video w-full overflow-hidden bg-ink"
          aria-label={`Play video: ${video.title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover opacity-90 transition group-hover:scale-[1.03] group-hover:opacity-100"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-vermilion/95 text-white shadow-lg transition group-hover:scale-110">
              <IconPlay width={24} height={24} />
            </span>
          </span>
        </button>
      )}
      <div className="p-3">
        <p className="text-sm font-bold leading-snug">{video.title}</p>
        <p className="mt-0.5 text-xs font-semibold text-vermilion">{video.channel}</p>
        {!compact && <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{video.blurb}</p>}
      </div>
    </div>
  );
}
