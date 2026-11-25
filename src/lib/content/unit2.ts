import type { UnitDraft } from '../types';
import { v } from './helpers';

export const unit2: UnitDraft = {
  id: 'u2',
  order: 2,
  title: 'Hello & Courtesy',
  subtitle: 'Greetings, politeness particles & tiny sentences',
  description:
    'The survival kit for every interaction: saying hello, thank you, sorry, yes and no — plus the grammar particles that make Japanese sentences work.',
  lessons: [
    {
      id: 'u2-l1',
      title: 'Greetings & everyday courtesies',
      subtitle: 'Hello, thank you, sorry, yes, no',
      description:
        'These phrases open every conversation in Japan — from shopkeepers to strangers on the train. Learn them until they are automatic.',
      focus: 'vocab',
      vocab: [
        v('konnichiwa', 'こんにちは', 'konnichiwa', 'hello (daytime)', {
          tag: 'greeting',
          note: 'Literally "are you at peace?" — used roughly 10am–5pm',
          example: { kana: 'こんにちは。きょうはいいてんきですね。', romaji: 'konnichiwa. kyou wa ii tenki desu ne.', meaning: 'Hello. Nice weather today, isn’t it?' },
        }),
        v('konbanwa', 'こんばんは', 'konbanwa', 'good evening', {
          tag: 'greeting',
          example: { kana: 'こんばんは。おつかれさまです。', romaji: 'konbanwa. otsukaresama desu.', meaning: 'Good evening. Thanks for your hard work.' },
        }),
        v('ohayou', 'おはようございます', 'ohayou gozaimasu', 'good morning (polite)', {
          tag: 'greeting',
          alt: ['ohayo'],
          example: { kana: 'おはようございます。', romaji: 'ohayou gozaimasu.', meaning: 'Good morning.' },
        }),
        v('arigatou', 'ありがとう', 'arigatou', 'thank you (casual)', {
          tag: 'greeting',
          alt: ['arigato'],
          example: { kana: 'ありがとう！たすかったよ。', romaji: 'arigatou! tasukatta yo.', meaning: 'Thanks! You saved me.' },
        }),
        v('arigatou-gozaimasu', 'ありがとうございます', 'arigatou gozaimasu', 'thank you (polite)', {
          tag: 'greeting',
          alt: ['arigato gozaimasu'],
          example: { kana: 'ありがとうございます。とてもおいしかったです。', romaji: 'arigatou gozaimasu. totemo oishikatta desu.', meaning: 'Thank you very much. It was delicious.' },
        }),
        v('sumimasen', 'すみません', 'sumimasen', 'excuse me / sorry', {
          tag: 'greeting',
          example: { kana: 'すみません、トイレはどこですか。', romaji: 'sumimasen, toire wa doko desu ka.', meaning: 'Excuse me, where is the toilet?' },
        }),
        v('gomennasai', 'ごめんなさい', 'gomennasai', 'I’m sorry (apology)', {
          tag: 'greeting',
          alt: ['gomen nasai'],
          example: { kana: 'ごめんなさい。まちがえました。', romaji: 'gomennasai. machigaemashita.', meaning: 'I’m sorry. I made a mistake.' },
        }),
        v('hai', 'はい', 'hai', 'yes', {
          tag: 'greeting',
          note: 'Also used to say "here you go" when handing something over',
        }),
        v('iie', 'いいえ', 'iie', 'no', {
          tag: 'greeting',
          example: { kana: 'いいえ、けっこうです。', romaji: 'iie, kekkou desu.', meaning: 'No, I’m fine.' },
        }),
        v('hajimemashite', 'はじめまして', 'hajimemashite', 'nice to meet you (first meeting)', {
          tag: 'greeting',
          example: { kana: 'はじめまして。たなかです。', romaji: 'hajimemashite. tanaka desu.', meaning: 'Nice to meet you. I’m Tanaka.' },
        }),
        v('sayounara', 'さようなら', 'sayounara', 'goodbye', {
          tag: 'greeting',
          example: { kana: 'さようなら。またあした。', romaji: 'sayounara. mata ashita.', meaning: 'Goodbye. See you tomorrow.' },
        }),
        v('onegaishimasu', 'おねがいします', 'onegaishimasu', 'please (when requesting)', {
          tag: 'greeting',
          alt: ['onegai shimasu'],
          note: 'Said when ordering, asking favors, or starting work',
          example: { kana: 'これをおねがいします。', romaji: 'kore o onegaishimasu.', meaning: 'This one, please.' },
        }),
      ],
      culture: [
        {
          title: 'One word covers everything',
          body: 'すみません is the Swiss Army knife of Japanese: "excuse me", "sorry", "thank you" (for small favors), and a polite attention-getter. When in doubt, say sumimasen.',
        },
        {
          title: 'The bow is real',
          body: 'A slight bow accompanies most greetings and thanks — 15 degrees for casual, 30 for respect. As a visitor, a small nod with your greeting is always appreciated.',
        },
      ],
    },
    {
      id: 'u2-l2',
      title: 'Politeness toolkit — です/ます & particles',
      subtitle: 'The grammar glue of Japanese',
      description:
        'Japanese sentences don’t use word order like English — particles mark each word’s job. Master these tiny words and you can build real sentences immediately.',
      focus: 'vocab',
      vocab: [
        v('desu', 'です', 'desu', 'polite "is/am/are" — X desu = "it is X"', {
          tag: 'grammar',
          example: { kana: 'わたしはがくせいです。', romaji: 'watashi wa gakusei desu.', meaning: 'I am a student.' },
        }),
        v('masu', 'ます', 'masu', 'polite verb ending — tabemasu = "eat"', {
          tag: 'grammar',
          note: 'Attach to verb stems: nomi-masu, iki-masu, mi-masu',
          example: { kana: 'まいにちパンをたべます。', romaji: 'mainichi pan o tabemasu.', meaning: 'I eat bread every day.' },
        }),
        v('wa', 'は', 'wa', 'topic marker — "as for…"', {
          tag: 'particle',
          note: 'Written は but pronounced "wa" — the #1 learner trap',
          example: { kana: 'にほんはすきです。', romaji: 'nihon wa suki desu.', meaning: 'As for Japan — I like it.' },
        }),
        v('ga', 'が', 'ga', 'subject marker / "but"', {
          tag: 'particle',
          example: { kana: 'ねこがすきです。', romaji: 'neko ga suki desu.', meaning: 'I like cats.' },
        }),
        v('o', 'を', 'o', 'object marker — marks what receives the action', {
          tag: 'particle',
          note: 'Written を but pronounced "o"',
          example: { kana: 'コーヒーをのみます。', romaji: 'koohii o nomimasu.', meaning: 'I drink coffee.' },
        }),
        v('ni', 'に', 'ni', 'to / at / in — direction, time, target', {
          tag: 'particle',
          example: { kana: 'えきにいきます。', romaji: 'eki ni ikimasu.', meaning: 'I go to the station.' },
        }),
        v('de', 'で', 'de', 'at / by / with — place or means', {
          tag: 'particle',
          example: { kana: 'バスでいきます。', romaji: 'basu de ikimasu.', meaning: 'I go by bus.' },
        }),
        v('e', 'へ', 'e', 'to / towards', {
          tag: 'particle',
          note: 'Written へ but pronounced "e" — another famous trap',
          example: { kana: 'にほんへいきます。', romaji: 'nihon e ikimasu.', meaning: 'I am going to Japan.' },
        }),
        v('mo', 'も', 'mo', 'also / too', {
          tag: 'particle',
          example: { kana: 'わたしもいきます。', romaji: 'watashi mo ikimasu.', meaning: 'I am going too.' },
        }),
        v('no', 'の', 'no', 'possessive "of" / softens questions', {
          tag: 'particle',
          example: { kana: 'たなかさんのかさです。', romaji: 'tanaka san no kasa desu.', meaning: 'It is Tanaka’s umbrella.' },
        }),
        v('ka', 'か', 'ka', 'question marker — turns a sentence into a question', {
          tag: 'particle',
          example: { kana: 'これはなんですか。', romaji: 'kore wa nan desu ka.', meaning: 'What is this?' },
        }),
        v('ne', 'ね', 'ne', 'softener — "…, right?"', {
          tag: 'particle',
          example: { kana: 'いいてんきですね。', romaji: 'ii tenki desu ne.', meaning: 'Nice weather, isn’t it?' },
        }),
        v('yo', 'よ', 'yo', 'emphasis — "you know / I tell you"', {
          tag: 'particle',
          example: { kana: 'まもなくでますよ。', romaji: 'mamonaku demasu yo.', meaning: 'It leaves soon, you know.' },
        }),
        v('chotto', 'ちょっと', 'chotto', 'a little; also "excuse me" to get attention', {
          tag: 'word',
          example: { kana: 'ちょっとまってください。', romaji: 'chotto matte kudasai.', meaning: 'Please wait a moment.' },
        }),
      ],
      culture: [
        {
          title: 'Particles are signposts',
          body: 'は, が, を, に, で, へ, も are tiny words that mark each word’s job — like road signs for grammar. Learn them and sentences stop being word salad.',
        },
        {
          title: 'The は/へ/を pronunciation trap',
          body: 'Three particles are written with vowel letters but pronounced differently: は→"wa", へ→"e", を→"o". You will see this trap in every textbook — now you have seen it first.',
        },
      ],
    },
    {
      id: 'u2-l3',
      title: 'Introducing yourself',
      subtitle: 'I, you, Japan & simple verbs',
      description:
        'Combine です/ます with a handful of words and you can introduce yourself, say where you are from, and talk about daily basics — the X は Y です pattern is your first real sentence builder.',
      focus: 'vocab',
      vocab: [
        v('watashi', 'わたし', 'watashi', 'I / me', {
          tag: 'pronoun',
          example: { kana: 'わたしはアメリカじんです。', romaji: 'watashi wa amerika jin desu.', meaning: 'I am American.' },
        }),
        v('namae', 'なまえ', 'namae', 'name', {
          tag: 'noun',
          example: { kana: 'なまえはなんですか。', romaji: 'namae wa nan desu ka.', meaning: 'What is your name?' },
        }),
        v('nihon', 'にほん', 'nihon', 'Japan', {
          tag: 'place',
          example: { kana: 'にほんはすきです。', romaji: 'nihon wa suki desu.', meaning: 'I like Japan.' },
        }),
        v('nihongo', 'にほんご', 'nihongo', 'Japanese (language)', {
          tag: 'noun',
          example: { kana: 'にほんごをべんきょうします。', romaji: 'nihongo o benkyou shimasu.', meaning: 'I study Japanese.' },
        }),
        v('eigo', 'えいご', 'eigo', 'English', {
          tag: 'noun',
          example: { kana: 'えいごがすこしわかります。', romaji: 'eigo ga sukoshi wakarimasu.', meaning: 'I understand a little English.' },
        }),
        v('kimasu', 'きます', 'kimasu', 'to come', {
          tag: 'verb',
          note: 'Polite form of kuru — きます/きません/きました',
          example: { kana: 'ともだちがきます。', romaji: 'tomodachi ga kimasu.', meaning: 'A friend is coming.' },
        }),
        v('ikimasu', 'いきます', 'ikimasu', 'to go', {
          tag: 'verb',
          note: 'Polite form of iku — いきます/いきません/いきました',
          example: { kana: 'えきへいきます。', romaji: 'eki e ikimasu.', meaning: 'I go to the station.' },
        }),
        v('tabemasu', 'たべます', 'tabemasu', 'to eat', {
          tag: 'verb',
          example: { kana: 'パンをたべます。', romaji: 'pan o tabemasu.', meaning: 'I eat bread.' },
        }),
        v('nomimasu', 'のみます', 'nomimasu', 'to drink', {
          tag: 'verb',
          example: { kana: 'おちゃをのみます。', romaji: 'ocha o nomimasu.', meaning: 'I drink tea.' },
        }),
        v('mimasu', 'みます', 'mimasu', 'to see / watch', {
          tag: 'verb',
          example: { kana: 'にほんのテレビをみます。', romaji: 'nihon no terebi o mimasu.', meaning: 'I watch Japanese TV.' },
        }),
        v('daijoubu', 'だいじょうぶです', 'daijoubu desu', 'it’s okay / I’m fine', {
          tag: 'phrase',
          example: { kana: 'だいじょうぶです。ありがとう。', romaji: 'daijoubu desu. arigatou.', meaning: 'I’m fine. Thanks.' },
        }),
        v('wakarimashita', 'わかりました', 'wakarimashita', 'I understood', {
          tag: 'phrase',
          example: { kana: 'わかりました。ありがとう。', romaji: 'wakarimashita. arigatou.', meaning: 'Got it. Thank you.' },
        }),
        v('wakarimasen', 'わかりません', 'wakarimasen', 'I don’t understand', {
          tag: 'phrase',
          example: { kana: 'すみません、わかりません。', romaji: 'sumimasen, wakarimasen.', meaning: 'Sorry, I don’t understand.' },
        }),
        v('sukoshi', 'すこし', 'sukoshi', 'a little', {
          tag: 'word',
          example: { kana: 'にほんごがすこしできます。', romaji: 'nihongo ga sukoshi dekimasu.', meaning: 'I can speak a little Japanese.' },
        }),
      ],
      culture: [
        {
          title: 'The X は Y です pattern',
          body: 'This is the most useful sentence pattern in Japanese: [topic] は [description] です. "Watashi wa Tanaka desu" = "I am Tanaka". Swap in any noun — you can now describe anything.',
        },
        {
          title: 'Polite verbs end in -masu',
          body: 'Every verb you learn will have a polite -masu form: ikimasu (go), kimasu (come), tabemasu (eat), nomimasu (drink). Negative is -masen, past is -mashita — regular and forgiving.',
        },
      ],
    },
  ],
};
