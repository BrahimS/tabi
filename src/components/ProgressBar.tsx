export function ProgressBar({
  value,
  max,
  className = '',
  tone = 'bg-vermilion',
}: {
  value: number;
  max: number;
  className?: string;
  tone?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-cream ${className}`}>
      <div className={`h-full rounded-full transition-all ${tone}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
