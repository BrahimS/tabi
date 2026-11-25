'use client';

import { useEffect, useState } from 'react';
import { STROKE_PATHS } from '@/lib/strokes';

/**
 * Stroke-order overlay for kana. KanjiVG centerlines on a 109×109 canvas,
 * revealed one stroke at a time on mount; remount (via key) to replay.
 */
export function StrokeGuide({ glyph }: { glyph: string }) {
  const paths = STROKE_PATHS[glyph];
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!paths) return;
    const t = setInterval(
      () => setShown((s) => Math.min(paths.length, s + 1)),
      650,
    );
    return () => clearInterval(t);
  }, [paths]);

  if (!paths) return null;

  const visible = paths.slice(0, shown);
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 109 109"
      aria-hidden
    >
      {visible.map((s, i) => (
        <path
          key={i}
          d={s.d}
          fill="none"
          stroke="#c2402a"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={i === visible.length - 1 ? 0.45 : 0.28}
        />
      ))}
      {visible.map((s, i) => (
        <g key={`n${i}`} opacity="0.9">
          <circle cx={s.x} cy={s.y} r="6.2" fill="#c2402a" />
          <text
            x={s.x}
            y={s.y}
            dy="0.34em"
            textAnchor="middle"
            fontSize="8.5"
            fontWeight="bold"
            fill="#fff"
          >
            {i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}
