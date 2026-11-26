'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { logWritingPractice, recognizeInk } from '@/lib/actions';
import { SpeakButton } from './SpeakButton';
import { StrokeGuide, hasStrokeData } from './StrokeGuide';
import { IconArrowRight, IconCheck, IconRefresh, IconStar } from './icons';
import type { WritingDeck, WritingItem } from '@/lib/data';

interface Point {
  x: number;
  y: number;
  p: number;
  t: number;
}
interface Stroke {
  points: Point[];
  size: number;
}

const BRUSHES = [1.5, 2.5, 3.5, 4.5, 5.5, 7, 8.5, 10, 12.5, 15];
const BRUSH_DOTS = [4, 5.5, 7, 8.5, 10, 11.5, 13, 14.5, 16, 17];
const BRUSH_KEY = 'tabi-brush';

const LOGICAL = 300;
const JP_FONT = `'Hiragino Sans','Hiragino Kaku Gothic ProN','Yu Gothic','Meiryo',sans-serif`;
const INK_COLOR = '#241a12';

type Tab = 'hiragana' | 'katakana' | 'words';
const TABS: { id: Tab; label: string }[] = [
  { id: 'hiragana', label: 'Hiragana' },
  { id: 'katakana', label: 'Katakana' },
  { id: 'words', label: 'Words' },
];

export function WritingPad({ deck }: { deck: WritingDeck }) {
  const [tab, setTab] = useState<Tab>('hiragana');
  const items = deck[tab];
  const [idx, setIdx] = useState(0);
  const item: WritingItem | undefined = items[Math.min(idx, items.length - 1)];

  const strokesRef = useRef<Stroke[]>([]);
  const currentRef = useRef<Stroke | null>(null);
  const prevMidRef = useRef<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const t0Ref = useRef(0);

  const [strokeCount, setStrokeCount] = useState(0);
  const [brushIdx, setBrushIdx] = useState(3);
  const [showGuide, setShowGuide] = useState(true);
  const [showStrokes, setShowStrokes] = useState(true);
  const [strokeReplay, setStrokeReplay] = useState(0);
  const [checking, setChecking] = useState(false);
  const [candidates, setCandidates] = useState<string[] | null>(null);
  const [recoError, setRecoError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // restore last-used brush (deferred so server + first client render agree)
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const saved = Number(localStorage.getItem(BRUSH_KEY));
        if (saved >= 0 && saved < BRUSHES.length) setBrushIdx(saved);
      } catch {
        // storage unavailable
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(BRUSH_KEY, String(brushIdx));
    } catch {
      // storage unavailable
    }
  }, [brushIdx]);

  // --- canvas setup (hi-dpi) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(2.5, window.devicePixelRatio || 1);
    canvas.width = LOGICAL * dpr;
    canvas.height = LOGICAL * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  const getCtx = () => canvasRef.current?.getContext('2d') ?? null;

  const drawSegment = useCallback(
    (ctx: CanvasRenderingContext2D, a: Point, b: Point, size: number) => {
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const from = prevMidRef.current ?? { x: a.x, y: a.y };
      ctx.strokeStyle = INK_COLOR;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = size * (0.5 + (a.p + b.p) / 2);
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.quadraticCurveTo(a.x, a.y, mid.x, mid.y);
      ctx.stroke();
      prevMidRef.current = mid;
    },
    [],
  );

  const drawStroke = useCallback(
    (ctx: CanvasRenderingContext2D, s: Stroke) => {
      const pts = s.points;
      if (pts.length === 0) return;
      if (pts.length === 1) {
        ctx.fillStyle = INK_COLOR;
        ctx.beginPath();
        ctx.arc(pts[0].x, pts[0].y, s.size * 0.45, 0, Math.PI * 2);
        ctx.fill();
        return;
      }
      prevMidRef.current = null;
      for (let i = 1; i < pts.length; i++) drawSegment(ctx, pts[i - 1], pts[i], s.size);
      prevMidRef.current = null;
    },
    [drawSegment],
  );

  const redrawAll = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    ctx.clearRect(0, 0, LOGICAL, LOGICAL);
    for (const s of strokesRef.current) drawStroke(ctx, s);
  }, [drawStroke]);

  const clearBoard = useCallback(() => {
    strokesRef.current = [];
    currentRef.current = null;
    setStrokeCount(0);
    setCandidates(null);
    setRecoError(null);
    const ctx = getCtx();
    if (ctx) ctx.clearRect(0, 0, LOGICAL, LOGICAL);
  }, []);

  const selectItem = useCallback(
    (i: number) => {
      setIdx(i);
      clearBoard();
    },
    [clearBoard],
  );

  const selectTab = useCallback(
    (t: Tab) => {
      setTab(t);
      setIdx(0);
      clearBoard();
    },
    [clearBoard],
  );

  const goNext = useCallback(() => {
    clearBoard();
    setIdx((i) => (i + 1) % Math.max(1, items.length));
  }, [clearBoard, items.length]);

  // --- pointer drawing ---
  const toPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!t0Ref.current) t0Ref.current = performance.now();
    return {
      x: ((e.clientX - rect.left) / rect.width) * LOGICAL,
      y: ((e.clientY - rect.top) / rect.height) * LOGICAL,
      p: e.pressure > 0 ? e.pressure : 0.5,
      t: Math.max(0, Math.round(performance.now() - t0Ref.current)),
    };
  };

  const finishStroke = () => {
    const cur = currentRef.current;
    if (cur && cur.points.length > 0) {
      strokesRef.current.push(cur);
      setStrokeCount(strokesRef.current.length);
    }
    currentRef.current = null;
    prevMidRef.current = null;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const pt = toPoint(e);
    currentRef.current = { points: [pt], size: BRUSHES[brushIdx] };
    prevMidRef.current = { x: pt.x, y: pt.y };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const cur = currentRef.current;
    if (!cur) return;
    // coalesced events give smoother curves on fast stylus strokes
    const events = e.nativeEvent.getCoalescedEvents?.() ?? [e.nativeEvent];
    const ctx = getCtx();
    for (const ev of events) {
      const pt = toPoint({
        ...e,
        clientX: ev.clientX,
        clientY: ev.clientY,
        pressure: ev.pressure,
      } as React.PointerEvent<HTMLCanvasElement>);
      const last = cur.points[cur.points.length - 1];
      if (Math.hypot(pt.x - last.x, pt.y - last.y) < 0.8) continue;
      cur.points.push(pt);
      if (ctx) drawSegment(ctx, last, pt, cur.size);
    }
  };

  const undoStroke = () => {
    strokesRef.current.pop();
    setStrokeCount(strokesRef.current.length);
    redrawAll();
  };

  // --- check & grade ---
  const check = async () => {
    if (strokeCount === 0 || checking) return;
    setChecking(true);
    setCandidates(null);
    setRecoError(null);
    const ink = strokesRef.current.map((s) => ({
      x: s.points.map((p) => p.x),
      y: s.points.map((p) => p.y),
      t: s.points.map((p) => p.t),
    }));
    const res = await recognizeInk(ink);
    if (res.ok) {
      setCandidates((res.candidates as string[]) ?? []);
    } else {
      setRecoError(res.error ?? 'Auto-check unavailable');
    }
    setChecking(false);
  };

  const mark = async (correct: boolean) => {
    if (!item || saving) return;
    setSaving(true);
    await logWritingPractice(item.glyph, correct);
    setSaving(false);
    goNext();
  };

  if (!item) {
    return (
      <div className="card p-8 text-center text-ink-soft">
        Nothing to practice yet — complete a lesson first.
      </div>
    );
  }

  const glyphLen = [...item.glyph].length;
  const ghostSize = Math.min(170, Math.round(300 / Math.max(1.4, glyphLen * 0.9)));
  const recognized = candidates !== null && candidates.includes(item.glyph);
  const hasStrokes = hasStrokeData(item.glyph);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
      {/* --- pad --- */}
      <div className="card overflow-hidden p-4">
        <div className="relative aspect-square w-full select-none overflow-hidden rounded-xl border border-line bg-white">
          {/* genkouyoushi-style grid */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 300 300"
            aria-hidden
          >
            <line x1="150" y1="6" x2="150" y2="294" stroke="#e4dccb" strokeDasharray="5 6" />
            <line x1="6" y1="150" x2="294" y2="150" stroke="#e4dccb" strokeDasharray="5 6" />
          </svg>
          {/* ghost guide character */}
          {showGuide && (
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 300 300"
              aria-hidden
            >
              <text
                x="150"
                y="150"
                dy="0.36em"
                textAnchor="middle"
                fontSize={ghostSize}
                fill="rgba(36,26,18,0.10)"
                fontFamily={JP_FONT}
              >
                {item.glyph}
              </text>
            </svg>
          )}
          {/* stroke-order guide */}
          {showStrokes && hasStrokes && <StrokeGuide key={strokeReplay} glyph={item.glyph} />}
          {/* ink layer */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
            style={{ touchAction: 'none' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={finishStroke}
            onPointerCancel={finishStroke}
            onLostPointerCapture={finishStroke}
            onContextMenu={(e) => e.preventDefault()}
            aria-label={`Writing pad for ${item.glyph}`}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-0.5 rounded-xl border border-line bg-white px-1 py-1">
            {BRUSHES.map((size, i) => (
              <button
                key={size}
                type="button"
                onClick={() => setBrushIdx(i)}
                aria-label={`Brush size ${size}`}
                aria-pressed={i === brushIdx}
                title={`Brush ${i + 1}`}
                className={`flex h-7 w-7 items-center justify-center rounded-md transition ${
                  i === brushIdx
                    ? 'bg-vermilion/15 text-vermilion'
                    : 'text-ink-soft hover:bg-cream hover:text-ink'
                }`}
              >
                <span
                  className="block rounded-full bg-current"
                  style={{ width: BRUSH_DOTS[i], height: BRUSH_DOTS[i] }}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={undoStroke}
            disabled={strokeCount === 0}
            className="btn-ghost disabled:opacity-40"
          >
            Undo stroke
          </button>
          <button
            type="button"
            onClick={clearBoard}
            disabled={strokeCount === 0}
            className="btn-ghost disabled:opacity-40"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => setShowGuide((g) => !g)}
            className="btn-ghost"
            aria-pressed={showGuide}
          >
            Guide: {showGuide ? 'on' : 'off'}
          </button>
          {hasStrokes && (
            <>
              <button
                type="button"
                onClick={() => setShowStrokes((s) => !s)}
                className="btn-ghost"
                aria-pressed={showStrokes}
              >
                Strokes: {showStrokes ? 'on' : 'off'}
              </button>
              {showStrokes && (
                <button
                  type="button"
                  onClick={() => setStrokeReplay((n) => n + 1)}
                  className="btn-ghost"
                >
                  Replay
                </button>
              )}
            </>
          )}
          <div className="ml-auto">
            <SpeakButton text={item.glyph} iconOnly />
          </div>
        </div>
      </div>

      {/* --- controls --- */}
      <div className="space-y-5">
        {/* target */}
        <div className="card flex items-center gap-5 p-5">
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-cream text-5xl font-bold"
            style={{ fontFamily: JP_FONT }}
          >
            {item.glyph}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-wider text-ink-soft">
              {item.romaji}
            </p>
            {item.meaning && (
              <p className="mt-0.5 text-sm text-ink-soft">{item.meaning}</p>
            )}
            {item.practiceCount > 0 && (
              <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-gold">
                <IconStar width={12} height={12} />
                Practiced {item.practiceCount}×
              </p>
            )}
          </div>
        </div>

        {/* result / actions */}
        <div className="card space-y-3 p-5">
          {candidates !== null && (
            <div>
              <p
                className={`text-sm font-bold ${recognized ? 'text-vermilion' : 'text-ink-soft'}`}
              >
                {recognized
                  ? `Recognized as ${item.glyph} — nice writing!`
                  : 'Auto-check did not recognize it — compare with the guide:'}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {candidates.slice(0, 6).map((c) => (
                  <span
                    key={c}
                    className={`rounded-lg border px-2.5 py-1 text-lg font-semibold ${
                      c === item.glyph
                        ? 'border-vermilion bg-vermilion/10 text-vermilion'
                        : 'border-line bg-cream text-ink-soft'
                    }`}
                    style={{ fontFamily: JP_FONT }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
          {recoError && (
            <p className="text-sm font-semibold text-ink-soft">
              Auto-check unavailable ({recoError}) — compare with the guide and mark yourself.
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={check}
              disabled={strokeCount === 0 || checking}
              className="btn-primary px-4 py-2.5 disabled:opacity-40"
            >
              {checking ? 'Checking…' : 'Check my writing'}
            </button>
            <button
              type="button"
              onClick={() => mark(true)}
              disabled={saving}
              className="btn-ghost"
            >
              <IconCheck width={16} height={16} />
              I got it right
            </button>
            <button
              type="button"
              onClick={() => mark(false)}
              disabled={saving}
              className="btn-ghost"
            >
              <IconRefresh width={16} height={16} />
              Needs practice
            </button>
            <button type="button" onClick={goNext} className="btn-ghost ml-auto">
              Next
              <IconArrowRight width={16} height={16} />
            </button>
          </div>
          <p className="text-xs text-ink-soft">
            Correct marks earn +1 XP. Stroke order matters — write left→right, top→bottom.
          </p>
        </div>

        {/* picker */}
        <div className="card p-5">
          <div className="mb-3 flex gap-1 rounded-xl bg-cream p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => selectTab(t.id)}
                className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-bold transition ${
                  tab === t.id ? 'bg-white text-ink shadow-sm' : 'text-ink-soft hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="grid max-h-56 grid-cols-6 gap-1.5 overflow-y-auto pr-1 sm:grid-cols-8">
            {items.map((it, i) => {
              const active = i === idx;
              return (
                <button
                  key={`${tab}-${it.glyph}-${i}`}
                  type="button"
                  onClick={() => selectItem(i)}
                  className={`relative flex aspect-square items-center justify-center rounded-lg border text-lg font-semibold transition ${
                    active
                      ? 'border-vermilion bg-vermilion/10 text-vermilion'
                      : 'border-line bg-white text-ink hover:border-vermilion/50'
                  }`}
                  style={{ fontFamily: JP_FONT }}
                  title={`${it.glyph} — ${it.romaji}`}
                >
                  {it.glyph}
                  {it.practiceCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-extrabold text-white">
                      {it.practiceCount > 9 ? '9+' : it.practiceCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {items.length === 0 && (
            <p className="text-sm text-ink-soft">
              Nothing here yet — finish more lessons to grow this list.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
