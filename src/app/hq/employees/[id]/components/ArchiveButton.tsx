'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Archive, RotateCcw, X } from 'lucide-react';

interface Props {
  employeeId: string;
  isArchived: boolean;
  employeeName: string;
}

export default function ArchiveButton({ employeeId, isArchived, employeeName }: Props) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleArchive() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/hq/employees/${employeeId}/archive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) {
      const json = await res.json();
      setError(json.error || 'Something went wrong.');
      setLoading(false);
      return;
    }
    router.refresh();
    setConfirming(false);
    setReason('');
    setLoading(false);
  }

  async function handleRestore() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/hq/employees/${employeeId}/restore`, {
      method: 'POST',
    });
    if (!res.ok) {
      const json = await res.json();
      setError(json.error || 'Something went wrong.');
      setLoading(false);
      return;
    }
    router.refresh();
    setLoading(false);
  }

  if (isArchived) {
    return (
      <div className="flex items-center gap-2">
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          onClick={handleRestore}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors disabled:opacity-40"
          style={{
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          <RotateCcw size={13} />
          {loading ? 'Restoring…' : 'Restore Employee'}
        </button>
      </div>
    );
  }

  if (confirming) {
    return (
      <div className="flex flex-col gap-2 p-4 rounded-lg border border-red-500/30 bg-red-500/5 max-w-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-red-400">Archive {employeeName}?</p>
          <button onClick={() => { setConfirming(false); setReason(''); setError(null); }}>
            <X size={15} className="text-[var(--text-muted)]" />
          </button>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          Their record and all documents are permanently preserved. This just removes them from the active employee list.
        </p>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason (e.g. Resigned, Let go, Seasonal) — optional"
          className="w-full px-3 py-2 rounded text-xs outline-none"
          style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={handleArchive}
            disabled={loading}
            className="flex-1 py-2 rounded text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-40"
          >
            {loading ? 'Archiving…' : 'Yes, archive'}
          </button>
          <button
            onClick={() => { setConfirming(false); setReason(''); setError(null); }}
            className="flex-1 py-2 rounded text-xs font-medium transition-colors"
            style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:border-red-500/50 hover:text-red-400"
      style={{
        background: 'transparent',
        border: '1px solid var(--border)',
        color: 'var(--text-muted)',
      }}
    >
      <Archive size={13} />
      Archive Employee
    </button>
  );
}
