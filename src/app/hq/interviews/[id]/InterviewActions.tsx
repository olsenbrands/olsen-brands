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
  email?: string | null;
  hourly_base?: string | null;
  tip_amount?: string | null;
  pos_pin?: string | null;
  training_username?: string | null;
  training_password?: string | null;
  welcome_sent_at?: string | null;
}

export default function InterviewActions({ interview }: { interview: Interview }) {
  const router = useRouter();
  const [status, setStatus] = useState(interview.status || 'new');
  const [business, setBusiness] = useState(interview.business || '');
  const [rejectionNotes, setRejectionNotes] = useState(interview.rejection_notes || '');
  const [showDNH, setShowDNH] = useState(false);
  const [archived, setArchived] = useState(!!interview.archived_at);
  const isSubway = (interview.business || '').toLowerCase().includes('subway');

  // Welcome package fields
  const [hourlyBase, setHourlyBase] = useState(interview.hourly_base || '');
  const [tipAmount, setTipAmount] = useState(interview.tip_amount || '');
  const [posPin, setPosPin] = useState(interview.pos_pin || '');
  const [trainingUsername, setTrainingUsername] = useState(interview.training_username || '');
  const [trainingPassword, setTrainingPassword] = useState(interview.training_password || '');
  const [welcomeSentAt, setWelcomeSentAt] = useState(interview.welcome_sent_at || '');
  const [sendingWelcome, setSendingWelcome] = useState(false);
  const [welcomeMsg, setWelcomeMsg] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Calculate effective wage
  const baseNum = parseFloat(hourlyBase.replace(/[^0-9.]/g, ''));
  const tipNum = parseFloat(tipAmount.replace(/[^0-9.]/g, ''));
  const effectiveWage = !isNaN(baseNum) && !isNaN(tipNum) ? `$${(baseNum + tipNum).toFixed(2)}` : null;
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

  const saveWelcomePackage = async () => {
    await update({
      hourly_base: hourlyBase || null,
      tip_amount: tipAmount || null,
      pos_pin: posPin || null,
      training_username: trainingUsername || null,
      training_password: trainingPassword || null,
    });
  };

  const openPreview = async () => {
    setLoadingPreview(true);
    setShowPreview(true);
    const res = await fetch('/api/interviews/subway/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: interview.id, hourlyBase, tipAmount, posPin, trainingUsername, trainingPassword }),
    });
    const html = await res.text();
    setPreviewHtml(html);
    setLoadingPreview(false);
  };

  const sendWelcomeEmail = async () => {
    setSendingWelcome(true);
    setWelcomeMsg('');
    await saveWelcomePackage();
    const res = await fetch('/api/interviews/subway/welcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: interview.id }),
    });
    const json = await res.json();
    setSendingWelcome(false);
    if (json.success) {
      const now = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
      setWelcomeSentAt(new Date().toISOString());
      setWelcomeMsg(`✓ Welcome email sent at ${now}`);
    } else {
      setWelcomeMsg(`❌ ${json.error || 'Failed to send'}`);
    }
  };

  return (
    <>
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

      {/* Welcome Package — only when hired */}
      {status === 'hired' && (
        <div className="border-t border-[var(--border)] pt-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">Welcome Package</p>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">Base Hourly Pay</label>
              <input
                value={hourlyBase}
                onChange={e => setHourlyBase(e.target.value)}
                onBlur={saveWelcomePackage}
                placeholder="$13.00"
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">Guaranteed Tips / hr</label>
              <input
                value={tipAmount}
                onChange={e => setTipAmount(e.target.value)}
                onBlur={saveWelcomePackage}
                placeholder="$1.00"
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
              />
            </div>
          </div>

          {effectiveWage && (
            <p className="text-sm font-semibold text-green-600 mb-3">
              → Effective wage: <strong>{effectiveWage}+/hr</strong>
            </p>
          )}

          <div className="mb-3">
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">POS Pin Number</label>
            <input
              value={posPin}
              onChange={e => setPosPin(e.target.value)}
              onBlur={saveWelcomePackage}
              placeholder="e.g. 288"
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
            />
          </div>

          {isSubway && (
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">UoS Username</label>
                <input
                  value={trainingUsername}
                  onChange={e => setTrainingUsername(e.target.value)}
                  onBlur={saveWelcomePackage}
                  placeholder="e.g. JaneSmith4060"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">UoS Password</label>
                <input
                  value={trainingPassword}
                  onChange={e => setTrainingPassword(e.target.value)}
                  onBlur={saveWelcomePackage}
                  placeholder="e.g. JaneS4060"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
                />
              </div>
            </div>
          )}

          {!interview.email && (
            <p className="text-xs text-amber-600 font-semibold mb-3">⚠️ No email address on file — add one to send the welcome email.</p>
          )}

          <div className="flex gap-2">
            <button
              onClick={openPreview}
              className="flex-1 py-2.5 bg-[var(--bg-tertiary)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg text-sm font-bold transition"
            >
              👁 Preview Email
            </button>
            <button
              onClick={sendWelcomeEmail}
              disabled={sendingWelcome || !interview.email}
              className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white rounded-lg text-sm font-bold transition"
            >
              {sendingWelcome ? 'Sending…' : welcomeSentAt ? '✓ Resend' : '📧 Send'}
            </button>
          </div>

          {welcomeSentAt && !welcomeMsg && (
            <p className="text-xs text-[var(--text-muted)] mt-1.5">
              Last sent: {new Date(welcomeSentAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
            </p>
          )}
          {welcomeMsg && (
            <p className={`text-xs mt-1.5 font-semibold ${welcomeMsg.startsWith('✓') ? 'text-green-600' : 'text-red-500'}`}>
              {welcomeMsg}
            </p>
          )}
        </div>
      )}

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

    {/* Preview Modal */}
    
    {showPreview && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowPreview(false)}>
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Modal header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
            <div>
              <p className="font-bold text-gray-900 text-sm">Email Preview</p>
              <p className="text-xs text-gray-500 mt-0.5">To: {interview.email || '(no email)'}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setShowPreview(false); sendWelcomeEmail(); }}
                disabled={sendingWelcome || !interview.email}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white rounded-lg text-sm font-bold transition"
              >
                {sendingWelcome ? 'Sending…' : '📧 Send Now'}
              </button>
              <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500 text-lg leading-none">✕</button>
            </div>
          </div>
          {/* Email iframe */}
          <div className="flex-1 overflow-auto">
            {loadingPreview ? (
              <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Loading preview…</div>
            ) : (
              <iframe
                srcDoc={previewHtml}
                className="w-full h-full min-h-[600px] border-0"
                title="Email Preview"
              />
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}
