'use client';

import { useRef, useState } from 'react';
import { exportBackup, importBackup } from '@/lib/actions';
import { useRouter } from 'next/navigation';

export function BackupPanel() {
  const [busy, setBusy] = useState<'export' | 'import' | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleExport() {
    setBusy('export');
    setMessage(null);
    try {
      const json = await exportBackup();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tabi-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage({ ok: true, text: 'Backup downloaded.' });
    } catch {
      setMessage({ ok: false, text: 'Export failed — try again.' });
    } finally {
      setBusy(null);
    }
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const ok = window.confirm(
      'Restore this backup? It will REPLACE all current progress — lessons, review deck, XP, writing practice.'
    );
    if (!ok) return;
    setBusy('import');
    setMessage(null);
    try {
      const text = await file.text();
      const res = await importBackup(text);
      if (res.ok) {
        setMessage({ ok: true, text: 'Progress restored.' });
        router.refresh();
      } else {
        setMessage({ ok: false, text: res.error ?? 'Import failed.' });
      }
    } catch {
      setMessage({ ok: false, text: 'Could not read that file.' });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="card p-6">
      <h2 className="text-lg font-extrabold">Backup &amp; restore</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Download your progress as JSON, or restore it on another machine. Restoring replaces
        everything — export first if unsure.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={handleExport} disabled={busy !== null} className="btn-primary">
          {busy === 'export' ? 'Exporting…' : 'Export progress'}
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={busy !== null}
          className="btn-secondary"
        >
          {busy === 'import' ? 'Restoring…' : 'Restore from file'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleFile}
        />
      </div>
      {message && (
        <p
          className={`mt-3 text-sm font-semibold ${message.ok ? 'text-emerald-700' : 'text-vermilion'}`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
