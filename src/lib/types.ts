export interface Example {
  kana: string;
  romaji: string;
  meaning: string;
}

export interface VocabItem {
  id: string;
  kana: string;
  romaji: string;
  meaning: string;
  tag?: string;
  note?: string;
  /** accepted romaji variants for typing questions */
  alt?: string[];
  /** skip romaji typing question (e.g. pattern items) */
  noType?: boolean;
  /** skip this item in quiz generation entirely */
  noQuiz?: boolean;
  example?: Example;
}

export interface CultureNote {
  title: string;
  body: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  focus: 'script' | 'vocab';
  vocab: VocabItem[];
  culture: CultureNote[];
}

export type LessonDraft = Omit<Lesson, 'unitId' | 'order'>;

export interface Unit {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  lessons: Lesson[];
}

export interface UnitDraft extends Omit<Unit, 'lessons'> {
  lessons: LessonDraft[];
}
