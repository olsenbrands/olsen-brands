'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Columns, CheckSquare, X, ChevronDown } from 'lucide-react';

type DecisionValue = 'pass' | 'decide' | 'hired';

function mapStatusToDecision(status: string | null, hired: boolean | null): DecisionValue {
  if (status === 'hired' || hired) return 'hired';
  if (status === 'rejected') return 'pass';
  return 'decide';
}

function DecisionToggle({
  interviewId,
  initial,
  onChanged,
}: {
  interviewId: string;
  initial: DecisionValue;
  onChanged?: (id: string, val: DecisionValue) => void;
}) {
  const [value, setValue] = useState<DecisionValue>(initial);
  const [saving, setSaving] = useState(false);

  const options: { val: DecisionValue; label: string }[] = [
    { val: 'pass',   label: 'Pass'   },
    { val: 'decide', label: 'Decide' },
    { val: 'hired',  label: 'Hired'  },
  ];

  const activeStyle: Record<DecisionValue, string> = {
    pass:   'bg-red-500 text-white border-red-500',
    decide: 'bg-yellow-400 text-gray-900 border-yellow-400',
    hired:  'bg-green-500 text-white border-green-500',
  };

  const inactiveStyle = 'bg-transparent text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text-secondary)]';

  const handleClick = async (e: React.MouseEvent, next: DecisionValue) => {
    e.stopPropagation();
    if (next === value || saving) return;
    setValue(next);
    setSaving(true);
    onChanged?.(interviewId, next);
    const payload =
      next === 'hired'  ? { status: 'hired',    hired: true  } :
      next === 'pass'   ? { status: 'rejected',  hired: false } :
                          { status: 'new',        hired: false };
    await fetch(`/api/interviews/subway/${interviewId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSaving(false);
  };

  return (
    <div className={`inline-flex rounded-lg overflow-hidden border border-[var(--border)] transition-opacity ${saving ? 'opacity-60' : ''}`}>
      {options.map((opt, idx) => (
        <button
          key={opt.val}
          onClick={(e) => handleClick(e, opt.val)}
          className={`px-2.5 py-1 text-xs font-semibold border-y transition-colors select-none
            ${idx === 0 ? 'border-l rounded-l-lg' : ''}
            ${idx === options.length - 1 ? 'border-r rounded-r-lg' : 'border-r'}
            ${value === opt.val ? activeStyle[opt.val] : inactiveStyle}
          `}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

const BUSINESSES = [
  'Subway — Kaysville', 'Subway — Morgan', 'Subway — Ogden',
  "Wedgie's — Clinton",
  'FiiZ — Clinton', 'FiiZ — Kaysville East', 'FiiZ — Kaysville West',
];

const STATUS_STYLES: Record<string, string> = {
  new:      'bg-blue-100 text-blue-800',
  hired:    'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};
const STATUS_LABELS: Record<string, string> = {
  new: 'New', hired: 'Hired', rejected: 'No Hire',
};

const ALL_COLUMNS = [
  { key: 'name',     label: 'Name',     always: true },
  { key: 'contact',  label: 'Contact',  always: false },
  { key: 'age',      label: 'Age',      always: false },
  { key: 'location', label: 'Location', always: false },
  { key: 'date',     label: 'Date',     always: false },
  { key: 'rating',   label: 'Rating',   always: false },
  { key: 'status',   label: 'Status',   always: false },
  { key: 'wage',     label: 'Wage',     always: false },
  { key: 'decision', label: 'Decision', always: true },
];

function StarDisplay({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-[var(--text-muted)] text-xs">—</span>;
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="text-sm whitespace-nowrap">
      <span className="text-[#e07b35]">{'★'.repeat(full)}{half ? '½' : ''}</span>
      <span className="text-[var(--border)]">{'★'.repeat(empty)}</span>
      <span className="text-[var(--text-muted)] text-xs ml-1">{rating}</span>
    </span>
  );
}

interface Interview {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  age_group: string | null;
  business: string | null;
  interview_date: string | null;
  star_rating: number | null;
  status: string | null;
  hired: boolean | null;
  created_at: string;
  offered_base_wage: number | null;
  offered_total_wage: number | null;
}

export default function InterviewsClient({
  interviews: initial,
  filterBusiness,
  filterStatus,
}: {
  interviews: Interview[];
  filterBusiness: string;
  filterStatus: string;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Column visibility
  const [visibleCols, setVisibleCols] = useState<Set<string>>(
    new Set(['name', 'contact', 'age', 'location', 'date', 'rating', 'status', 'wage'])
  );
  const [showColPicker, setShowColPicker] = useState(false);

  // Batch mode
  const [batchMode, setBatchMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [batchAction, setBatchAction] = useState<'location' | 'archive' | 'rating' | null>(null);
  const [batchLocation, setBatchLocation] = useState('');
  const [showBatchLocationPicker, setShowBatchLocationPicker] = useState(false);
  const [showBatchRatingPicker, setShowBatchRatingPicker] = useState(false);
  const [batchRating, setBatchRating] = useState<number>(0);
  const [batchRatingHover, setBatchRatingHover] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const toggleCol = (key: string) => {
    setVisibleCols(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === initial.length) setSelected(new Set());
    else setSelected(new Set(initial.map(i => i.id)));
  };

  const exitBatch = () => {
    setBatchMode(false);
    setSelected(new Set());
    setBatchAction(null);
    setBatchLocation('');
    setBatchRating(0);
    setShowBatchLocationPicker(false);
    setShowBatchRatingPicker(false);
  };

  const applyBatchRating = async () => {
    if (!batchRating || selected.size === 0) return;
    setSaving(true);
    setSaveMsg('');
    await Promise.all(
      [...selected].map(id =>
        fetch(`/api/interviews/subway/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ star_rating: batchRating }),
        })
      )
    );
    setSaving(false);
    setSaveMsg(`✓ Rated ${selected.size} record${selected.size > 1 ? 's' : ''} — ${batchRating}★`);
    exitBatch();
    startTransition(() => router.refresh());
  };

  const applyBatchArchive = async () => {
    if (selected.size === 0) return;
    setSaving(true);
    setSaveMsg('');
    await Promise.all(
      [...selected].map(id =>
        fetch(`/api/interviews/subway/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ archived_at: new Date().toISOString() }),
        })
      )
    );
    setSaving(false);
    setSaveMsg(`✓ Archived ${selected.size} record${selected.size > 1 ? 's' : ''}`);
    exitBatch();
    startTransition(() => router.refresh());
  };

  const applyBatchLocation = async () => {
    if (!batchLocation || selected.size === 0) return;
    setSaving(true);
    setSaveMsg('');
    await Promise.all(
      [...selected].map(id =>
        fetch(`/api/interviews/subway/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ business: batchLocation }),
        })
      )
    );
    setSaving(false);
    setSaveMsg(`✓ Updated ${selected.size} record${selected.size > 1 ? 's' : ''}`);
    exitBatch();
    startTransition(() => router.refresh());
  };

  // Decision toggle local state
  const [decisions, setDecisions] = useState<Record<string, DecisionValue>>(() =>
    Object.fromEntries(initial.map(i => [i.id, mapStatusToDecision(i.status, i.hired)]))
  );
  const handleDecisionChanged = (id: string, val: DecisionValue) => {
    setDecisions(prev => ({ ...prev, [id]: val }));
  };

  const show = (key: string) => visibleCols.has(key);

  const navigate = (path: string) => {
    if (!batchMode) router.push(path);
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Batch button */}
          {!batchMode ? (
            <button
              onClick={() => setBatchMode(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
            >
              <CheckSquare size={15} />
              Batch Edit
            </button>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-[var(--text-primary)]">
                {selected.size} selected
              </span>
              {/* Batch actions */}
              <div className="relative">
                <button
                  onClick={() => {
                    setBatchAction('location');
                    setShowBatchLocationPicker(v => !v);
                    setShowBatchRatingPicker(false);
                  }}
                  disabled={selected.size === 0}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-[var(--accent)] text-white disabled:opacity-40 transition"
                >
                  Set Location <ChevronDown size={14} />
                </button>
                {showBatchLocationPicker && (
                  <div className="absolute top-full left-0 mt-1 z-50 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl shadow-xl p-3 min-w-[220px]">
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Set location for {selected.size} selected</p>
                    <div className="space-y-1">
                      {BUSINESSES.map(b => (
                        <button
                          key={b}
                          onClick={() => setBatchLocation(b)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                            batchLocation === b
                              ? 'bg-[var(--accent)] text-white'
                              : 'hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                    {batchLocation && (
                      <button
                        onClick={applyBatchLocation}
                        disabled={saving}
                        className="mt-3 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold transition"
                      >
                        {saving ? 'Saving…' : `Apply to ${selected.size} record${selected.size !== 1 ? 's' : ''}`}
                      </button>
                    )}
                  </div>
                )}
              </div>
              {/* Batch rating */}
              <div className="relative">
                <button
                  onClick={() => { setShowBatchRatingPicker(v => !v); setShowBatchLocationPicker(false); }}
                  disabled={selected.size === 0}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[#e07b35] hover:border-[#e07b35] disabled:opacity-40 transition"
                >
                  ★ Set Rating <ChevronDown size={14} />
                </button>
                {showBatchRatingPicker && (
                  <div className="absolute top-full left-0 mt-1 z-50 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl shadow-xl p-4 min-w-[220px]">
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">Set rating for {selected.size} selected</p>
                    <div className="flex items-center gap-1 mb-3">
                      {[1,2,3,4,5].map(star => (
                        <div key={star} className="relative w-9 h-9 flex-shrink-0">
                          <span className="absolute inset-0 flex items-center justify-center text-3xl leading-none text-[#d0d0cc]">★</span>
                          {(batchRatingHover || batchRating) >= star && (
                            <span className="absolute inset-0 flex items-center justify-center text-3xl leading-none text-[#e07b35]">★</span>
                          )}
                          {(batchRatingHover || batchRating) >= star - 0.5 && (batchRatingHover || batchRating) < star && (
                            <span className="absolute inset-0 flex items-center justify-center text-3xl leading-none text-[#e07b35] overflow-hidden" style={{ clipPath: 'inset(0 50% 0 0)' }}>★</span>
                          )}
                          <button
                            type="button"
                            className="absolute left-0 top-0 w-1/2 h-full z-10 focus:outline-none"
                            onMouseEnter={() => setBatchRatingHover(star - 0.5)}
                            onMouseLeave={() => setBatchRatingHover(0)}
                            onClick={() => setBatchRating(batchRating === star - 0.5 ? 0 : star - 0.5)}
                          />
                          <button
                            type="button"
                            className="absolute right-0 top-0 w-1/2 h-full z-10 focus:outline-none"
                            onMouseEnter={() => setBatchRatingHover(star)}
                            onMouseLeave={() => setBatchRatingHover(0)}
                            onClick={() => setBatchRating(batchRating === star ? 0 : star)}
                          />
                        </div>
                      ))}
                      {(batchRating > 0) && (
                        <span className="ml-1 text-xs font-semibold text-[var(--text-muted)]">
                          {batchRating}/5
                        </span>
                      )}
                    </div>
                    {batchRating > 0 && (
                      <button
                        onClick={applyBatchRating}
                        disabled={saving}
                        className="w-full py-2 bg-[#e07b35] hover:bg-[#c96a2a] text-white rounded-lg text-sm font-bold transition"
                      >
                        {saving ? 'Saving…' : `Apply ${batchRating}★ to ${selected.size} record${selected.size !== 1 ? 's' : ''}`}
                      </button>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={applyBatchArchive}
                disabled={saving || selected.size === 0}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-red-500 hover:border-red-400 disabled:opacity-40 transition"
              >
                📦 Archive
              </button>
              <button onClick={exitBatch} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border)] transition">
                <X size={14} /> Cancel
              </button>
            </div>
          )}

          {saveMsg && <span className="text-xs font-semibold text-green-600">{saveMsg}</span>}
        </div>

        {/* Column picker */}
        <div className="relative">
          <button
            onClick={() => setShowColPicker(v => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
          >
            <Columns size={15} />
            Columns
          </button>
          {showColPicker && (
            <div className="absolute right-0 top-full mt-1 z-50 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl shadow-xl p-3 min-w-[180px]">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Show / Hide</p>
              {ALL_COLUMNS.map(col => (
                <label key={col.key} className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-[var(--bg-tertiary)] ${col.always ? 'opacity-50 pointer-events-none' : ''}`}>
                  <input
                    type="checkbox"
                    checked={visibleCols.has(col.key)}
                    onChange={() => toggleCol(col.key)}
                    className="accent-[var(--accent)]"
                  />
                  <span className="text-sm text-[var(--text-secondary)]">{col.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      {initial.length === 0 ? (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-12 text-center">
          <p className="text-[var(--text-muted)]">No interviews found</p>
          <Link href="/interviews/subway" className="mt-4 inline-block text-sm text-[var(--accent)] hover:underline">
            Start a new interview →
          </Link>
        </div>
      ) : (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--text-muted)] text-xs uppercase tracking-wider">
                {batchMode && (
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={selected.size === initial.length && initial.length > 0}
                      onChange={toggleAll}
                      className="accent-[var(--accent)]"
                    />
                  </th>
                )}
                {show('name')     && <th className="px-4 py-3 text-left font-semibold">Name</th>}
                {show('contact')  && <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Contact</th>}
                {show('age')      && <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Age</th>}
                {show('location') && <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">Location</th>}
                {show('date')     && <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Date</th>}
                {show('rating')   && <th className="px-4 py-3 text-left font-semibold">Rating</th>}
                {show('status')   && <th className="px-4 py-3 text-left font-semibold">Status</th>}
                {show('wage')     && <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Wage</th>}
                <th className="px-4 py-3 text-right font-semibold">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {initial.map(i => (
                <tr
                  key={i.id}
                  onClick={() => { if (batchMode) toggleSelect(i.id); else navigate(`/hq/interviews/${i.id}`); }}
                  className={`transition-colors cursor-pointer ${
                    batchMode && selected.has(i.id)
                      ? 'bg-[var(--accent)]/10'
                      : 'hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  {batchMode && (
                    <td className="px-4 py-3 w-10" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected.has(i.id)}
                        onChange={() => toggleSelect(i.id)}
                        className="accent-[var(--accent)] cursor-pointer"
                      />
                    </td>
                  )}
                  {show('name') && (
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[var(--text-primary)]">{i.name || <span className="italic text-[var(--text-muted)]">No name</span>}</p>
                      {!show('location') && <p className="text-xs text-[var(--text-muted)] mt-0.5">{i.business || '—'}</p>}
                    </td>
                  )}
                  {show('contact') && (
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {i.phone && <p className="text-[var(--text-secondary)]">{i.phone}</p>}
                      {i.email && <p className="text-xs text-[var(--text-muted)] mt-0.5">{i.email}</p>}
                    </td>
                  )}
                  {show('age') && (
                    <td className="px-4 py-3 hidden md:table-cell text-[var(--text-secondary)]">{i.age_group || '—'}</td>
                  )}
                  {show('location') && (
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs font-medium text-[var(--text-secondary)]">{i.business || '—'}</span>
                    </td>
                  )}
                  {show('date') && (
                    <td className="px-4 py-3 hidden md:table-cell text-[var(--text-muted)] text-xs">
                      {i.interview_date ? new Date(i.interview_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                  )}
                  {show('rating') && (
                    <td className="px-4 py-3"><StarDisplay rating={i.star_rating} /></td>
                  )}
                  {show('status') && (
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[i.status || 'new'] || STATUS_STYLES.new}`}>
                        {STATUS_LABELS[i.status || 'new'] || 'New'}
                      </span>
                    </td>
                  )}
                  {show('wage') && (
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {i.offered_total_wage ? (
                        <div>
                          <span className="font-semibold text-[var(--text-primary)]">${i.offered_total_wage.toFixed(2)}</span>
                          <span className="text-[var(--text-muted)] text-xs">/hr</span>
                          {i.offered_base_wage && i.offered_base_wage !== i.offered_total_wage && (
                            <p className="text-xs text-[var(--text-muted)] mt-0.5">${i.offered_base_wage.toFixed(2)} base</p>
                          )}
                        </div>
                      ) : i.offered_base_wage ? (
                        <div>
                          <span className="font-semibold text-[var(--text-primary)]">${i.offered_base_wage.toFixed(2)}</span>
                          <span className="text-[var(--text-muted)] text-xs">/hr</span>
                        </div>
                      ) : (
                        <span className="text-[var(--text-muted)] text-xs">—</span>
                      )}
                    </td>
                  )}
                  <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                    <DecisionToggle
                      interviewId={i.id}
                      initial={decisions[i.id] ?? 'decide'}
                      onChanged={handleDecisionChanged}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
