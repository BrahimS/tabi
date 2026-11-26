// Regenerate src/lib/strokes.ts from KanjiVG (CC BY-SA 4.0).
// Usage: node scripts/fetch-strokes.mjs
import { writeFileSync } from 'node:fs';

const KANJIVG = 'https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji';

// Every kana + kanji we ship stroke data for. Kanji list = unique chars across the curriculum.
const KANA =
  'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん' +
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const KANJI =
  '二駅出口入改札本日休業営中無料有禁煙立止危険注意非常肉魚牛豚鶏米水酒茶店食堂銀行薬局東西南北左右上下大小前後外新円';

const hex = (ch) => ch.codePointAt(0).toString(16).padStart(5, '0');

async function fetchGlyph(ch) {
  const res = await fetch(`${KANJIVG}/${hex(ch)}.svg`);
  if (!res.ok) throw new Error(`${ch} (${hex(ch)}): HTTP ${res.status}`);
  const svg = await res.text();
  // Stroke centerlines live in <path d="..."> inside the strokes group; take them in order.
  const paths = [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]);
  if (!paths.length) throw new Error(`${ch}: no paths`);
  return paths.map((d) => {
    const m = d.match(/M(-?[\d.]+)[,\s](-?[\d.]+)/);
    return { d, x: +m[1], y: +m[2] };
  });
}

const out = {};
for (const ch of [...KANA, ...KANJI]) {
  out[ch] = await fetchGlyph(ch);
}

const body = JSON.stringify(out);
writeFileSync(
  'src/lib/strokes.ts',
  `// Generated from KanjiVG (CC BY-SA 4.0) — stroke centerlines on a 109x109 canvas.
// Regenerate: node scripts/fetch-strokes.mjs
export interface StrokePath { d: string; x: number; y: number }
export const STROKE_PATHS: Record<string, StrokePath[]> = ${body};
`,
);
console.log(`Wrote ${Object.keys(out).length} glyphs`);
