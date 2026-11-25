import type { UnitDraft } from '../types';
import { v } from './helpers';

export const unit6: UnitDraft = {
  id: 'u6',
  order: 6,
  title: 'Hotel, Shopping & Getting Help',
  subtitle: 'Check-in, prices & emergencies',
  description:
    'The final survival kit: check into hotels, shop with confidence, and handle emergencies — the phrases that turn "tourist" into "traveler".',
  lessons: [
    {
      id: 'u6-l1',
      title: 'At the hotel',
      subtitle: 'Reservations, rooms & amenities',
      description:
        'Japanese hotels range from ryokan (traditional inns) to business hotels — but the vocabulary is universal. Check in, ask for what you need, and sleep well.',
      focus: 'vocab',
      vocab: [
        v('furonto', 'ふろんと', 'furonto', 'front desk / reception', {
          tag: 'place',
          example: { kana: 'ふろんとはなんかいですか。', romaji: 'furonto wa nankai desu ka.', meaning: 'Which floor is the front desk?' },
        }),
        v('yoyaku', 'よやく', 'yoyaku', 'reservation', {
          tag: 'noun',
          example: { kana: 'よやくをしています。', romaji: 'yoyaku o shite imasu.', meaning: 'I have a reservation.' },
        }),
        v('heya', 'へや', 'heya', 'room', {
          tag: 'noun',
          example: { kana: 'へやのかぎをください。', romaji: 'heya no kagi o kudasai.', meaning: 'The room key, please.' },
        }),
        v('kagi', 'かぎ', 'kagi', 'key', {
          tag: 'noun',
          example: { kana: 'かぎをわすれました。', romaji: 'kagi o wasuremashita.', meaning: 'I forgot my key.' },
        }),
        v('nimotsu', 'にもつ', 'nimotsu', 'luggage', {
          tag: 'noun',
          example: { kana: 'にもつをあずけます。', romaji: 'nimotsu o azukemasu.', meaning: 'I will leave my luggage.' },
        }),
        v('chekkuiin', 'チェックイン', 'chekkuiin', 'check-in', {
          tag: 'phrase',
          note: 'Also works for hotels, airports, events',
          example: { kana: 'チェックインはなんじからですか。', romaji: 'chekkuiin wa nanji kara desu ka.', meaning: 'What time is check-in from?' },
        }),
        v('choushoku', 'ちょうしょく', 'choushoku', 'breakfast', {
          tag: 'noun',
          example: { kana: 'ちょうしょくはありますか。', romaji: 'choushoku wa arimasu ka.', meaning: 'Is breakfast included?' },
        }),
        v('kinen', 'きんえん', 'kinen', 'non-smoking', {
          tag: 'word',
          note: 'For smoking rooms ask きつえん (kitsuen)',
          example: { kana: 'きんえんのへやをおねがいします。', romaji: 'kinen no heya o onegaishimasu.', meaning: 'A non-smoking room, please.' },
        }),
        v('kitsuen', 'きつえん', 'kitsuen', 'smoking', {
          tag: 'word',
          example: { kana: 'きつえんのへやです。', romaji: 'kitsuen no heya desu.', meaning: 'It is a smoking room.' },
        }),
        v('taoru', 'タオル', 'taoru', 'towel', {
          tag: 'noun',
          example: { kana: 'タオルはありますか。', romaji: 'taoru wa arimasu ka.', meaning: 'Are there towels?' },
        }),
        v('haburashi', 'はぶらし', 'haburashi', 'toothbrush', {
          tag: 'noun',
          example: { kana: 'はぶらしをください。', romaji: 'haburashi o kudasai.', meaning: 'A toothbrush, please.' },
        }),
        v('kuuaa', 'クーラー', 'kuuaa', 'air conditioner', {
          tag: 'noun',
          example: { kana: 'クーラーがききません。', romaji: 'kuuaa ga kikimasen.', meaning: 'The AC doesn’t work.' },
        }),
        v('haku', '〜はく', 'haku', 'counter for nights', {
          tag: 'counter',
          example: { kana: 'さんはくです。', romaji: 'sanhaku desu.', meaning: 'It is three nights.' },
        }),
        v('ofuro', 'おふろ', 'ofuro', 'bath', {
          tag: 'noun',
          example: { kana: 'おふろは二かいです。', romaji: 'ofuro wa nikai desu.', meaning: 'The bath is on the second floor.' },
        }),
      ],
      culture: [
        {
          title: 'Business hotels are everywhere',
          body: 'Japan is full of clean, compact "business hotels" — often ¥5,000–8,000/night near stations. They are the best value in travel: private bathroom, free Wi-Fi, coin laundry, and konbini next door.',
        },
        {
          title: 'Shoes off, please',
          body: 'Remove your shoes at the genkan (entrance) — you will get slippers (uwabaki). This applies to hotels, homes, temples and some restaurants. Never wear shoes on tatami.',
        },
      ],
    },
    {
      id: 'u6-l2',
      title: 'Shopping & money matters',
      subtitle: 'Sizes, colors, receipts & tax-free',
      description:
        'From konbini to department stores, these phrases handle every purchase: asking sizes, trying on, getting receipts and understanding tax-free shopping.',
      focus: 'vocab',
      vocab: [
        v('reji', 'レジ', 'reji', 'checkout counter / register', {
          tag: 'place',
          example: { kana: 'レジはあちらです。', romaji: 'reji wa achira desu.', meaning: 'The register is over there.' },
        }),
        v('iro', 'いろ', 'iro', 'color', {
          tag: 'noun',
          example: { kana: 'このいろはありますか。', romaji: 'kono iro wa arimasu ka.', meaning: 'Do you have this color?' },
        }),
        v('shichaku', 'しちゃく', 'shichaku', 'trying on (clothes)', {
          tag: 'word',
          example: { kana: 'しちゃくできますか。', romaji: 'shichaku dekimasu ka.', meaning: 'Can I try it on?' },
        }),
        v('menzei', 'めんぜい', 'menzei', 'tax-free', {
          tag: 'word',
          note: 'Available for tourists over ¥5,000 at participating stores — bring your passport',
          example: { kana: 'めんぜいはできますか。', romaji: 'menzei wa dekimasu ka.', meaning: 'Is tax-free available?' },
        }),
        v('reshiito', 'レシート', 'reshiito', 'receipt', {
          tag: 'noun',
          example: { kana: 'レシートをください。', romaji: 'reshiito o kudasai.', meaning: 'A receipt, please.' },
        }),
        v('fukuro', 'ふくろ', 'fukuro', 'bag', {
          tag: 'noun',
          note: 'Many stores charge for bags now — bring your own',
          example: { kana: 'ふくろはいりますか。', romaji: 'fukuro wa irimasu ka.', meaning: 'Do you need a bag?' },
        }),
        v('kudasai', 'ください', 'kudasai', 'please give me', {
          tag: 'phrase',
          note: 'Attach to 〜を for polite requests',
          example: { kana: 'これをください。', romaji: 'kore o kudasai.', meaning: 'This one, please.' },
        }),
        v('chiisai', 'ちいさい', 'chiisai', 'small', {
          tag: 'adjective',
          example: { kana: 'ちいさいのはありますか。', romaji: 'chiisai no wa arimasu ka.', meaning: 'Do you have a small one?' },
        }),
        v('ookii', 'おおきい', 'ookii', 'big', {
          tag: 'adjective',
          example: { kana: 'おおきいのはありますか。', romaji: 'ookii no wa arimasu ka.', meaning: 'Do you have a big one?' },
        }),
        v('akai', 'あかい', 'akai', 'red', {
          tag: 'adjective',
          example: { kana: 'あかいのをください。', romaji: 'akai no o kudasai.', meaning: 'The red one, please.' },
        }),
        v('kuroi', 'くろい', 'kuroi', 'black', {
          tag: 'adjective',
          example: { kana: 'くろいのはありますか。', romaji: 'kuroi no wa arimasu ka.', meaning: 'Do you have a black one?' },
        }),
        v('shiroi', 'しろい', 'shiroi', 'white', {
          tag: 'adjective',
          example: { kana: 'しろいシャツをください。', romaji: 'shiroi shatsu o kudasai.', meaning: 'A white shirt, please.' },
        }),
        v('aoi', 'あおい', 'aoi', 'blue', {
          tag: 'adjective',
          example: { kana: 'あおいのはありますか。', romaji: 'aoi no wa arimasu ka.', meaning: 'Do you have a blue one?' },
        }),
        v('mite-mimasu', 'みてみます', 'mite mimasu', 'may I try it on / let me see', {
          tag: 'phrase',
          note: 'Polite way to ask to try clothes',
          example: { kana: 'これをみてみます。', romaji: 'kore o mite mimasu.', meaning: 'May I try this on?' },
        }),
      ],
      culture: [
        {
          title: 'Bargaining is rare',
          body: 'Fixed prices are the norm in Japan — bargaining is uncommon except at flea markets (駿河屋 surugaya) and some street stalls. Tax-free shopping for tourists requires your passport.',
        },
        {
          title: 'Konbini bags cost extra',
          body: 'Since 2020, Japan charges ~¥3 for plastic bags at most stores. Bring a reusable bag or pay the small fee — it adds up over a long trip.',
        },
      ],
    },
    {
      id: 'u6-l3',
      title: 'Getting help — emergencies & trouble',
      subtitle: 'Lost, hurt, police & hospitals',
      description:
        'The phrases you hope you never need but will be grateful to know: help, emergency, police box, hospital — and how to say "I don’t understand Japanese".',
      focus: 'vocab',
      vocab: [
        v('tasukete', 'たすけて', 'tasukete', 'help!', {
          tag: 'emergency',
          note: 'From tasukeru (to save) — shout this in any emergency',
          example: { kana: 'たすけて！たすけてください！', romaji: 'tasukete! tasukete kudasai!', meaning: 'Help! Help me!' },
        }),
        v('komarimashita', 'こまりました', 'komarimashita', 'I’m in trouble / at a loss', {
          tag: 'emergency',
          example: { kana: 'おかねがなくてこまりました。', romaji: 'okane ga nakute komarimashita.', meaning: 'I’m in trouble — I’m out of money.' },
        }),
        v('michi-ni-mayoimashita', 'みちにまよいました', 'michi ni mayoimashita', 'I’m lost', {
          tag: 'emergency',
          example: { kana: 'みちにまよいました。たすけてください。', romaji: 'michi ni mayoimashita. tasukete kudasai.', meaning: 'I’m lost. Please help me.' },
        }),
        v('byouin', 'びょういん', 'byouin', 'hospital', {
          tag: 'emergency',
          example: { kana: 'びょういんはどこですか。', romaji: 'byouin wa doko desu ka.', meaning: 'Where is the hospital?' },
        }),
        v('keisatsu', 'けいさつ', 'keisatsu', 'police', {
          tag: 'emergency',
          example: { kana: 'けいさつをよんでください。', romaji: 'keisatsu o yonde kudasai.', meaning: 'Please call the police.' },
        }),
        v('kouban', 'こうばん', 'kouban', 'police box', {
          tag: 'emergency',
          note: 'Small neighborhood police posts — tourists use them daily',
          example: { kana: 'こうばんはしんごうのそばです。', romaji: 'kouban wa shingou no soba desu.', meaning: 'The police box is near the traffic light.' },
        }),
        v('kinkyuu', 'きんきゅう', 'kinkyuu', 'emergency', {
          tag: 'emergency',
          example: { kana: 'きんきゅうです！', romaji: 'kinkyuu desu!', meaning: 'It is an emergency!' },
        }),
        v('denwa', 'でんわ', 'denwa', 'phone', {
          tag: 'noun',
          example: { kana: 'でんわをかしてもらえますか。', romaji: 'denwa o kashite moraemasu ka.', meaning: 'Can I borrow a phone?' },
        }),
        v('bangou', 'ばんごう', 'bangou', 'number', {
          tag: 'noun',
          example: { kana: 'このばんごうにでんわしてください。', romaji: 'kono bangou ni denwa shite kudasai.', meaning: 'Please call this number.' },
        }),
        v('nihongo-wakarimasen', 'にほんごがわかりません', 'nihongo ga wakarimasen', 'I don’t understand Japanese', {
          tag: 'emergency',
          example: { kana: 'すみません、にほんごがわかりません。', romaji: 'sumimasen, nihongo ga wakarimasen.', meaning: 'Sorry, I don’t understand Japanese.' },
        }),
        v('eigo-wakarimasu-ka', 'えいごがわかりますか', 'eigo ga wakarimasu ka', 'do you speak English?', {
          tag: 'emergency',
          example: { kana: 'えいごがわかりますか。', romaji: 'eigo ga wakarimasu ka.', meaning: 'Do you speak English?' },
        }),
        v('yukkuri-onegaishimasu', 'ゆっくりおねがいします', 'yukkuri onegaishimasu', 'please speak slowly / take your time', {
          tag: 'emergency',
          example: { kana: 'ゆっくりおねがいします。', romaji: 'yukkuri onegaishimasu.', meaning: 'Please speak slowly.' },
        }),
        v('kega-o-shimashita', 'けがをしました', 'kega o shimashita', 'I got injured', {
          tag: 'emergency',
          example: { kana: 'けがをしました。びょういんにいきたいです。', romaji: 'kega o shimashita. byouin ni ikitai desu.', meaning: 'I got hurt. I want to go to the hospital.' },
        }),
      ],
      culture: [
        {
          title: 'Emergency numbers',
          body: 'In Japan: 110 for police, 119 for ambulance/fire. These are free from any phone. English-speaking operators are available in major cities, but the phrases above will get you help faster.',
        },
        {
          title: 'The kouban is your friend',
          body: 'Every neighborhood has a small police box (kouban) — officers there help lost tourists daily, speak some English, and can call you a taxi or translate for hospitals.',
        },
      ],
    },
  ],
};
