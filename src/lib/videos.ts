/** Curated YouTube videos, verified embeddable, mapped to curriculum units. */

export interface VideoItem {
  /** YouTube video id */
  id: string;
  title: string;
  channel: string;
  unitId: string;
  /** Show on this lesson's intro screen */
  lessonId?: string;
  /** One-line "why this helps" note */
  blurb: string;
  /** Bucket on the /watch page */
  section: 'scripts' | 'phrases' | 'survival';
}

export const VIDEOS: VideoItem[] = [
  // ---------- scripts ----------
  {
    id: '6p9Il_j0zjc',
    title: 'Learn ALL Hiragana in 1 Hour',
    channel: 'JapanesePod101',
    unitId: 'u1',
    lessonId: 'u1-l1',
    section: 'scripts',
    blurb: 'Every hiragana with stroke order and mnemonics — pairs perfectly with the writing pad.',
  },
  {
    id: '_wZHqOghvSs',
    title: 'Learn ALL Kana: Hiragana + Katakana',
    channel: 'JapanesePod101',
    unitId: 'u1',
    lessonId: 'u1-l5',
    section: 'scripts',
    blurb: 'The full katakana chart with stroke order — watch the katakana half.',
  },
  {
    id: 'o9UDQnS9kZk',
    title: 'All 4 Basic Japanese Greetings',
    channel: 'Coto Japanese Academy',
    unitId: 'u2',
    lessonId: 'u2-l1',
    section: 'phrases',
    blurb: 'Ohayou / konnichiwa / konbanwa / oyasumi — when each one is actually used.',
  },
  {
    id: 'FgCPc5qPCh0',
    title: 'Japanese for Absolute Beginners: Master the Basics',
    channel: 'Big Bong',
    unitId: 'u2',
    lessonId: 'u2-l2',
    section: 'phrases',
    blurb: 'Greetings, the は→"wa" trap, and self-introduction — an hour that covers Unit 2.',
  },
  {
    id: 'rGrBHiuPlT0',
    title: 'Introduction — Japanese Lesson 1',
    channel: 'Japan Society',
    unitId: 'u2',
    lessonId: 'u2-l3',
    section: 'phrases',
    blurb: 'Hajimemashite douzo yoroshiku — the self-introduction you will actually use.',
  },

  // ---------- phrases by situation ----------
  {
    id: 'oxu2-N4ebJM',
    title: 'Numbers in Japanese 0–100',
    channel: "Mei's Japanese Lab",
    unitId: 'u3',
    lessonId: 'u3-l1',
    section: 'phrases',
    blurb: 'Counting with correct pronunciation — including the 4/7/9 alternate readings.',
  },
  {
    id: 'Iawf9jVWNuY',
    title: 'How To Count MONEY (yen)',
    channel: 'Ninjapanese',
    unitId: 'u3',
    lessonId: 'u3-l2',
    section: 'phrases',
    blurb: 'Every coin and bill, counted up to 1,000,000 yen — essential for shopping.',
  },
  {
    id: 'GPaAVGmjbkE',
    title: 'いくらですか — How much is it?',
    channel: 'Nami Ohara',
    unitId: 'u3',
    lessonId: 'u3-l2',
    section: 'phrases',
    blurb: 'Listening drill: hear real prices and understand the numbers flying back at you.',
  },
  {
    id: 'vd6mwUSiS40',
    title: 'Ordering in Japanese — Watch Before a Restaurant',
    channel: 'Daily Japanese with Naoko',
    unitId: 'u4',
    lessonId: 'u4-l1',
    section: 'phrases',
    blurb: 'The 5 phrases that handle any restaurant, plus the 3 questions staff always ask.',
  },
  {
    id: 'FfapyKQUo4o',
    title: 'Slow & Easy Conversations: At the Restaurant',
    channel: 'Everyday Japanese Academy',
    unitId: 'u4',
    lessonId: 'u4-l3',
    section: 'phrases',
    blurb: 'A full ordering conversation, slow enough to follow and shadow.',
  },
  {
    id: 'Up9EHTKWoNQ',
    title: 'How to Order, Eat & Pay for Sushi (Conveyor Belt)',
    channel: 'Slow Easy English',
    unitId: 'u4',
    section: 'phrases',
    blurb: 'Conveyor-belt sushi etiquette end-to-end — a very fun cultural walkthrough.',
  },
  {
    id: 'I-dEYNMAuxE',
    title: 'Useful Japanese Phrases ~in a Train Station~',
    channel: 'Japanese Language & Culture',
    unitId: 'u5',
    lessonId: 'u5-l1',
    section: 'phrases',
    blurb: 'Tickets, IC cards, platforms and asking for help at the station.',
  },
  {
    id: '3W53B6Svyhk',
    title: 'Japanese Train Station Reading Comprehension',
    channel: 'JapanesePod101',
    unitId: 'u5',
    lessonId: 'u5-l3',
    section: 'phrases',
    blurb: 'Read real ticket machines, schedules and platform displays — a mini quiz.',
  },

  // ---------- survival ----------
  {
    id: 'WJq7SnS2OLw',
    title: '100 MUST-KNOW Phrases When Traveling to Japan',
    channel: 'Ninjapanese',
    unitId: 'u6',
    lessonId: 'u6-l1',
    section: 'survival',
    blurb: 'The complete phrase checklist for your trip — review it before you fly.',
  },
  {
    id: '66P5_R37vek',
    title: '100 Phrases Every Japanese Beginner Must-Know',
    channel: 'JapanesePod101',
    unitId: 'u6',
    section: 'survival',
    blurb: 'Risa’s greatest hits — greetings, directions, shopping, emergencies.',
  },
];

export function videosForUnit(unitId: string): VideoItem[] {
  return VIDEOS.filter((v) => v.unitId === unitId);
}

export function videosForLesson(lessonId: string): VideoItem[] {
  return VIDEOS.filter((v) => v.lessonId === lessonId);
}
