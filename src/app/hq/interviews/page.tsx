import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ClipboardList } from 'lucide-react';
import InterviewsClient from './InterviewsClient';

export const revalidate = 0;

export default async function InterviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ business?: string; status?: string }>;
}) {
  const params = await searchParams;
  const filterBusiness = params.business || '';
  const filterStatus = params.status || '';

  let query = supabase
    .from('subway_interviews')
    .select('id, name, phone, email, age_group, business, interview_date, star_rating, status, hired, archived_at, created_at')
    .order('interview_date', { ascending: false })
    .order('created_at', { ascending: false });

  // Show archived only when explicitly requested; otherwise hide them
  if (filterStatus === 'archived') {
    query = query.not('archived_at', 'is', null);
  } else {
    query = query.is('archived_at', null);
    if (filterStatus) query = query.eq('status', filterStatus);
  }
  if (filterBusiness) query = query.eq('business', filterBusiness);

  const { data: interviews, error } = await query;
  if (error) return <div className="p-8 text-red-400">Error: {error.message}</div>;

  const all = interviews ?? [];

  // Get archived count separately
  const { count: archivedCount } = await supabase
    .from('subway_interviews')
    .select('id', { count: 'exact', head: true })
    .not('archived_at', 'is', null);

  const counts = {
    all: all.length,
    new: all.filter(i => i.status === 'new' || !i.status).length,
    hired: all.filter(i => i.status === 'hired').length,
    rejected: all.filter(i => i.status === 'rejected').length,
    archived: archivedCount ?? 0,
  };

  const businesses = [
    'Subway — Kaysville', 'Subway — Morgan', 'Subway — Ogden',
    "Wedgie's — Clinton",
    'FiiZ — Clinton', 'FiiZ — Kaysville East', 'FiiZ — Kaysville West',
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ClipboardList size={24} className="text-[var(--accent)]" />
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Interviews</h1>
            <p className="text-sm text-[var(--text-muted)]">All candidate interviews across locations</p>
          </div>
        </div>
        <Link
          href="/interviews/subway"
          className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition"
        >
          + New Interview
        </Link>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { label: `All (${counts.all})`, value: '' },
          { label: `New (${counts.new})`, value: 'new' },
          { label: `Hired (${counts.hired})`, value: 'hired' },
          { label: `No Hire (${counts.rejected})`, value: 'rejected' },
          { label: `Archived (${counts.archived})`, value: 'archived' },
        ].map(tab => (
          <Link
            key={tab.value}
            href={`/hq/interviews?status=${tab.value}${filterBusiness ? `&business=${encodeURIComponent(filterBusiness)}` : ''}`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
              filterStatus === tab.value
                ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Location filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <Link
          href={`/hq/interviews?status=${filterStatus}`}
          className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
            !filterBusiness
              ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]'
              : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          All Locations
        </Link>
        {businesses.map(b => (
          <Link
            key={b}
            href={`/hq/interviews?business=${encodeURIComponent(b)}&status=${filterStatus}`}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
              filterBusiness === b
                ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]'
                : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            {b}
          </Link>
        ))}
      </div>

      {/* Client: batch + column controls + table */}
      <InterviewsClient
        interviews={all}
        filterBusiness={filterBusiness}
        filterStatus={filterStatus}
      />
    </div>
  );
}
