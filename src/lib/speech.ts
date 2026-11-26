// Client-side Japanese speech recognition (Web Speech API).
// Chrome/Edge ship webkitSpeechRecognition with ja-JP; Safari/Firefox don't,
// so callers must feature-detect with speechRecognitionSupported().

import { UNITS } from './content';

export interface SpeechResult {
  transcript: string;
  confidence: number;
}

export type SpeechError =
  | 'unsupported'
  | 'denied'
  | 'no-speech'
  | 'network'
  | 'aborted'
  | 'error';

interface SRAlternative {
  transcript: string;
  confidence: number;
}
interface SRResult {
  isFinal: boolean;
  length: number;
  [index: number]: SRAlternative;
}
interface SRResultList {
  length: number;
  [index: number]: SRResult;
}
interface SREvent {
  results: SRResultList;
}
interface SRErrorEvent {
  error: string;
}
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((e: SREvent) => void) | null;
  onerror: ((e: SRErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
type SRCtor = new () => SpeechRecognitionLike;

function getCtor(): SRCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as Record<string, unknown>;
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null) as SRCtor | null;
}

export function speechRecognitionSupported(): boolean {
  return getCtor() !== null;
}

/** Listen for one Japanese utterance; resolves on final result, rejects on error/timeout. */
export function listenJapanese(timeoutMs = 8000): Promise<SpeechResult> {
  return new Promise((resolve, reject) => {
    const Ctor = getCtor();
    if (!Ctor) {
      reject('unsupported' as SpeechError);
      return;
    }
    const rec = new Ctor();
    rec.lang = 'ja-JP';
    rec.interimResults = false;
    rec.maxAlternatives = 3;
    rec.continuous = false;

    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        rec.abort();
        reject('no-speech' as SpeechError);
      }
    }, timeoutMs);

    const finish = (fn: () => void) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      fn();
    };

    rec.onresult = (e) => {
      // Take the highest-confidence alternative across final results.
      let best: SRAlternative | null = null;
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        if (!r.isFinal) continue;
        for (let j = 0; j < r.length; j++) {
          const alt = r[j];
          if (!best || alt.confidence > best.confidence) best = alt;
        }
      }
      if (best) {
        finish(() => {
          rec.stop();
          resolve({ transcript: best!.transcript, confidence: best!.confidence });
        });
      }
    };
    rec.onerror = (e) => {
      finish(() => {
        const map: Record<string, SpeechError> = {
          'not-allowed': 'denied',
          'service-not-allowed': 'denied',
          'no-speech': 'no-speech',
          network: 'network',
          aborted: 'aborted',
        };
        reject(map[e.error] ?? 'error');
      });
    };
    rec.onend = () => {
      // Ended without a final result.
      finish(() => reject('no-speech' as SpeechError));
    };

    try {
      rec.start();
    } catch {
      finish(() => reject('error' as SpeechError));
    }
  });
}

// ---------- matching ----------

const KANA_OFFSET = 0x60; // カ → か

/** Katakana → hiragana, NFKC, strip spaces/punct/diacritics-row. */
export function normKana(s: string): string {
  return s
    .normalize('NFKC')
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - KANA_OFFSET))
    .replace(/[ぁ-んゔゕゖー]/g, (c) => c) // keep kana + chōonpu
    .replace(/[^\u3041-\u3096\u30fc\u4e00-\u9fff]/g, '');
}

const ROMAJI_TABLE: Array<[string, string]> = ([
  // longest-first ordering is enforced below by sorting
  ['kya', 'きゃ'], ['kyu', 'きゅ'], ['kyo', 'きょ'],
  ['sha', 'しゃ'], ['shu', 'しゅ'], ['sho', 'しょ'],
  ['cha', 'ちゃ'], ['chu', 'ちゅ'], ['cho', 'ちょ'],
  ['nya', 'にゃ'], ['nyu', 'にゅ'], ['nyo', 'にょ'],
  ['hya', 'ひゃ'], ['hyu', 'ひゅ'], ['hyo', 'ひょ'],
  ['mya', 'みゃ'], ['myu', 'みゅ'], ['myo', 'みょ'],
  ['rya', 'りゃ'], ['ryu', 'りゅ'], ['ryo', 'りょ'],
  ['gya', 'ぎゃ'], ['gyu', 'ぎゅ'], ['gyo', 'ぎょ'],
  ['ja', 'じゃ'], ['ju', 'じゅ'], ['jo', 'じょ'],
  ['bya', 'びゃ'], ['byu', 'びゅ'], ['byo', 'びょ'],
  ['pya', 'ぴゃ'], ['pyu', 'ぴゅ'], ['pyo', 'ぴょ'],
  ['shi', 'し'], ['chi', 'ち'], ['tsu', 'つ'], ['ji', 'じ'],
  ['ka', 'か'], ['ki', 'き'], ['ku', 'く'], ['ke', 'け'], ['ko', 'こ'],
  ['sa', 'さ'], ['su', 'す'], ['se', 'せ'], ['so', 'そ'],
  ['ta', 'た'], ['te', 'て'], ['to', 'と'],
  ['na', 'な'], ['ni', 'に'], ['nu', 'ぬ'], ['ne', 'ね'], ['no', 'の'],
  ['ha', 'は'], ['hi', 'ひ'], ['fu', 'ふ'], ['he', 'へ'], ['ho', 'ほ'],
  ['ba', 'ば'], ['bi', 'び'], ['bu', 'ぶ'], ['be', 'べ'], ['bo', 'ぼ'],
  ['pa', 'ぱ'], ['pi', 'ぴ'], ['pu', 'ぷ'], ['pe', 'ぺ'], ['po', 'ぽ'],
  ['ma', 'ま'], ['mi', 'み'], ['mu', 'む'], ['me', 'め'], ['mo', 'も'],
  ['ya', 'や'], ['yu', 'ゆ'], ['yo', 'よ'],
  ['ra', 'ら'], ['ri', 'り'], ['ru', 'る'], ['re', 'れ'], ['ro', 'ろ'],
  ['wa', 'わ'], ['wo', 'を'], ['ga', 'が'], ['gi', 'ぎ'], ['gu', 'ぐ'],
  ['ge', 'げ'], ['go', 'ご'], ['za', 'ざ'], ['zu', 'ず'], ['ze', 'ぜ'],
  ['zo', 'ぞ'], ['da', 'だ'], ['de', 'で'], ['do', 'ど'],
  ['a', 'あ'], ['i', 'い'], ['u', 'う'], ['e', 'え'], ['o', 'お'], ['n', 'ん'],
] as Array<[string, string]>).sort((x, y) => y[0].length - x[0].length);

/** Convert romaji to hiragana (greedy longest-match). Doubled consonants → っ. */
export function romajiToKana(romaji: string): string {
  const s = romaji
    .toLowerCase()
    .replace(/[^a-z']/g, '');
  let out = '';
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === "'") {
      i++;
      continue;
    }
    // n before consonant/end → ん
    if (c === 'n' && (i + 1 >= s.length || !'aiueoy'.includes(s[i + 1]))) {
      out += 'ん';
      i++;
      continue;
    }
    // doubled consonant → っ (e.g. kk, tta, sshi → chi handled via match below)
    if (i + 1 < s.length && c === s[i + 1] && !'aiueon'.includes(c)) {
      out += 'っ';
      i++;
      continue;
    }
    let matched = false;
    for (const [r, k] of ROMAJI_TABLE) {
      if (s.startsWith(r, i)) {
        out += k;
        i += r.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      // unknown char — skip silently rather than corrupt the output
      i++;
    }
  }
  return out;
}

function editDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    prev = cur;
  }
  return prev[n];
}

export type SayVerdict = 'exact' | 'close' | 'miss';

export interface SayScore {
  verdict: SayVerdict;
  /** normalized transcript (kana-normalized) for display */
  heard: string;
  /** the candidate form it matched closest to */
  expected: string;
}

// ---------- kanji → reading substitution ----------
// ASR often returns kanji (魚) when the speaker said the reading (さかな).
// Build readings from the curriculum itself: any vocab item whose display
// form contains kanji contributes "kanji form" → reading.

const KANJI_RE = /[\u4e00-\u9fff]/;
const WORD_READINGS: Record<string, string> = {};
for (const u of UNITS) {
  for (const l of u.lessons) {
    for (const it of l.vocab) {
      if (!KANJI_RE.test(it.kana)) continue;
      const reading = romajiToKana(it.romaji);
      if (reading) WORD_READINGS[it.kana] = reading;
    }
  }
}
// Longest keys first so compounds (出口) beat single chars (出) when both exist.
const WORD_KEYS = Object.keys(WORD_READINGS).sort((a, b) => b.length - a.length);

/** Variants of the transcript with kanji replaced by their readings. */
export function kanjiVariants(heard: string): string[] {
  if (!KANJI_RE.test(heard)) return [];
  let v = heard;
  for (const k of WORD_KEYS) {
    if (v.includes(k)) v = v.split(k).join(WORD_READINGS[k]);
  }
  return v === heard ? [] : [v];
}

/**
 * Score a speech transcript against a vocab item.
 * Candidates: the item's kana as-is (covers kanji items where ASR returns the
 * kanji) plus every accepted romaji form converted to kana.
 */
function scoreVariant(
  heard: string,
  candidates: Set<string>,
): { verdict: SayVerdict; expected: string } {
  let bestExpected = '';
  let bestDist = Infinity;
  let matched = false;
  for (const c of candidates) {
    if (heard === c) return { verdict: 'exact', expected: c };
    if (heard && c && (heard.includes(c) || c.includes(heard))) {
      const shorter = Math.min(heard.length, c.length);
      const longer = Math.max(heard.length, c.length);
      if (shorter / longer >= 0.6) matched = true;
    }
    const d = editDistance(heard, c);
    if (d < bestDist) {
      bestDist = d;
      bestExpected = c;
    }
  }
  if (matched) return { verdict: 'close', expected: bestExpected };
  const rel = heard.length ? bestDist / Math.max(heard.length, bestExpected.length, 1) : 1;
  return {
    verdict: rel <= 0.25 && bestDist <= 2 ? 'close' : 'miss',
    expected: bestExpected,
  };
}

export function scoreSpeech(
  transcript: string,
  item: { kana: string; romaji: string; alt?: string[] }
): SayScore {
  const heard = normKana(transcript);
  const candidates = new Set<string>();
  const k = normKana(item.kana);
  if (k) candidates.add(k);
  for (const r of [item.romaji, ...(item.alt ?? [])]) {
    const kk = romajiToKana(r);
    if (kk) candidates.add(kk);
  }

  // Score the raw transcript plus kanji→reading variants; best wins.
  const variants = [heard, ...kanjiVariants(heard)];
  const rank: Record<SayVerdict, number> = { exact: 2, close: 1, miss: 0 };
  let best: SayScore = { verdict: 'miss', heard, expected: item.kana };
  for (const v of variants) {
    const s = scoreVariant(v, candidates);
    if (rank[s.verdict] > rank[best.verdict]) {
      best = { verdict: s.verdict, heard, expected: s.expected };
    }
    if (s.verdict === 'exact') break;
  }
  return best;
}
