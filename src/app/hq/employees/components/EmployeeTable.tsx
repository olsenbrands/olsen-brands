'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, ChevronRight, Archive, X } from 'lucide-react';

export interface EmployeeRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  businessNames: string[];
  requiredCount: number;
  completedCount: number;
  lastSubmission: string | null;
  status: 'complete' | 'missing' | 'no-requirements' | 'archived';
}

function StatusBadge({ status, completed, required }: {
  status: EmployeeRow['status'];
  completed: number;
  required: number;
}) {
  if (status === 'archived') return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--bg-tertiary)] text-[var(--text-muted)] border border-[var(--border)]">Archived</span>
  );
  if (status === 'no-requirements') return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--bg-tertiary)] text-[var(--text-muted)] border border-[var(--border)]">No requirements</span>
  );
  if (status === 'complete') return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
      <CheckCircle2 size={12} />Complete ({completed}/{required})
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
      <AlertCircle size={12} />{completed}/{required} docs
    </span>
  );
}

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function EmployeeTable({ employees }: { employees: EmployeeRow[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [reason, setReason] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only active employees can be batch-archived
  const archivable = employees.filter((e) => e.status !== 'archived');
  const allSelected = archivable.length > 0 && archivable.every((e) => selected.has(e.id));
  const someSelected = selected.size > 0;

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(archivable.map((e) => e.id)));
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function cancelBatch() {
    setSelected(new Set());
    setConfirming(false);
    setReason('');
    setError(null);
  }

  async function handleBatchArchive() {
    setLoading(true);
    setError(null);
    const res = await fetch('/api/hq/employees/archive-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: Array.from(selected), reason }),
    });
    if (!res.ok) {
      const json = await res.json();
      setError(json.error || 'Something went wrong.');
      setLoading(false);
      return;
    }
    router.refresh();
    cancelBatch();
    setLoading(false);
  }

  return (
    <>
      {/* Table */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl overflow-hidden">
        {employees.length === 0 ? (
          <div className="p-12 text-center text-sm text-[var(--text-muted)]">No employees found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {/* Select-all checkbox — only show when not viewing archived */}
                  {archivable.length > 0 && (
                    <th className="pl-4 pr-1 py-4 w-10">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                        className="accent-[#c9533c] w-4 h-4 rounded cursor-pointer"
                        title="Select all"
                      />
                    </th>
                  )}
                  <th className="text-left px-4 py-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Employee</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hidden sm:table-cell">Business(es)</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Documents</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hidden md:table-cell">Last Submission</th>
                  <th className="px-4 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {employees.map((emp) => {
                  const isSelected = selected.has(emp.id);
                  const canSelect = emp.status !== 'archived';
                  return (
                    <tr
                      key={emp.id}
                      className="hover:bg-[var(--bg-tertiary)] transition-colors group"
                      style={{ opacity: emp.status === 'archived' ? 0.6 : 1 }}
                    >
                      {archivable.length > 0 && (
                        <td className="pl-4 pr-1 py-4 w-10">
                          {canSelect && (
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleOne(emp.id)}
                              className="accent-[#c9533c] w-4 h-4 rounded cursor-pointer"
                            />
                          )}
                        </td>
                      )}
                      <td className="px-4 py-4">
                        <Link href={`/hq/employees/${emp.id}`} className="block">
                          <div className="font-medium text-[var(--text-primary)]">{emp.firstName} {emp.lastName}</div>
                          <div className="text-sm text-[var(--text-muted)]">{emp.email}</div>
                        </Link>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <Link href={`/hq/employees/${emp.id}`} className="block">
                          {emp.businessNames.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {emp.businessNames.map((name) => (
                                <span key={name} className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border)]">{name}</span>
                              ))}
                            </div>
                          ) : <span className="text-sm text-[var(--text-muted)]">—</span>}
                        </Link>
                      </td>
                      <td className="px-4 py-4">
                        <Link href={`/hq/employees/${emp.id}`} className="block">
                          <StatusBadge status={emp.status} completed={emp.completedCount} required={emp.requiredCount} />
                        </Link>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <Link href={`/hq/employees/${emp.id}`} className="block">
                          <span className="text-sm text-[var(--text-secondary)]">{formatDate(emp.lastSubmission)}</span>
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Link href={`/hq/employees/${emp.id}`} className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors">
                          <ChevronRight size={18} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating batch action bar */}
      {someSelected && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl shadow-2xl rounded-2xl border overflow-hidden"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
        >
          {!confirming ? (
            /* Selection summary */
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                  <Archive size={15} className="text-[var(--accent)]" />
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {selected.size} employee{selected.size !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={cancelBatch}
                  className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <X size={16} />
                </button>
                <button
                  onClick={() => setConfirming(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  <Archive size={14} />
                  Archive {selected.size > 1 ? `${selected.size} employees` : 'employee'}
                </button>
              </div>
            </div>
          ) : (
            /* Confirm panel */
            <div className="px-5 py-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  Archive {selected.size} employee{selected.size !== 1 ? 's' : ''}?
                </p>
                <button onClick={cancelBatch}>
                  <X size={15} className="text-[var(--text-muted)]" />
                </button>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                All records and documents are permanently preserved. Archived employees are hidden from the active list but never deleted.
              </p>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason — optional (e.g. End of season, Resigned)"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                autoFocus
              />
              {error && <p className="text-xs text-red-400">{error}</p>}
              <div className="flex gap-2">
                <button
                  onClick={handleBatchArchive}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-40"
                >
                  {loading ? 'Archiving…' : `Yes, archive ${selected.size > 1 ? 'all' : 'them'}`}
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
