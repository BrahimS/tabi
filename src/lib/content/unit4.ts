import type { UnitDraft } from '../types';
import { v } from './helpers';

export const unit4: UnitDraft = {
  id: 'u4',
  order: 4,
  title: 'Eating & Drinking',
  subtitle: 'Restaurants, food words & table manners',
  description:
    'Food is where travel in Japan becomes unforgettable — and where a few phrases earn you genuine smiles. Learn the ordering kit and the words for everything on the menu.',
  lessons: [
    {
      id: 'u4-l1',
      title: 'At the restaurant — ordering & paying',
      subtitle: 'Menus, water & the check',
      description:
        'Walk into any restaurant in Japan and use these phrases: point at the menu, order with ください, ask for the check. You will eat like a local within your first meal.',
      focus: 'vocab',
      vocab: [
        v('irasshaimase', 'いらっしゃいませ', 'irasshaimase', 'welcome! (what staff say)', {
          tag: 'phrase',
          note: 'Staff greet every customer with this — you never say it back',
        }),
        v('kore', 'これ', 'kore', 'this one (near me)', {
          tag: 'word',
          example: { kana: 'これはいくらですか。', romaji: 'kore wa ikura desu ka.', meaning: 'How much is this?' },
        }),
        v('sore', 'それ', 'sore', 'that one (near you)', {
          tag: 'word',
          example: { kana: 'それをください。', romaji: 'sore o kudasai.', meaning: 'That one, please.' },
        }),
        v('are', 'あれ', 'are', 'that one over there', {
          tag: 'word',
          example: { kana: 'あれはなんですか。', romaji: 'are wa nan desu ka.', meaning: 'What is that over there?' },
        }),
        v('o-kudasai', 'Nをください', 'N o kudasai', 'please give me N', {
          tag: 'phrase',
          note: 'The most useful ordering pattern: [item] o kudasai',
          noType: true,
          example: { kana: 'コーヒーをください。', romaji: 'koohii o kudasai.', meaning: 'Coffee, please.' },
        }),
        v('mizu', 'みず', 'mizu', 'water', {
          tag: 'food',
          example: { kana: 'みずをください。', romaji: 'mizu o kudasai.', meaning: 'Water, please.' },
        }),
        v('ohiya', 'おひや', 'ohiya', 'cold water (free at restaurants)', {
          tag: 'food',
          note: 'Restaurants serve free cold water — ask for it by name',
        }),
        v('oatsu', 'おあつ', 'oatsu', 'hot water / hot tea', {
          tag: 'food',
          note: 'Often served free as hot water or tea',
        }),
        v('ocha', 'おちゃ', 'ocha', 'tea (usually green)', {
          tag: 'food',
          example: { kana: 'おちゃをください。', romaji: 'ocha o kudasai.', meaning: 'Tea, please.' },
        }),
        v('osake', 'おさけ', 'osake', 'alcohol / sake', {
          tag: 'food',
          example: { kana: 'おさけをのみます。', romaji: 'osake o nomimasu.', meaning: 'I drink alcohol.' },
        }),
        v('okaikei', 'おかいけい', 'okaikei', 'the bill / check', {
          tag: 'phrase',
          example: { kana: 'おかいけいをおねがいします。', romaji: 'okaikei o onegaishimasu.', meaning: 'The check, please.' },
        }),
        v('itadakimasu', 'いただきます', 'itadakimasu', 'said before eating — "I humbly receive"', {
          tag: 'phrase',
          note: 'Also used before receiving anything — it expresses gratitude',
          example: { kana: 'いただきます。', romaji: 'itadakimasu.', meaning: 'Let’s eat.' },
        }),
        v('gochisousama', 'ごちそうさま', 'gochisousama', 'said after eating — thanks for the meal', {
          tag: 'phrase',
          note: 'Full form: gochisousama deshita',
          example: { kana: 'ごちそうさまでした。', romaji: 'gochisousama deshita.', meaning: 'Thank you for the meal.' },
        }),
      ],
      culture: [
        {
          title: 'The meal ritual',
          body: 'Say いただきます before your first bite and ごちそうさま after — it shows gratitude to the cook, the farmers, and everyone who made the meal possible. Staff will notice and appreciate it.',
        },
        {
          title: 'No tipping, ever',
          body: 'Tipping is not just unnecessary in Japan — it can cause confusion. Service charges are included in the price. If you want to round up, say "gochisosama" with a smile instead.',
        },
      ],
    },
    {
      id: 'u4-l2',
      title: 'Japanese food words',
      subtitle: 'Everything on the menu',
      description:
        'From ramen to onigiri, these are the words you will see on every menu, convenience store shelf and food stall in Japan.',
      focus: 'vocab',
      vocab: [
        v('gohan', 'ごはん', 'gohan', 'rice; a meal', {
          tag: 'food',
          note: '"Gohan" means both cooked rice and "a meal" — context decides',
          example: { kana: 'ごはんをたべます。', romaji: 'gohan o tabemasu.', meaning: 'I eat a meal.' },
        }),
        v('raamen', 'ラーメン', 'raamen', 'ramen', { tag: 'food' }),
        v('sushi', 'すし', 'sushi', 'sushi', { tag: 'food' }),
        v('tempura', 'てんぷら', 'tempura', 'tempura', { tag: 'food' }),
        v('karee', 'カレー', 'karee', 'curry rice', { tag: 'food' }),
        v('bentou', 'べんとう', 'bentou', 'boxed lunch', {
          tag: 'food',
          example: { kana: 'えきでべんとうをかいます。', romaji: 'eki de bentou o kaimasu.', meaning: 'I buy a bento at the station.' },
        }),
        v('onigiri', 'おにぎり', 'onigiri', 'rice ball', {
          tag: 'food',
          note: 'Sold at every konbini — tuna, salmon, ume (pickled plum)',
        }),
        v('udon', 'うどん', 'udon', 'udon noodles', { tag: 'food' }),
        v('soba', 'そば', 'soba', 'soba noodles / buckwheat', { tag: 'food' }),
        v('niku', 'にく', 'niku', 'meat', {
          tag: 'food',
          example: { kana: 'にくはたべません。', romaji: 'niku wa tabemasen.', meaning: 'I don’t eat meat.' },
        }),
        v('sakana', 'さかな', 'sakana', 'fish', {
          tag: 'food',
          example: { kana: 'さかなはすきです。', romaji: 'sakana wa suki desu.', meaning: 'I like fish.' },
        }),
        v('yasai', 'やさい', 'yasai', 'vegetables', {
          tag: 'food',
          example: { kana: 'やさいをたべます。', romaji: 'yasai o tabemasu.', meaning: 'I eat vegetables.' },
        }),
        v('tamago', 'たまご', 'tamago', 'egg', {
          tag: 'food',
          example: { kana: 'たまごをください。', romaji: 'tamago o kudasai.', meaning: 'An egg, please.' },
        }),
        v('toufu', 'とうふ', 'toufu', 'tofu', {
          tag: 'food',
          example: { kana: 'とうふはやすいです。', romaji: 'toufu wa yasui desu.', meaning: 'Tofu is cheap.' },
        }),
        v('misoshiru', 'みそしる', 'misoshiru', 'miso soup', {
          tag: 'food',
          example: { kana: 'みそしるはあついです。', romaji: 'misoshiru wa atsui desu.', meaning: 'Miso soup is hot.' },
        }),
        v('nihonshu', 'にほんしゅ', 'nihonshu', 'sake / Japanese alcohol', {
          tag: 'food',
          example: { kana: 'にほんしゅをのみます。', romaji: 'nihonshu o nomimasu.', meaning: 'I drink sake.' },
        }),
        v('wain', 'ワイン', 'wain', 'wine', { tag: 'food' }),
      ],
      culture: [
        {
          title: 'Rice is life',
          body: '"Gohan" means both rice and a meal — you eat rice with almost everything. Breakfast sets (morning sets) at hotels and kissaten (coffee shops) are a Japanese institution.',
        },
        {
          title: 'Konbini food is serious',
          body: 'Onigiri, bento boxes, egg sandwiches, oden — convenience stores sell restaurant-quality food at konbini prices. Many travelers eat entire trips on konbini fare and never complain.',
        },
      ],
    },
    {
      id: 'u4-l3',
      title: 'At the table — tastes, allergies & the bill',
      subtitle: 'Spicy, sweet, full & everything else',
      description:
        'Navigate menus with confidence: describe tastes, handle allergies, ask for seconds, and signal when you are done — the final phrases for a perfect meal.',
      focus: 'vocab',
      vocab: [
        v('kanpai', 'かんぱい', 'kanpai', 'cheers!', {
          tag: 'phrase',
          example: { kana: 'かんぱい！', romaji: 'kanpai!', meaning: 'Cheers!' },
        }),
        v('oishii', 'おいしい', 'oishii', 'delicious', {
          tag: 'adjective',
          example: { kana: 'このラーメンはおいしいです。', romaji: 'kono raamen wa oishii desu.', meaning: 'This ramen is delicious.' },
        }),
        v('karai', 'からい', 'karai', 'spicy', {
          tag: 'adjective',
          note: 'Japanese "karai" is often much hotter than expected — start mild',
          example: { kana: 'このカレーはからいです。', romaji: 'kono karee wa karai desu.', meaning: 'This curry is spicy.' },
        }),
        v('amai', 'あまい', 'amai', 'sweet', {
          tag: 'adjective',
          example: { kana: 'このケーキはあまいです。', romaji: 'kono keeki wa amai desu.', meaning: 'This cake is sweet.' },
        }),
        v('shio', 'しお', 'shio', 'salt', {
          tag: 'food',
          example: { kana: 'しおをください。', romaji: 'shio o kudasai.', meaning: 'Salt, please.' },
        }),
        v('koshou', 'こしょう', 'koshou', 'pepper', {
          tag: 'food',
          example: { kana: 'こしょうをいれますか。', romaji: 'koshou o iremasu ka.', meaning: 'Shall I add pepper?' },
        }),
        v('mou-hitotsu', 'もうひとつ', 'mou hitotsu', 'one more (please)', {
          tag: 'phrase',
          example: { kana: 'もうひとつください。', romaji: 'mou hitotsu kudasai.', meaning: 'One more, please.' },
        }),
        v('okawari', 'おかわり', 'okawari', 'refill / seconds', {
          tag: 'word',
          example: { kana: 'おかわりできますか。', romaji: 'okawari dekimasu ka.', meaning: 'Can I get a refill?' },
        }),
        v('onaka-sukimashita', 'おなかがすきました', 'onaka ga sukimashita', 'I’m hungry', {
          tag: 'phrase',
          example: { kana: 'おなかがすきました。', romaji: 'onaka ga sukimashita.', meaning: 'I’m hungry.' },
        }),
        v('onaka-ippai', 'おなかいっぱい', 'onaka ippai', 'I’m full', {
          tag: 'phrase',
          example: { kana: 'おなかいっぱいです。', romaji: 'onaka ippai desu.', meaning: 'I’m full.' },
        }),
        v('oishikatta', 'おいしかったです', 'oishikatta desu', 'it was delicious', {
          tag: 'phrase',
          example: { kana: 'とてもおいしかったです。', romaji: 'totemo oishikatta desu.', meaning: 'It was very delicious.' },
        }),
        v('arerugii', 'アレルギーがあります', 'arerugii ga arimasu', 'I have an allergy', {
          tag: 'phrase',
          note: 'Say this before ordering — staff take allergies seriously',
          example: { kana: 'アレルギーがあります。えびはだめです。', romaji: 'arerugii ga arimasu. ebi wa dame desu.', meaning: 'I have an allergy. Shrimp is no good.' },
        }),
      ],
      culture: [
        {
          title: 'Allergies are taken seriously',
          body: 'Japan has high rates of seafood and gluten-free awareness, but many dishes contain hidden ingredients (dashi, soy sauce). If you have allergies, say アレルギーがあります early and clearly.',
        },
        {
          title: 'Slurping is a compliment',
          body: 'Slurping noodles loudly is not rude — it shows you are enjoying the meal. Chewing with your mouth closed, however, is appreciated everywhere.',
        },
      ],
    },
  ],
};
