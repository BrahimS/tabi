import { TripSession } from '@/components/TripSession';

export const dynamic = 'force-dynamic';

export default function TripPage() {
  return (
    <div>
      <header className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight">Trip mode</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Rapid-fire survival drill — pick a scenario, beat the clock, find your weak spots
          before you fly.
        </p>
      </header>
      <div className="mt-8">
        <TripSession />
      </div>
    </div>
  );
}
