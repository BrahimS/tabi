// Client-safe trip mode definitions (no db imports — safe to bundle).

export type TripScenario = 'restaurant' | 'station' | 'hotel' | 'kana' | 'everything';

export interface TripItem {
  key: string;
  kana: string;
  romaji: string;
  meaning: string;
  /** already in the user's review deck */
  learned: boolean;
}

export const TRIP_SCENARIOS: {
  id: TripScenario;
  title: string;
  blurb: string;
  unitIds: string[] | null; // null = all units
}[] = [
  { id: 'restaurant', title: 'Restaurant & food', blurb: 'Ordering, the bill, allergies', unitIds: ['u4'] },
  { id: 'station', title: 'Trains & stations', blurb: 'Tickets, directions, platforms', unitIds: ['u5'] },
  { id: 'hotel', title: 'Hotel & shopping', blurb: 'Check-in, sizes, problems', unitIds: ['u6'] },
  { id: 'kana', title: 'Kana blitz', blurb: 'Read hiragana & katakana fast', unitIds: ['u1'] },
  { id: 'everything', title: 'Everything', blurb: 'Full-trip mixed drill', unitIds: null },
];
