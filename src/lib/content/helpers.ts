import type { VocabItem } from '../types';

export function v(
  id: string,
  kana: string,
  romaji: string,
  meaning: string,
  extra: Partial<VocabItem> = {},
): VocabItem {
  return { id, kana, romaji, meaning, ...extra };
}
