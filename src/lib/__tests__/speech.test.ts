import { describe, expect, it } from 'vitest';
import { normKana, romajiToKana, scoreSpeech } from '../speech';

describe('normKana', () => {
  it('converts katakana to hiragana', () => {
    expect(normKana('サカナ')).toBe('さかな');
  });
  it('strips spaces and punctuation', () => {
    expect(normKana('すみません！')).toBe('すみません');
    expect(normKana('ありがとう ございます')).toBe('ありがとうございます');
  });
  it('keeps kanji', () => {
    expect(normKana('魚')).toBe('魚');
  });
});

describe('romajiToKana', () => {
  it('converts basic syllables', () => {
    expect(romajiToKana('sakana')).toBe('さかな');
    expect(romajiToKana('arigatou')).toBe('ありがとう');
  });
  it('handles n before consonants and word end', () => {
    // strict romaji→kana: 'wa' → わ (kana candidates cover the は spelling)
    expect(romajiToKana('konnichiwa')).toBe('こんにちわ');
    expect(romajiToKana('en')).toBe('えん');
  });
  it('handles doubled consonants', () => {
    expect(romajiToKana('kippu')).toBe('きっぷ');
    expect(romajiToKana('matte')).toBe('まって');
  });
  it('handles yōon digraphs', () => {
    expect(romajiToKana('kya')).toBe('きゃ');
    expect(romajiToKana('shinkansen')).toBe('しんかんせん');
  });
});

describe('scoreSpeech', () => {
  const item = { kana: 'さかな', romaji: 'sakana' };

  it('exact match on kana transcript', () => {
    expect(scoreSpeech('さかな', item).verdict).toBe('exact');
  });
  it('kanji transcript for a kana-only item misses (no reading dictionary)', () => {
    // The UI shows "heard: 魚" so the user can self-verify — designed fallback.
    const r = scoreSpeech('魚', item);
    expect(r.verdict).toBe('miss');
    expect(r.heard).toBe('魚');
  });
  it('kanji items match when ASR returns the same kanji', () => {
    const kanjiItem = { kana: '魚', romaji: 'sakana' };
    expect(scoreSpeech('魚', kanjiItem).verdict).toBe('exact');
  });
  it('katakana transcript matches hiragana target', () => {
    expect(scoreSpeech('サカナ', item).verdict).toBe('exact');
  });
  it('transcript with punctuation still matches', () => {
    expect(scoreSpeech('さかなです', item).verdict).toBe('close');
  });
  it('miss on unrelated transcript', () => {
    expect(scoreSpeech('わんわん', item).verdict).toBe('miss');
  });
  it('matches against alt romaji forms', () => {
    const withAlt = { kana: 'おはよう', romaji: 'ohayou', alt: ['ohayo'] };
    expect(scoreSpeech('おはよ', withAlt).verdict).toBe('exact');
  });
});
