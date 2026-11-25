// Client-safe dialogue scene definitions (no db imports).

export interface DialogueChoice {
  kana: string;
  romaji: string;
  /** English shown after picking, for learning */
  meaning: string;
  correct: boolean;
  /** gentle correction shown when picked wrongly */
  feedback?: string;
}

export interface DialogueTurn {
  speaker: 'them' | 'you' | 'narrator';
  /** narrator turns have no kana */
  kana?: string;
  romaji?: string;
  meaning?: string;
  /** for 'you' turns: pick the right reply */
  choices?: DialogueChoice[];
}

export interface DialogueScene {
  id: string;
  title: string;
  subtitle: string;
  setting: string;
  /** XP awarded for a clean run */
  xp: number;
  turns: DialogueTurn[];
}

export const DIALOGUES: DialogueScene[] = [
  {
    id: 'ramen',
    title: 'Ordering ramen',
    subtitle: 'ラーメン屋 — a tiny counter-only shop',
    setting:
      'You slide open the door of a ramen shop in Kyoto. Steam, broth smell, and a chorus of welcomes.',
    xp: 12,
    turns: [
      { speaker: 'narrator', meaning: 'The staff spot you immediately.' },
      {
        speaker: 'them',
        kana: 'いらっしゃいませ！何名様ですか？',
        romaji: 'irasshaimase! nanmei-sama desu ka?',
        meaning: 'Welcome! How many people?',
      },
      {
        speaker: 'you',
        choices: [
          { kana: '一人です', romaji: 'hitori desu', meaning: 'Just me (one person)', correct: true },
          {
            kana: '一人が食べたいです',
            romaji: 'hitori ga tabetai desu',
            meaning: 'I want to eat one person',
            correct: false,
            feedback: 'Careful — that says you want to eat a person! 一人です = "one person".',
          },
          {
            kana: 'トイレはどこですか？',
            romaji: 'toire wa doko desu ka?',
            meaning: 'Where is the toilet?',
            correct: false,
            feedback: 'They asked how many people — answer first! 一人です = "one person".',
          },
        ],
      },
      { speaker: 'narrator', meaning: 'They point you to a counter seat and hand you a menu.' },
      {
        speaker: 'them',
        kana: 'ご注文は？',
        romaji: 'go-chūmon wa?',
        meaning: 'Your order?',
      },
      {
        speaker: 'you',
        choices: [
          {
            kana: '醤油ラーメンを一つお願いします',
            romaji: 'shōyu rāmen o hitotsu onegai shimasu',
            meaning: 'One shoyu ramen, please',
            correct: true,
          },
          {
            kana: 'ラーメンはおいしいですね',
            romaji: 'rāmen wa oishii desu ne',
            meaning: 'Ramen is tasty, isn\'t it',
            correct: false,
            feedback: 'True, but not an order! Use 〜を一つお願いします to order one.',
          },
          {
            kana: 'お会計をお願いします',
            romaji: 'okaikei o onegai shimasu',
            meaning: 'The bill, please',
            correct: false,
            feedback: 'You haven\'t eaten yet! Order with 〜をお願いします.',
          },
        ],
      },
      {
        speaker: 'them',
        kana: 'かしこまりました！少々お待ちください。',
        romaji: 'kashikomarimashita! shōshō omachi kudasai.',
        meaning: 'Certainly! Please wait a moment.',
      },
      { speaker: 'narrator', meaning: 'Five minutes later, a steaming bowl arrives.' },
      {
        speaker: 'them',
        kana: 'お待たせしました。どうぞ。',
        romaji: 'omatase shimashita. dōzo.',
        meaning: 'Sorry for the wait. Here you go.',
      },
      {
        speaker: 'you',
        choices: [
          {
            kana: 'いただきます',
            romaji: 'itadakimasu',
            meaning: '(said before eating — "I humbly receive")',
            correct: true,
          },
          {
            kana: 'ごちそうさまでした',
            romaji: 'gochisōsama deshita',
            meaning: 'Thank you for the meal (said AFTER eating)',
            correct: false,
            feedback: 'Save that for after! Before eating, say いただきます.',
          },
          {
            kana: 'おやすみなさい',
            romaji: 'oyasuminasai',
            meaning: 'Good night',
            correct: false,
            feedback: 'Wrong occasion — before a meal, say いただきます.',
          },
        ],
      },
      {
        speaker: 'narrator',
        meaning: 'You finish every drop. Time to pay — ramen shops usually take payment at the register by the door.',
      },
      {
        speaker: 'you',
        choices: [
          {
            kana: 'ごちそうさまでした。お会計をお願いします',
            romaji: 'gochisōsama deshita. okaikei o onegai shimasu',
            meaning: 'That was delicious — the bill, please',
            correct: true,
          },
          {
            kana: 'もう一杯ください',
            romaji: 'mō ippai kudasai',
            meaning: 'Another bowl, please',
            correct: false,
            feedback: 'Greedy! You\'re paying, not ordering again: お会計をお願いします.',
          },
        ],
      },
      {
        speaker: 'them',
        kana: '九百円です。ありがとうございました！',
        romaji: 'kyūhyaku-en desu. arigatō gozaimashita!',
        meaning: 'That\'s 900 yen. Thank you very much!',
      },
    ],
  },
  {
    id: 'ticket',
    title: 'Buying a train ticket',
    subtitle: '駅の窓口 — the ticket counter',
    setting:
      'At Tokyo Station. The machines are confusing today, so you join the line for the staffed counter (みどりの窓口).',
    xp: 12,
    turns: [
      {
        speaker: 'them',
        kana: 'いらっしゃいませ。どちらまで？',
        romaji: 'irasshaimase. dochira made?',
        meaning: 'Welcome. Where to?',
      },
      {
        speaker: 'you',
        choices: [
          {
            kana: '京都までお願いします',
            romaji: 'Kyōto made onegai shimasu',
            meaning: 'To Kyoto, please',
            correct: true,
          },
          {
            kana: '京都はどこですか？',
            romaji: 'Kyōto wa doko desu ka?',
            meaning: 'Where is Kyoto?',
            correct: false,
            feedback: 'You\'re buying a ticket TO Kyoto: 京都まで = "as far as Kyoto".',
          },
          {
            kana: 'きっぷは漢字で何ですか？',
            romaji: 'kippu wa kanji de nan desu ka?',
            meaning: 'What is "ticket" in kanji?',
            correct: false,
            feedback: 'A fun question for later — right now just say 京都までお願いします.',
          },
        ],
      },
      {
        speaker: 'them',
        kana: '何名様ですか？',
        romaji: 'nanmei-sama desu ka?',
        meaning: 'How many people?',
      },
      {
        speaker: 'you',
        choices: [
          { kana: '二人です', romaji: 'futari desu', meaning: 'Two people', correct: true },
          {
            kana: '二枚の切符',
            romaji: 'nimai no kippu',
            meaning: '(about) two tickets — understandable but unnatural',
            correct: false,
            feedback: 'They asked about people, not tickets. 二人です = "two people".',
          },
          {
            kana: 'はい、京都です',
            romaji: 'hai, Kyōto desu',
            meaning: 'Yes, Kyoto',
            correct: false,
            feedback: 'They asked how many PEOPLE: 二人です = "two people".',
          },
        ],
      },
      {
        speaker: 'them',
        kana: '自由席と指定席、どちらにしますか？',
        romaji: 'jiyūseki to shiteiseki, dochira ni shimasu ka?',
        meaning: 'Unreserved or reserved seat — which would you like?',
      },
      {
        speaker: 'you',
        choices: [
          {
            kana: '自由席でお願いします',
            romaji: 'jiyūseki de onegai shimasu',
            meaning: 'Unreserved, please',
            correct: true,
          },
          {
            kana: '指定席は何ですか？…あ、自由席で',
            romaji: 'shiteiseki wa nan desu ka? …a, jiyūseki de',
            meaning: 'What\'s reserved? …ah, unreserved',
            correct: false,
            feedback: 'Understandable, but pick a seat type directly: 自由席で = "unreserved (seat)".',
          },
        ],
      },
      {
        speaker: 'them',
        kana: '二万八千円です。ICカードはお使いですか？',
        romaji: 'niman hassen-en desu. aishī kādo wa otsukai desu ka?',
        meaning: 'That\'s 28,000 yen. Will you pay by IC card?',
      },
      {
        speaker: 'you',
        choices: [
          {
            kana: 'いいえ、現金で払います',
            romaji: 'iie, genkin de haraimasu',
            meaning: 'No, I\'ll pay cash',
            correct: true,
          },
          {
            kana: '二万八千円は高いです！',
            romaji: 'niman hassen-en wa takai desu!',
            meaning: '28,000 yen is expensive!',
            correct: false,
            feedback: 'It is! But answer the question: 現金で払います = "I\'ll pay cash".',
          },
        ],
      },
      {
        speaker: 'them',
        kana: 'ありがとうございます。十四番線、十一時の電車です。',
        romaji: 'arigatō gozaimasu. jūyonban-sen, jūichiji no densha desu.',
        meaning: 'Thank you. Platform 14, the 11 o\'clock train.',
      },
      { speaker: 'narrator', meaning: 'Tickets in hand — time to find platform 14 (十四番線).' },
    ],
  },
  {
    id: 'hotel',
    title: 'Hotel check-in',
    subtitle: 'ホテルのフロント — the front desk',
    setting:
      'Evening in Osaka. Rolling your suitcase across the lobby, you reach the front desk.',
    xp: 12,
    turns: [
      {
        speaker: 'them',
        kana: 'こんばんは。ご予約ですか？',
        romaji: 'konbanwa. goyoyaku desu ka?',
        meaning: 'Good evening. Do you have a reservation?',
      },
      {
        speaker: 'you',
        choices: [
          {
            kana: 'はい、ブラヒムで予約しています',
            romaji: 'hai, Burahimu de yoyaku shite imasu',
            meaning: 'Yes, I have a reservation under Brahim',
            correct: true,
          },
          {
            kana: '予約は漢字が難しいです',
            romaji: 'yoyaku wa kanji ga muzukashii desu',
            meaning: '"Reservation" is hard in kanji',
            correct: false,
            feedback: 'True (予約 is tricky!) but answer yes first: はい、〜で予約しています.',
          },
          {
            kana: 'いいえ、部屋を見たいです',
            romaji: 'iie, heya o mitai desu',
            meaning: 'No, I want to see a room',
            correct: false,
            feedback: 'You DO have a reservation — はい、〜で予約しています.',
          },
        ],
      },
      {
        speaker: 'them',
        kana: 'ありがとうございます。パスポートをお願いできますか？',
        romaji: 'arigatō gozaimasu. pasupōto o onegai dekimasu ka?',
        meaning: 'Thank you. May I have your passport?',
      },
      {
        speaker: 'you',
        choices: [
          {
            kana: 'はい、どうぞ',
            romaji: 'hai, dōzo',
            meaning: 'Yes, here you go',
            correct: true,
          },
          {
            kana: 'パスポートは家にあります',
            romaji: 'pasupōto wa ie ni arimasu',
            meaning: 'My passport is at home',
            correct: false,
            feedback: 'Never leave it at home in Japan — you need it at check-in! はい、どうぞ.',
          },
        ],
      },
      {
        speaker: 'them',
        kana: '二泊ですね。朝食は七時から九時半までです。',
        romaji: 'nihaku desu ne. chōshoku wa shichiji kara kuji-han made desu.',
        meaning: 'Two nights, correct? Breakfast is from 7:00 to 9:30.',
      },
      {
        speaker: 'you',
        choices: [
          {
            kana: 'ありがとうございます。部屋は何階ですか？',
            romaji: 'arigatō gozaimasu. heya wa nankai desu ka?',
            meaning: 'Thank you. What floor is my room on?',
            correct: true,
          },
          {
            kana: '朝食は嫌いです',
            romaji: 'chōshoku wa kirai desu',
            meaning: 'I hate breakfast',
            correct: false,
            feedback: 'Blunt! If you want the floor number, ask 何階ですか (what floor).',
          },
        ],
      },
      {
        speaker: 'them',
        kana: '五階の五〇二号室です。こちらがカードキーです。',
        romaji: 'gokai no go-marū-ni-gōshitsu desu. kochira ga kādo kī desu.',
        meaning: 'Room 502 on the 5th floor. Here is your card key.',
      },
      {
        speaker: 'you',
        choices: [
          {
            kana: 'ありがとうございます。お疲れさまです',
            romaji: 'arigatō gozaimasu. otsukaresama desu',
            meaning: 'Thank you very much (with a friendly closer)',
            correct: true,
          },
          {
            kana: 'さようなら、永遠に',
            romaji: 'sayōnara, eien ni',
            meaning: 'Goodbye, forever',
            correct: false,
            feedback: 'Dramatic! A simple ありがとうございます is all you need.',
          },
        ],
      },
      {
        speaker: 'narrator',
        meaning: 'Room 502, fifth floor. Check-in complete — you earned a hot bath.',
      },
    ],
  },
];

export const DIALOGUE_INDEX = new Map(DIALOGUES.map((d) => [d.id, d]));
