import type { Lesson, VocabItem } from './types';

export interface QuizOption {
  id: string;
  label: string;
  correct: boolean;
}

export type QuizType = 'pick-kana' | 'pick-meaning' | 'pick-romaji' | 'type-romaji' | 'listen';

export interface QuizQuestion {
  id: string;
  type: QuizType;
  /** short instruction shown above the prompt */
  promptLabel: string;
  /** large Japanese prompt (for 'listen' questions: the text spoken aloud, not shown) */
  promptKana: string;
  /** romaji shown as the prompt (pick-kana) */
  promptRomaji: string;
  /** extra hint, e.g. the meaning for typing questions */
  promptHint?: string;
  choices?: QuizOption[];
  /** set lang="ja" on the choice buttons */
  choicesInJapanese?: boolean;
  /** canon'd accepted answers for type-romaji */
  accept?: string[];
  /** shown after answering */
  explain?: string;
}

const MAX_QUESTIONS = 12;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Normalize romaji for forgiving comparison: strips macrons, spaces,
 *  punctuation, and collapses long vowels (ou->o, uu->u, etc). */
export function canonRomaji(s: string): string {
  return s
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .replace(/ou/g, 'o')
    .replace(/uu/g, 'u')
    .replace(/aa/g, 'a')
    .replace(/ii/g, 'i')
    .replace(/ee/g, 'e')
    .replace(/oo/g, 'o');
}

export function checkRomajiAnswer(input: string, accept: string[]): boolean {
  const c = canonRomaji(input);
  return accept.some((a) => canonRomaji(a) === c);
}

function explainFor(item: VocabItem): string {
  let s = item.romaji;
  if (item.meaning && item.meaning !== item.romaji) s += ` — ${item.meaning}`;
  if (item.note) s += ` (${item.note})`;
  return s;
}

function pickDistractors(
  pool: VocabItem[],
  correct: VocabItem,
  key: (x: VocabItem) => string,
  n = 3,
): string[] {
  const used = new Set([key(correct)]);
  const out: string[] = [];
  for (const c of shuffle(pool)) {
    const k = key(c);
    if (used.has(k)) continue;
    used.add(k);
    out.push(k);
    if (out.length >= n) break;
  }
  return out;
}

function makeChoices(correctLabel: string, distractors: string[]): QuizOption[] {
  const labels = [correctLabel, ...distractors];
  return shuffle(
    labels.map((label, i) => ({ id: `o${i}`, label, correct: label === correctLabel })),
  );
}

function makePickKana(item: VocabItem, pool: VocabItem[]): QuizQuestion {
  return {
    id: `${item.id}-kana`,
    type: 'pick-kana',
    promptLabel: 'Which characters match?',
    promptKana: '',
    promptRomaji: item.romaji,
    choices: makeChoices(item.kana, pickDistractors(pool, item, (x) => x.kana)),
    choicesInJapanese: true,
    explain: explainFor(item),
  };
}

function makeListenKana(item: VocabItem, pool: VocabItem[]): QuizQuestion {
  return {
    id: `${item.id}-listen`,
    type: 'listen',
    promptLabel: 'Listen — pick the characters you hear',
    promptKana: item.kana,
    promptRomaji: '',
    choices: makeChoices(item.kana, pickDistractors(pool, item, (x) => x.kana)),
    choicesInJapanese: true,
    explain: explainFor(item),
  };
}

function makeListenMeaning(item: VocabItem, pool: VocabItem[]): QuizQuestion {
  return {
    id: `${item.id}-listen`,
    type: 'listen',
    promptLabel: 'Listen — what does it mean?',
    promptKana: item.kana,
    promptRomaji: '',
    choices: makeChoices(item.meaning, pickDistractors(pool, item, (x) => x.meaning)),
    explain: explainFor(item),
  };
}

function makePickRomaji(item: VocabItem, pool: VocabItem[]): QuizQuestion {
  return {
    id: `${item.id}-romaji`,
    type: 'pick-romaji',
    promptLabel: 'How is it read?',
    promptKana: item.kana,
    promptRomaji: '',
    choices: makeChoices(item.romaji, pickDistractors(pool, item, (x) => x.romaji)),
    explain: explainFor(item),
  };
}

function makePickMeaning(item: VocabItem, pool: VocabItem[]): QuizQuestion {
  return {
    id: `${item.id}-meaning`,
    type: 'pick-meaning',
    promptLabel: 'What does it mean?',
    promptKana: item.kana,
    promptRomaji: item.romaji,
    choices: makeChoices(item.meaning, pickDistractors(pool, item, (x) => x.meaning)),
    explain: explainFor(item),
  };
}

function canType(item: VocabItem): boolean {
  if (item.noType) return false;
  const words = item.romaji.trim().split(/\s+/).filter(Boolean);
  return words.length > 0 && words.length <= 3;
}

function makeTypeRomaji(item: VocabItem): QuizQuestion {
  const accept = [
    ...new Set([item.romaji, ...(item.alt ?? [])].map((s) => canonRomaji(s))),
  ].filter(Boolean);
  return {
    id: `${item.id}-type`,
    type: 'type-romaji',
    promptLabel: 'Type the romaji',
    promptKana: item.kana,
    promptRomaji: '',
    promptHint: item.meaning,
    accept,
    explain: explainFor(item),
  };
}

/** Build a quiz for a lesson: guarantees coverage of as many vocab items as
 *  possible (one question each), then fills remaining slots with second
 *  question types. Capped at MAX_QUESTIONS. */
export function buildQuiz(lesson: Lesson, max = MAX_QUESTIONS): QuizQuestion[] {
  const pool = lesson.vocab.filter((i) => !i.noQuiz);
  const isScript = lesson.focus === 'script';
  const byItem = pool.map((item, idx) => {
    const qs: QuizQuestion[] = [];
    if (isScript) {
      qs.push(makePickKana(item, pool), makePickRomaji(item, pool));
    } else {
      qs.push(makePickMeaning(item, pool));
      if (canType(item)) qs.push(makeTypeRomaji(item));
      if (idx % 3 === 0) qs.push(makePickKana(item, pool));
    }
    return { qs };
  });

  const order = shuffle(byItem);
  const chosen: QuizQuestion[] = [];
  const used = new Set<QuizQuestion>();

  // vocab lessons reserve ~3 slots for typing / kana-recall questions so big
  // lessons don't become pure meaning quizzes; script lessons alternate
  // pick-kana / pick-romaji instead. A couple of slots always go to
  // listening questions — ear training matters as much as reading.
  const listenTarget = Math.min(2, Math.max(1, Math.floor(pool.length / 6)));
  const primarySlots = (!isScript && byItem.length >= 9 ? max - 3 : max) - listenTarget;

  // pass 1: primary questions, one per item, in random order
  let i = 0;
  for (const { qs } of order) {
    if (chosen.length >= primarySlots) break;
    const unused = qs.filter((x) => !used.has(x));
    let q: QuizQuestion | undefined;
    if (isScript) {
      const preferKana = i % 2 === 0;
      q = preferKana
        ? (unused.find((x) => x.type === 'pick-kana') ??
          unused.find((x) => x.type === 'pick-romaji'))
        : (unused.find((x) => x.type === 'pick-romaji') ??
          unused.find((x) => x.type === 'pick-kana'));
    } else {
      q = unused.find((x) => x.type === 'pick-meaning');
    }
    if (!q) continue;
    used.add(q);
    chosen.push(q);
    i++;
  }

  // pass 2: guaranteed listening questions — script lessons pick the kana
  // they hear, vocab lessons pick the meaning.
  for (const item of shuffle(pool).slice(0, listenTarget)) {
    const q = isScript ? makeListenKana(item, pool) : makeListenMeaning(item, pool);
    used.add(q);
    chosen.push(q);
  }

  // pass 3: fill remaining slots — alternate question types first, then
  // extra meaning questions for items not yet covered
  if (chosen.length < max) {
    const restAll = order.flatMap(({ qs }) => qs.filter((q) => !used.has(q)));
    const alt = shuffle(restAll.filter((q) => q.type !== 'pick-meaning'));
    const rest = shuffle(restAll.filter((q) => q.type === 'pick-meaning'));
    for (const q of [...alt, ...rest]) {
      if (chosen.length >= max) break;
      used.add(q);
      chosen.push(q);
    }
  }

  return shuffle(chosen);
}
