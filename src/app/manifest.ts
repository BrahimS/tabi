import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tabi — Learn Japanese for Travel',
    short_name: 'Tabi',
    description:
      'Hiragana, katakana, kanji signs, survival phrases, writing practice and dialogues — built for your trip to Japan.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f6f1e7',
    theme_color: '#c2402a',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
