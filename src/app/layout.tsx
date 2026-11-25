import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { getDueCount } from '@/lib/data';
import { IconBook, IconChart, IconChat, IconPen, IconRefresh, IconUser, IconVideo, IconZap } from '@/components/icons';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tabi — Learn Japanese for Travel',
  description: 'A Japanese learning app for travelers: hiragana, katakana, survival phrases, and a spaced-repetition deck.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const due = await getDueCount();

  return (
    <html lang="en">
      <body>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />

        <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-vermilion text-lg font-extrabold text-white">
                旅
              </span>
              <span className="leading-tight">
                <span className="block text-base font-extrabold tracking-tight">Tabi</span>
                <span className="block text-[11px] font-semibold text-ink-soft">
                  Japanese for travel
                </span>
              </span>
            </Link>

            <nav className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/learn"
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold text-ink-soft transition hover:bg-cream hover:text-ink"
              >
                <IconBook width={18} height={18} />
                <span className="hidden sm:inline">Learn</span>
              </Link>
              <Link
                href="/write"
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold text-ink-soft transition hover:bg-cream hover:text-ink"
              >
                <IconPen width={18} height={18} />
                <span className="hidden sm:inline">Write</span>
              </Link>
              <Link
                href="/watch"
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold text-ink-soft transition hover:bg-cream hover:text-ink"
              >
                <IconVideo width={18} height={18} />
                <span className="hidden sm:inline">Watch</span>
              </Link>
              <Link
                href="/review"
                className="relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold text-ink-soft transition hover:bg-cream hover:text-ink"
              >
                <IconRefresh width={18} height={18} />
                <span className="hidden sm:inline">Review</span>
                {due > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-vermilion px-1 text-[11px] font-extrabold text-white">
                    {due > 99 ? '99+' : due}
                  </span>
                )}
              </Link>
              <Link
                href="/dialogues"
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold text-ink-soft transition hover:bg-cream hover:text-ink"
              >
                <IconChat width={18} height={18} />
                <span className="hidden sm:inline">Talk</span>
              </Link>
              <Link
                href="/trip"
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold text-ink-soft transition hover:bg-cream hover:text-ink"
              >
                <IconZap width={18} height={18} />
                <span className="hidden sm:inline">Trip</span>
              </Link>
              <Link
                href="/stats"
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold text-ink-soft transition hover:bg-cream hover:text-ink"
              >
                <IconChart width={18} height={18} />
                <span className="hidden sm:inline">Stats</span>
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold text-ink-soft transition hover:bg-cream hover:text-ink"
              >
                <IconUser width={18} height={18} />
                <span className="hidden sm:inline">Profile</span>
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-8">{children}</main>

        <footer className="border-t border-line py-6">
          <p className="text-center text-xs text-ink-soft">
            Tabi · Learn Japanese for your trip · 旅を楽しんで
          </p>
        </footer>
      </body>
    </html>
  );
}
