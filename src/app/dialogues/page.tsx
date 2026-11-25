import { DialogueHub } from '@/components/DialogueHub';
import { getDialogueStates } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default function DialoguesPage() {
  const states = Object.fromEntries(getDialogueStates());
  return (
    <div>
      <header className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight">Scenario dialogues</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Scripted conversations for the moments you&apos;ll actually face — pick your replies,
          learn from the corrections.
        </p>
      </header>
      <div className="mt-8">
        <DialogueHub states={states} />
      </div>
    </div>
  );
}
