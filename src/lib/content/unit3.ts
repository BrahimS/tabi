import type { UnitDraft } from '../types';
import { v } from './helpers';

export const unit3: UnitDraft = {
  id: 'u3',
  order: 3,
  title: 'Numbers & Money',
  subtitle: 'Counting, prices & paying',
  description:
    'Numbers are the second thing you will need most in Japan — prices, train fares, ages, times. Learn the tricky sound changes before you ever see a register.',
  lessons: [
    {
      id: 'u3-l1',
      title: 'Counting — numbers & counters',
      subtitle: 'One to ten thousand, plus counters',
      description:
        'Japanese counts with special "counter" words for different object types — like saying "two sheets of paper" instead of "two papers". Master the numbers and the most useful counters.',
      focus: 'vocab',
      vocab: [
        v('ichi', 'いち', 'ichi', '1'),
        v('ni', 'に', 'ni', '2', { note: 'Same sound as the particle に — context tells them apart' }),
        v('san', 'さん', 'san', '3'),
        v('shi', 'し', 'shi', '4 — also read "yon"', {
          alt: ['yon', 'shi'],
          note: '"Shi" sounds like death (死) — people prefer "yon"',
        }),
        v('go', 'ご', 'go', '5'),
        v('roku', 'ろく', 'roku', '6', {
          note: 'In prices becomes "roku" — 600 = roppyaku',
        }),
        v('shichi', 'しち', 'shichi', '7 — also read "nana"', {
          alt: ['nana', 'shichi'],
        }),
        v('hachi', 'はち', 'hachi', '8'),
        v('kyuu', 'きゅう', 'kyuu', '9 — also read "ku"', {
          alt: ['ku', 'kyuu', 'q'],
        }),
        v('juu', 'じゅう', 'juu', '10'),
        v('hyaku', 'ひゃく', 'hyaku', '100', {
          note: '300 = sanbyaku, 600 = roppyaku, 800 = happyaku — sounds change!',
        }),
        v('sen', 'せん', 'sen', '1,000', {
          note: '3000 = sanzen, 8000 = hassen',
        }),
        v('man', 'まん', 'man', '10,000', {
          note: 'Japanese has no millions/thousands grouping — ¥1,000,000 = hyaku man en',
        }),
        v('ko', '〜こ', 'ko', 'counter for small things', {
          tag: 'counter',
          example: { kana: 'りんごをみっつください。', romaji: 'ringo o mittsu kudasai.', meaning: 'Three apples, please.' },
        }),
        v('mai', '〜まい', 'mai', 'counter for flat things (tickets, paper)', {
          tag: 'counter',
          example: { kana: 'きっぷをさんまいください。', romaji: 'kippu o sanmai kudasai.', meaning: 'Three tickets, please.' },
        }),
        v('hon', '〜ほん', 'hon', 'counter for long things (bottles, umbrellas)', {
          tag: 'counter',
          note: 'Sound changes: ippou, sanbon, roppon, happon',
          example: { kana: 'ビールをさんぼんください。', romaji: 'biiru o sanbon kudasai.', meaning: 'Three beers, please.' },
        }),
        v('nin', '〜にん', 'nin', 'counter for people', {
          tag: 'counter',
          example: { kana: 'さんにんです。', romaji: 'sannin desu.', meaning: 'It’s three people.' },
        }),
        v('hai', '〜はい', 'hai', 'counter for cups / drinks', {
          tag: 'counter',
          example: { kana: 'コーヒーをふたつください。', romaji: 'koohii o futatsu kudasai.', meaning: 'Two coffees, please.' },
        }),
        v('dai', '〜だい', 'dai', 'counter for machines / vehicles', {
          tag: 'counter',
          example: { kana: 'タクシーをいちだいよんでください。', romaji: 'takushii o ichidai yonde kudasai.', meaning: 'Please call one taxi.' },
        }),
        v('satsu', '〜さつ', 'satsu', 'counter for books / magazines', {
          tag: 'counter',
          example: { kana: 'ほんをにさつかいました。', romaji: 'hon o nisatsu kaimashita.', meaning: 'I bought two books.' },
        }),
      ],
      culture: [
        {
          title: 'Counters are everywhere',
          body: 'You cannot just say "three" in Japanese — you need the right counter: 三人 (3 people), 三枚 (3 tickets), 三本 (3 bottles). Using the wrong counter is like saying "three sheets of people" — instantly noticeable.',
        },
        {
          title: 'Sound changes at the register',
          body: 'Prices trigger euphonic changes: 300 = sanbyaku (not sanhyaku), 600 = roppyaku, 800 = happyaku, 1000 = sen, 3000 = sanzen. Listen carefully — the register will say these fast.',
        },
      ],
    },
    {
      id: 'u3-l2',
      title: 'Money — prices & paying',
      subtitle: 'Yen, tax & the checkout counter',
      description:
        'How to ask prices, understand tax, and pay — the exact phrases you will use at every konbini, restaurant and souvenir shop in Japan.',
      focus: 'vocab',
      vocab: [
        v('en', 'えん', 'en', 'yen (¥)', {
          tag: 'money',
          note: 'Also means "circle" — context decides',
          example: { kana: 'これは100えんです。', romaji: 'kore wa hyaku en desu.', meaning: 'This is ¥100.' },
        }),
        v('ikura', 'いくら', 'ikura', 'how much?', {
          tag: 'phrase',
          example: { kana: 'これはいくらですか。', romaji: 'kore wa ikura desu ka.', meaning: 'How much is this?' },
        }),
        v('takai', 'たかい', 'takai', 'expensive', {
          tag: 'adjective',
          example: { kana: 'このシャツはたかいですね。', romaji: 'kono shatsu wa takai desu ne.', meaning: 'This shirt is expensive, isn’t it?' },
        }),
        v('yasui', 'やすい', 'yasui', 'cheap', {
          tag: 'adjective',
          example: { kana: 'このパンはやすいです。', romaji: 'kono pan wa yasui desu.', meaning: 'This bread is cheap.' },
        }),
        v('muryou', 'むりょう', 'muryou', 'free (of charge)', {
          tag: 'word',
          example: { kana: 'このサービスはむりょうです。', romaji: 'kono sa-bisu wa muryou desu.', meaning: 'This service is free.' },
        }),
        v('kane', 'おかね', 'okane', 'money', {
          tag: 'noun',
          example: { kana: 'おかねをはらいます。', romaji: 'okane o haraimasu.', meaning: 'I pay with money.' },
        }),
        v('otsuri', 'おつり', 'otsuri', 'change (money back)', {
          tag: 'noun',
          example: { kana: 'おつりをください。', romaji: 'otsuri o kudasai.', meaning: 'Give me my change, please.' },
        }),
        v('genkin', 'げんきん', 'genkin', 'cash', {
          tag: 'noun',
          example: { kana: 'げんきんではらえますか。', romaji: 'genkin de haraemasu ka.', meaning: 'Can I pay cash?' },
        }),
        v('kaado', 'カード', 'kaado', 'card (credit/debit)', {
          tag: 'money',
          example: { kana: 'カードではらえますか。', romaji: 'kaado de haraemasu ka.', meaning: 'Can I pay by card?' },
        }),
        v('waribiki', 'わりびき', 'waribiki', 'discount', {
          tag: 'word',
          example: { kana: 'わりびきはありますか。', romaji: 'waribiki wa arimasu ka.', meaning: 'Is there a discount?' },
        }),
        v('zeikomi', 'ぜいこみ', 'zeikomi', 'tax included', {
          tag: 'word',
          note: 'Food often has 8% tax vs 10% on other goods — zeikomi means final price',
          example: { kana: 'ぜいこみですか。', romaji: 'zeikomi desu ka.', meaning: 'Is tax included?' },
        }),
        v('zeibetsu', 'ぜいべつ', 'zeibetsu', 'tax separate', {
          tag: 'word',
          example: { kana: 'ぜいべつです。', romaji: 'zeibetsu desu.', meaning: 'Tax is separate.' },
        }),
      ],
      culture: [
        {
          title: 'Two tax rates in Japan',
          body: 'Japan has reduced 8% tax on food vs 10% on most other goods. Menus marked ぜいこみ (zeikomi) show the final price; ぜいべつ (zeibetsu) means tax is added at the register.',
        },
        {
          title: 'Cash is still king',
          body: 'Cards are widely accepted now, but many small shops, temples and rural areas are cash-only. Convenience store ATMs (marked seven-bank or JP Bank) take foreign cards.',
        },
      ],
    },
  ],
};
