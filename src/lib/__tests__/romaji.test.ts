import { describe, expect, it } from 'vitest';
import { canonRomaji, checkRomajiAnswer } from '../quiz';

describe('canonRomaji', () => {
  it('lowercases and strips whitespace/punctuation', () => {
    expect(canonRomaji('Arigatou Gozaimasu!')).toBe('arigatogozaimasu');
    expect(canonRomaji('  ohayou  ')).toBe('ohayo');
    expect(canonRomaji('onegaishimasu.')).toBe('onegaishimasu');
  });

  it('collapses long vowels (ou, uu, aa, ii, ee, oo)', () => {
    expect(canonRomaji('arigatou')).toBe('arigato');
    expect(canonRomaji('yuubokumin')).toBe('yubokumin');
    expect(canonRomaji('okaa-san')).toBe('okasan');
  });

  it('strips diacritics from macrons', () => {
    expect(canonRomaji('ōsaka')).toBe('osaka');
    expect(canonRomaji('Tōkyō')).toBe('tokyo');
  });
});

describe('checkRomajiAnswer', () => {
  it('accepts the canonical answer', () => {
    expect(checkRomajiAnswer('arigatou', ['arigatou'])).toBe(true);
  });

  it('accepts listed variants', () => {
    expect(checkRomajiAnswer('si', ['shi', 'si'])).toBe(true);
    expect(checkRomajiAnswer('shi', ['shi', 'si'])).toBe(true);
  });

  it('accepts ou→o equivalence', () => {
    expect(checkRomajiAnswer('arigato', ['arigatou'])).toBe(true);
  });

  it('rejects wrong answers', () => {
    expect(checkRomajiAnswer('konnichiwa', ['arigatou'])).toBe(false);
    expect(checkRomajiAnswer('', ['arigatou'])).toBe(false);
  });
});
