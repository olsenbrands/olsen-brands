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
  archived_at?: string | null;
  star_rating?: number | null;
}

export default function InterviewActions({ interview }: { interview: Interview }) {
  const router = useRouter();
  const [status, setStatus] = useState(interview.status || 'new');
  const [business, setBusiness] = useState(interview.business || '');
  const [rejectionNotes, setRejectionNotes] = useState(interview.rejection_notes || '');
  const [showDNH, setShowDNH] = useState(false);
  const [archived, setArchived] = useState(!!interview.archived_at);
  const [starRating, setStarRating] = useState<number>(interview.star_rating ?? 0);
  const [starHover, setStarHover] = useState<number>(0);
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

  const handleArchive = async () => {
    setArchived(true);
    await update({ archived_at: new Date().toISOString() });
  };

  const handleUnarchive = async () => {
    setArchived(false);
    await update({ archived_at: null });
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

      {/* Star rating */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">Rating</p>
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map(star => (
            <div key={star} className="relative w-9 h-9 flex-shrink-0">
              <span className="absolute inset-0 flex items-center justify-center text-3xl leading-none text-[#d0d0cc]">★</span>
              {(starHover || starRating) >= star && (
                <span className="absolute inset-0 flex items-center justify-center text-3xl leading-none text-[#e07b35]">★</span>
              )}
              {(starHover || starRating) >= star - 0.5 && (starHover || starRating) < star && (
                <span className="absolute inset-0 flex items-center justify-center text-3xl leading-none text-[#e07b35] overflow-hidden" style={{ clipPath: 'inset(0 50% 0 0)' }}>★</span>
              )}
              <button
                type="button"
                className="absolute left-0 top-0 w-1/2 h-full z-10 focus:outline-none"
                onMouseEnter={() => setStarHover(star - 0.5)}
                onMouseLeave={() => setStarHover(0)}
                onClick={async () => {
                  const val = starRating === star - 0.5 ? 0 : star - 0.5;
                  setStarRating(val);
                  await update({ star_rating: val || null });
                }}
              />
              <button
                type="button"
                className="absolute right-0 top-0 w-1/2 h-full z-10 focus:outline-none"
                onMouseEnter={() => setStarHover(star)}
                onMouseLeave={() => setStarHover(0)}
                onClick={async () => {
                  const val = starRating === star ? 0 : star;
                  setStarRating(val);
                  await update({ star_rating: val || null });
                }}
              />
            </div>
          ))}
          {starRating > 0 && (
            <span className="ml-2 text-sm font-semibold text-[var(--text-muted)]">
              {starRating}/5 — {starRating <= 1 ? 'Poor' : starRating <= 2 ? 'Fair' : starRating <= 3 ? 'Good' : starRating <= 4 ? 'Great' : 'Excellent'}
            </span>
          )}
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

      {/* Archive */}
      <div className="border-t border-[var(--border)] pt-3">
        {!archived ? (
          <button
            onClick={handleArchive}
            className="text-xs text-[var(--text-muted)] hover:text-red-500 transition underline"
          >
            Archive this interview
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-[var(--bg-tertiary)] text-[var(--text-muted)] rounded-lg text-xs font-semibold">📦 Archived</span>
            <button onClick={handleUnarchive} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] underline">
              Unarchive
            </button>
          </div>
        )}
      </div>

      {saved && <p className="text-xs text-green-600 font-semibold">✓ Saved</p>}
      {saving && <p className="text-xs text-[var(--text-muted)]">Saving…</p>}
    </div>
  );
}
