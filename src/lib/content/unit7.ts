import type { UnitDraft } from '../types';
import { v } from './helpers';

export const unit7: UnitDraft = {
  id: 'u7',
  order: 7,
  title: 'Kanji for Travelers',
  subtitle: 'Read the signs, skip the confusion',
  description:
    'You do not need to write kanji for your trip — you need to recognize them. These are the ~40 characters that appear on stations, menus, doors and warnings all over Japan. Spot them and the country opens up.',
  lessons: [
    {
      id: 'u7-l1',
      title: 'Signs everywhere — doors, exits & warnings',
      subtitle: 'The kanji that tell you where you can go',
      description:
        'Stations and shops are covered in the same dozen kanji. Learn to spot entrance, exit, open and closed — and the warnings you should actually respect.',
      focus: 'vocab',
      vocab: [
        v('eki', '駅', 'eki', 'station', {
          note: 'The single most useful kanji in Japan — on every station sign',
        }),
        v('deguchi', '出口', 'deguchi', 'exit', {
          note: '出 = goes out — look for it when leaving any building or station',
        }),
        v('iriguchi', '入口', 'iriguchi', 'entrance', {
          note: '入 = goes in — pairs with 出口 on every doorway',
        }),
        v('kaisatsu', '改札', 'kaisatsu', 'ticket gate', {
          note: 'The IC/ticket barrier at stations — staff say "kaisatsu"',
        }),
        v('honjitsu', '本日', 'honjitsu', 'today', {
          note: 'On shop signs: 本日休業 = closed today',
        }),
        v('kyuugyou', '休業', 'kyuugyou', 'closed (business)', {
          note: 'Rest day sign — the place is shut',
        }),
        v('eigyouchuu', '営業中', 'eigyouchuu', 'open (business)', {
          noType: true,
          note: 'The opposite of 休業 — come on in',
        }),
        v('muryou', '無料', 'muryou', 'free (no charge)', {
          note: 'Good word to spot — free entry, free Wi-Fi',
        }),
        v('yuuryou', '有料', 'yuuryou', 'paid / fee required', {
          note: 'Opposite of 無料 — there is a charge',
        }),
        v('kinen', '禁煙', "kin'en", 'no smoking', {
          note: 'On restaurants and platforms — 禁 means "prohibited"',
        }),
        v('tachiirikinshi', '立入禁止', 'tachiirikinshi', 'no entry / keep out', {
          noType: true,
          note: 'Strong warning — do not go past this sign',
        }),
        v('kiken', '危険', 'kiken', 'danger', {
          note: 'Serious warning — on construction, tracks, cliffs',
        }),
        v('chuui', '注意', 'chuui', 'caution / attention', {
          note: 'Mind the gap, mind the step — often on yellow signs',
        }),
        v('hijouguchi', '非常口', 'hijouguchi', 'emergency exit', {
          noType: true,
          note: 'Green running-man signs in every building',
        }),
      ],
      culture: [
        {
          title: 'Kanji are signposts, not puzzles',
          body: 'Japanese is written in kanji + kana, but travelers only need kanji recognition. You will never be asked to write 駅 — you just need to spot it from across the platform.',
        },
        {
          title: 'Out and in',
          body: '出 (out) and 入 (in) are everywhere: 出口/入口 on doors, 出前 (delivery), 入場 (admission). Learn the shapes once and doors stop being ambiguous.',
        },
      ],
    },
    {
      id: 'u7-l2',
      title: 'Food, shops & services',
      subtitle: 'Menus and storefronts make sense',
      description:
        'Menus flash kanji at you before the waiter arrives. Meat, fish, water, sake — plus the shops you will actually hunt for: banks, pharmacies, diners.',
      focus: 'vocab',
      vocab: [
        v('niku', '肉', 'niku', 'meat', {
          note: 'On menus — 肉料理 = meat dishes',
        }),
        v('sakana', '魚', 'sakana', 'fish', {
          note: 'Fish character — market stalls, menus',
        }),
        v('gyuu', '牛', 'gyuu / ushi', 'beef / cow', {
          alt: ['gyu', 'ushi'],
          note: 'Beef bowls 牛丼 (gyuudon), wagyu 和牛',
        }),
        v('buta', '豚', 'buta / ton', 'pork', {
          alt: ['buta', 'ton'],
          note: 'Tonkatsu 豚カツ, tonkotsu ramen 豚骨',
        }),
        v('tori', '鶏', 'tori', 'chicken', {
          note: 'Yakitori 焼き鳥 — grilled chicken skewers',
        }),
        v('kome', '米', 'kome', 'rice (grain)', {
          note: 'Rice sacks, menus — cooked rice is ご飯 (gohan)',
        }),
        v('mizu', '水', 'mizu', 'water', {
          note: 'お水 omizu at restaurants — same shape as 氷 (ice) minus a stroke',
        }),
        v('sake', '酒', 'sake', 'alcohol / sake', {
          note: 'On izakaya signs — also means alcohol generally',
        }),
        v('cha', '茶', 'cha', 'tea', {
          note: 'お茶 ocha — green tea, tea shops',
        }),
        v('mise', '店', 'mise', 'shop / store', {
          note: 'Ends most shop names: 本店 (main branch), 喫茶店 (cafe)',
        }),
        v('shokudou', '食堂', 'shokudou', 'diner / canteen', {
          note: 'Cheap, hearty local eateries — look for this word',
        }),
        v('ginkou', '銀行', 'ginkou', 'bank', {
          note: '銀 = silver — ATM locations',
        }),
        v('yakkyoku', '薬局', 'yakkyoku', 'pharmacy', {
          note: 'Where you actually get medicine — drugstores are ドラッグストア',
        }),
        v('hon', '本', 'hon', 'book / origin', {
          note: 'Japan is 日本 (nihon) — "sun origin". Bookshops are 本屋 (honya)',
        }),
      ],
      culture: [
        {
          title: 'Men, women, toilets',
          body: 'Toilets are marked 男 (otoko, man) and 女 (onna, woman) — the two kanji you really cannot mix up. Sometimes colored: blue for men, red for women.',
        },
        {
          title: 'Shop name cheat codes',
          body: 'Almost every store ends in a predictable suffix: -屋 (-ya: bookstore 本屋, florist 花屋), -店 (-ten: restaurant 飲食店), -食堂 (shokudou: diner). Spot the suffix, know the shop.',
        },
      ],
    },
    {
      id: 'u7-l3',
      title: 'Directions & getting around',
      subtitle: 'East, west, big, small — and the yen',
      description:
        'Station exits are numbered, directions are cardinal, and prices are in 円. These kanji turn the subway map from noise into navigation.',
      focus: 'vocab',
      vocab: [
        v('higashi', '東', 'higashi', 'east', {
          note: 'Tokyo 東京 = "eastern capital" — also station-exit signs',
        }),
        v('nishi', '西', 'nishi', 'west', {
          note: '西口 = west exit',
        }),
        v('minami', '南', 'minami', 'south', {
          note: '南口 = south exit',
        }),
        v('kita', '北', 'kita', 'north', {
          note: '北口 = north exit — learn all four and stations get easy',
        }),
        v('hidari', '左', 'hidari', 'left', {
          note: 'Directions: 左に曲がる = turn left',
        }),
        v('migi', '右', 'migi', 'right', {
          note: '右に曲がる = turn right',
        }),
        v('ue', '上', 'ue', 'up / above', {
          note: '上野 Ueno, upper floors 上階',
        }),
        v('shita', '下', 'shita', 'down / below', {
          note: '下車 = get off (a vehicle)',
        }),
        v('oo', '大', 'oo / dai', 'big', {
          alt: ['o', 'dai'],
          note: '大きい (ookii) — sizes, 大満足 = very satisfied',
        }),
        v('ko', '小', 'ko / shou', 'small', {
          alt: ['ko', 'sho'],
          note: '小さい (chiisai) — menu sizes 大/小',
        }),
        v('mae', '前', 'mae', 'front / before', {
          note: '駅前 = "in front of the station" — a whole neighborhood category',
        }),
        v('ato', '後', 'ato / ushiro', 'after / behind', {
          alt: ['ato', 'ushiro'],
          note: '10分後 = in 10 minutes — useful in train announcements',
        }),
        v('naka', '中', 'naka', 'inside / middle', {
          note: '車内 = inside the train, 営業中 = open (in-business)',
        }),
        v('soto', '外', 'soto', 'outside', {
          note: '外食 = eating out',
        }),
        v('shin', '新', 'shin / atarashii', 'new', {
          alt: ['shin', 'atarashi'],
          note: '新大阪 Shin-Osaka (bullet-train station), 新宿 Shinjuku',
        }),
        v('en', '円', 'en', 'yen', {
          note: 'Prices end in 円 — ¥3,000 = 三千円. Also means "circle"',
        }),
      ],
      culture: [
        {
          title: 'Exit numbers matter',
          body: 'Big stations have dozens of exits marked 東口/西口/南口/北口 or A1–A12. Meeting "outside the station" means nothing — agree on the exit kanji.',
        },
        {
          title: 'Shin- means new',
          body: 'Shinkansen 新幹線 = "new trunk line". 新 appears in city names (Shinjuku 新宿, Shin-Osaka 新大阪) — usually marking the newer part of town or the bullet-train stop.',
        },
      ],
    },
  ],
};
