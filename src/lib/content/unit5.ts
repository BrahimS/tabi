import type { UnitDraft } from '../types';
import { v } from './helpers';

export const unit5: UnitDraft = {
  id: 'u5',
  order: 5,
  title: 'Getting Around',
  subtitle: 'Trains, stations & directions',
  description:
    'Japan’s train system is the best in the world — once you can navigate stations, buy tickets and ask directions, you can go anywhere independently.',
  lessons: [
    {
      id: 'u5-l1',
      title: 'Stations, trains & tickets',
      subtitle: 'The JR network & your first ride',
      description:
        'Stations are airports for trains — learn the vocabulary of platforms, gates and tickets so you never feel lost in Tokyo Station again.',
      focus: 'vocab',
      vocab: [
        v('eki', 'えき', 'eki', 'station', {
          tag: 'place',
          example: { kana: 'えきはどこですか。', romaji: 'eki wa doko desu ka.', meaning: 'Where is the station?' },
        }),
        v('densha', 'でんしゃ', 'densha', 'train', {
          tag: 'transport',
          example: { kana: 'でんしゃでいきます。', romaji: 'densha de ikimasu.', meaning: 'I go by train.' },
        }),
        v('kippu', 'きっぷ', 'kippu', 'ticket', {
          tag: 'noun',
          example: { kana: 'きっぷをかいます。', romaji: 'kippu o kaimasu.', meaning: 'I buy a ticket.' },
        }),
        v('kaisatsu', 'かいさつ', 'kaisatsu', 'ticket gate', {
          tag: 'place',
          note: 'Tap your IC card or insert your ticket here',
          example: { kana: 'かいさつでいれます。', romaji: 'kaisatsu de ire masu.', meaning: 'I go through the ticket gate.' },
        }),
        v('hoomu', 'ホーム', 'hoomu', 'platform', {
          tag: 'place',
          example: { kana: 'ホームはなんばんですか。', romaji: 'hoomu wa nanban desu ka.', meaning: 'Which platform is it?' },
        }),
        v('chizu', 'ちず', 'chizu', 'map', {
          tag: 'noun',
          example: { kana: 'ちずをみせてください。', romaji: 'chizu o misete kudasai.', meaning: 'Please show me the map.' },
        }),
        v('norimasu', 'のります', 'norimasu', 'to ride / board', {
          tag: 'verb',
          note: 'Trains, buses, planes — anything you ride',
          example: { kana: 'でんしゃにのります。', romaji: 'densha ni norimasu.', meaning: 'I board the train.' },
        }),
        v('orimasu', 'おります', 'orimasu', 'to get off', {
          tag: 'verb',
          example: { kana: 'つぎのえきでおります。', romaji: 'tsugi no eki de orimasu.', meaning: 'I get off at the next station.' },
        }),
        v('ikimasu', 'いきます', 'ikimasu', 'to go', {
          tag: 'verb',
          note: 'Reinforcement from lesson 2.3 — now in travel context',
          example: { kana: 'とうきょうへいきます。', romaji: 'toukyou e ikimasu.', meaning: 'I go to Tokyo.' },
        }),
        v('kaerimasu', 'かえります', 'kaerimasu', 'to return / go home', {
          tag: 'verb',
          example: { kana: 'あしたかえります。', romaji: 'ashita kaerimasu.', meaning: 'I return tomorrow.' },
        }),
        v('made', 'まで', 'made', 'until / as far as', {
          tag: 'particle',
          example: { kana: 'とうきょうまでのきっぷ。', romaji: 'toukyou made no kippu.', meaning: 'A ticket to Tokyo.' },
        }),
        v('jikan', 'じかん', 'jikan', 'time / hours', {
          tag: 'noun',
          example: { kana: 'いちじかんかかります。', romaji: 'ichijikan kakarimasu.', meaning: 'It takes one hour.' },
        }),
        v('nanji', 'なんじ', 'nanji', 'what time?', {
          tag: 'phrase',
          example: { kana: 'でんしゃはなんじですか。', romaji: 'densha wa nanji desu ka.', meaning: 'What time is the train?' },
        }),
      ],
      culture: [
        {
          title: 'The Yamanote Line',
          body: 'The JR Yamanote Line circles central Tokyo — locals call it the "Yamanote ga-line". One loop covers Shinjuku, Shibuya, Tokyo Station, Ueno and Akihabara. Trains stop around midnight.',
        },
        {
          title: 'Quiet cars are real',
          body: 'Japanese trains are libraries on wheels — phone calls are banned, conversations are whispered, and eating is limited to designated areas. The "shizuka" (quiet) cars are strictly enforced.',
        },
      ],
    },
    {
      id: 'u5-l2',
      title: 'Asking directions',
      subtitle: 'Left, right, straight & everywhere else',
      description:
        'The vocabulary of getting lost and getting found: left, right, straight, next to, behind — plus the exact phrases to ask "how do I get to…?"',
      focus: 'vocab',
      vocab: [
        v('migi', 'みぎ', 'migi', 'right', {
          tag: 'direction',
          example: { kana: 'ぎんこうはみぎです。', romaji: 'ginkou wa migi desu.', meaning: 'The bank is on the right.' },
        }),
        v('hidari', 'ひだり', 'hidari', 'left', {
          tag: 'direction',
          example: { kana: 'トイレはひだりです。', romaji: 'toire wa hidari desu.', meaning: 'The toilet is on the left.' },
        }),
        v('massugu', 'まっすぐ', 'massugu', 'straight ahead', {
          tag: 'direction',
          note: 'Literally "straight and fast"',
          example: { kana: 'まっすぐいってください。', romaji: 'massugu itte kudasai.', meaning: 'Please go straight.' },
        }),
        v('kado', 'かど', 'kado', 'corner', {
          tag: 'direction',
          example: { kana: 'かどをみぎにまがってください。', romaji: 'kado o migi ni magatte kudasai.', meaning: 'Turn right at the corner.' },
        }),
        v('tonari', 'となり', 'tonari', 'next to', {
          tag: 'direction',
          example: { kana: 'えきのとなりです。', romaji: 'eki no tonari desu.', meaning: 'It is next to the station.' },
        }),
        v('mae', 'まえ', 'mae', 'front / in front of', {
          tag: 'direction',
          example: { kana: 'えきのまえです。', romaji: 'eki no mae desu.', meaning: 'It is in front of the station.' },
        }),
        v('ushiro', 'うしろ', 'ushiro', 'behind / back', {
          tag: 'direction',
          example: { kana: 'うしろにあります。', romaji: 'ushiro ni arimasu.', meaning: 'It is behind.' },
        }),
        v('ue', 'うえ', 'ue', 'up / above', {
          tag: 'direction',
          example: { kana: 'うえのかいです。', romaji: 'ue no kai desu.', meaning: 'It is on the upper floor.' },
        }),
        v('shita', 'した', 'shita', 'down / below / under', {
          tag: 'direction',
          example: { kana: 'したのフロアです。', romaji: 'shita no furoa desu.', meaning: 'It is on the lower floor.' },
        }),
        v('naka', 'なか', 'naka', 'inside / middle', {
          tag: 'direction',
          example: { kana: 'なかにあります。', romaji: 'naka ni arimasu.', meaning: 'It is inside.' },
        }),
        v('soto', 'そと', 'soto', 'outside', {
          tag: 'direction',
          example: { kana: 'そとにでます。', romaji: 'soto ni demasu.', meaning: 'I go outside.' },
        }),
        v('iriguchi', 'いりぐち', 'iriguchi', 'entrance', {
          tag: 'place',
          example: { kana: 'いりぐちはどこですか。', romaji: 'iriguchi wa doko desu ka.', meaning: 'Where is the entrance?' },
        }),
        v('deguchi', 'でぐち', 'deguchi', 'exit', {
          tag: 'place',
          example: { kana: 'でぐちはあちらです。', romaji: 'deguchi wa achira desu.', meaning: 'The exit is over there.' },
        }),
        v('kousaten', 'こうさてん', 'kousaten', 'intersection', {
          tag: 'place',
          example: { kana: 'こうさてんをわたってください。', romaji: 'kousaten o watatte kudasai.', meaning: 'Please cross the intersection.' },
        }),
        v('shingou', 'しんごう', 'shingou', 'traffic light', {
          tag: 'place',
          example: { kana: 'しんごうをひだりです。', romaji: 'shingou o hidari desu.', meaning: 'Left at the traffic light.' },
        }),
        v('aruite', 'あるいて', 'aruite', 'on foot / walking', {
          tag: 'verb',
          note: 'From aruku (to walk) — あるいていきます = "go on foot"',
          example: { kana: 'えきまであるいていけます。', romaji: 'eki made aruite ikemasu.', meaning: 'You can walk to the station.' },
        }),
      ],
      culture: [
        {
          title: 'Addresses are backwards',
          body: 'Japanese addresses go largest-to-smallest: country → prefecture → city → district → block → building. "Tokyo-to Shibuya-ku" narrows down before you even reach the street number.',
        },
        {
          title: 'Ask a station attendant',
          body: 'Every station has みどりの窓口 (midori no madoguchi — "green window") where staff will draw you a route map for free. They are famously patient with lost tourists.',
        },
      ],
    },
    {
      id: 'u5-l3',
      title: 'Destinations & getting tickets',
      subtitle: 'Airports, temples & one-way vs round-trip',
      description:
        'Name your destination, choose one-way or round-trip, and know how long it takes — the final vocabulary for independent travel planning.',
      focus: 'vocab',
      vocab: [
        v('kuukou', 'くうこう', 'kuukou', 'airport', {
          tag: 'place',
          example: { kana: 'くうこうまでバスでいけます。', romaji: 'kuukou made basu de ikemasu.', meaning: 'You can get to the airport by bus.' },
        }),
        v('jinja', 'じんじゃ', 'jinja', 'shrine', {
          tag: 'place',
          example: { kana: 'じんじゃはにほんじんにたいせつです。', romaji: 'jinja wa nihonjin ni taisetsu desu.', meaning: 'Shrines are important to Japanese people.' },
        }),
        v('otera', 'おてら', 'otera', 'temple', {
          tag: 'place',
          example: { kana: 'おてらをみにいきます。', romaji: 'otera o mi ni ikimasu.', meaning: 'I go to see a temple.' },
        }),
        v('hakubutsukan', 'はくぶつかん', 'hakubutsukan', 'museum', {
          tag: 'place',
          example: { kana: 'はくぶつかんはやすいです。', romaji: 'hakubutsukan wa yasui desu.', meaning: 'The museum is cheap.' },
        }),
        v('mise', 'みせ', 'mise', 'shop / store', {
          tag: 'place',
          example: { kana: 'このみせはにぎやかです。', romaji: 'kono mise wa nigiyaka desu.', meaning: 'This shop is lively.' },
        }),
        v('ekimae', 'えきまえ', 'ekimae', 'in front of the station', {
          tag: 'place',
          example: { kana: 'えきまえにホテルがあります。', romaji: 'ekimae ni hoteru ga arimasu.', meaning: 'There is a hotel in front of the station.' },
        }),
        v('katamichi', 'かたみち', 'katamichi', 'one-way', {
          tag: 'ticket',
          example: { kana: 'かたみちのきっぷをください。', romaji: 'katamichi no kippu o kudasai.', meaning: 'A one-way ticket, please.' },
        }),
        v('oufuku', 'おうふく', 'oufuku', 'round-trip', {
          tag: 'ticket',
          example: { kana: 'おうふくのほうがやすいです。', romaji: 'oufuku no hou ga yasui desu.', meaning: 'Round-trip is cheaper.' },
        }),
        v('okuremasu', 'おくれます', 'okuremasu', 'to be late / delayed', {
          tag: 'verb',
          example: { kana: 'でんしゃがおくれます。', romaji: 'densha ga okuremasu.', meaning: 'The train is delayed.' },
        }),
        v('atode', 'あとで', 'atode', 'later / see you later', {
          tag: 'phrase',
          example: { kana: 'またあとで。', romaji: 'mata atode.', meaning: 'See you later.' },
        }),
        v('dono-kurai', 'どのくらい', 'dono kurai', 'how long (does it take)?', {
          tag: 'phrase',
          example: { kana: 'えきまでどのくらいかかりますか。', romaji: 'eki made dono kurai kakarimasu ka.', meaning: 'How long does it take to the station?' },
        }),
        v('hikouki', 'ひこうき', 'hikouki', 'airplane', {
          tag: 'transport',
          example: { kana: 'ひこうきにのります。', romaji: 'hikouki ni norimasu.', meaning: 'I board the airplane.' },
        }),
        v('fune', 'ふね', 'fune', 'boat / ship', {
          tag: 'transport',
          example: { kana: 'ふねでいきます。', romaji: 'fune de ikimasu.', meaning: 'I go by boat.' },
        }),
      ],
      culture: [
        {
          title: 'Shrines vs temples',
          body: 'Jinja (shrines) are Shinto — torii gates, ema plaques, purification fountains. Otera (temples) are Buddhist — pagodas, incense, sutras. Both are free to enter; the experience is completely different.',
        },
        {
          title: 'Book ahead for shinkansen',
          body: 'The bullet train (shinkansen) connects Tokyo-Osaka-Kyoto in hours. Reserved seats sell out — book online or at the station before your trip. "Katamichi" = one-way, "oufuku" = round-trip.',
        },
      ],
    },
  ],
};
