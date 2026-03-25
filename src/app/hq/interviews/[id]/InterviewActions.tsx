'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const BUSINESSES = [
  'Subway — Kaysville', 'Subway — Morgan', 'Subway — Ogden',
  "Wedgie's — Clinton",
  'FiiZ — Clinton', 'FiiZ — Kaysville East', 'FiiZ — Kaysville West',
];

interface Interview {
  id: string;
  status: string | null;
  business: string | null;
  rejection_notes?: string | null;
  name?: string | null;
}

export default function InterviewActions({ interview }: { interview: Interview }) {
  const router = useRouter();
  const [status, setStatus] = useState(interview.status || 'new');
  const [business, setBusiness] = useState(interview.business || '');
  const [rejectionNotes, setRejectionNotes] = useState(interview.rejection_notes || '');
  const [showDNH, setShowDNH] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = async (patch: Record<string, unknown>) => {
    setSaving(true);
    setSaved(false);
    await fetch(`/api/interviews/subway/${interview.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    setSaving(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2000);
  };

  const handleHire = async () => {
    setStatus('hired');
    setShowDNH(false);
    await update({ status: 'hired', hired: true });
  };

  const handleDNH = async () => {
    setStatus('rejected');
    setShowDNH(false);
    await update({ status: 'rejected', hired: false, rejection_notes: rejectionNotes });
  };

  const handleBusinessChange = async (b: string) => {
    setBusiness(b);
    await update({ business: b });
  };

  const handleReopen = async () => {
    setStatus('new');
    await update({ status: 'new', hired: false });
  };

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-5 mb-4 space-y-4">

      {/* Business selector */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">Location</p>
        <div className="flex flex-wrap gap-2">
          {BUSINESSES.map(b => (
            <button
              key={b}
              type="button"
              onClick={() => handleBusinessChange(b)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                business === b
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]'
                  : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Hire / DNH actions */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">Decision</p>

        {status === 'new' && (
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleHire}
              disabled={saving}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold transition"
            >
              ✅ Hire
            </button>
            <button
              onClick={() => setShowDNH(!showDNH)}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition"
            >
              ❌ Do Not Hire
            </button>
          </div>
        )}

        {status === 'hired' && (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-bold">✅ Hired</span>
            <button onClick={handleReopen} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] underline">
              Reopen
            </button>
          </div>
        )}

        {status === 'rejected' && (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-bold">❌ No Hire</span>
            <button onClick={handleReopen} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] underline">
              Reopen
            </button>
          </div>
        )}

        {/* DNH reason input */}
        {showDNH && (
          <div className="mt-3 space-y-2">
            <textarea
              value={rejectionNotes}
              onChange={e => setRejectionNotes(e.target.value)}
              placeholder="Optional — reason for not hiring..."
              rows={2}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleDNH}
                disabled={saving}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition"
              >
                Confirm No Hire
              </button>
              <button onClick={() => setShowDNH(false)} className="px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {saved && <p className="text-xs text-green-600 font-semibold">✓ Saved</p>}
      {saving && <p className="text-xs text-[var(--text-muted)]">Saving…</p>}
    </div>
  );
}
