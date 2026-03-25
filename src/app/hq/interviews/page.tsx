import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ClipboardList } from 'lucide-react';

export const revalidate = 0;

const STATUS_STYLES: Record<string, string> = {
  new:      'bg-blue-100 text-blue-800',
  hired:    'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  hired: 'Hired',
  rejected: 'No Hire',
};

function StarDisplay({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-[var(--text-muted)] text-xs">—</span>;
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="text-sm tracking-tight whitespace-nowrap">
      <span className="text-[#e07b35]">{'★'.repeat(full)}{half ? '½' : ''}</span>
      <span className="text-[var(--border)]">{'★'.repeat(empty)}</span>
      <span className="text-[var(--text-muted)] text-xs ml-1">{rating}</span>
    </span>
  );
}

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
    .select('id, name, phone, email, age_group, business, interview_date, star_rating, status, hired, created_at')
    .order('interview_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (filterBusiness) query = query.eq('business', filterBusiness);
  if (filterStatus) query = query.eq('status', filterStatus);

  const { data: interviews, error } = await query;

  if (error) return <div className="p-8 text-red-400">Error: {error.message}</div>;

  const businesses = [
    'Subway — Kaysville', 'Subway — Morgan', 'Subway — Ogden',
    "Wedgie's — Clinton",
    'FiiZ — Clinton', 'FiiZ — Kaysville East', 'FiiZ — Kaysville West',
  ];

  const counts = {
    all: interviews?.length ?? 0,
    new: interviews?.filter(i => i.status === 'new' || !i.status).length ?? 0,
    hired: interviews?.filter(i => i.status === 'hired').length ?? 0,
    rejected: interviews?.filter(i => i.status === 'rejected').length ?? 0,
  };

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
      <div className="flex gap-2 mb-5 flex-wrap">
        {[
          { label: `All (${counts.all})`, value: '' },
          { label: `New (${counts.new})`, value: 'new' },
          { label: `Hired (${counts.hired})`, value: 'hired' },
          { label: `No Hire (${counts.rejected})`, value: 'rejected' },
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
      <div className="flex gap-2 mb-6 flex-wrap">
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

      {/* Table */}
      {!interviews || interviews.length === 0 ? (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-12 text-center">
          <ClipboardList size={32} className="text-[var(--text-muted)] mx-auto mb-3" />
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
                <th className="px-4 py-3 text-left font-semibold">Candidate</th>
                <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Contact</th>
                <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Age</th>
                <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">Location</th>
                <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Rating</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {interviews.map(i => (
                <Link key={i.id} href={`/hq/interviews/${i.id}`} legacyBehavior>
                  <tr className="hover:bg-[var(--bg-tertiary)] cursor-pointer transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[var(--text-primary)]">{i.name || <span className="text-[var(--text-muted)] italic">No name</span>}</p>
                      <p className="text-xs text-[var(--text-muted)] lg:hidden mt-0.5">{i.business || '—'}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {i.phone && <p className="text-[var(--text-secondary)]">{i.phone}</p>}
                      {i.email && <p className="text-xs text-[var(--text-muted)] mt-0.5">{i.email}</p>}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-[var(--text-secondary)]">
                      {i.age_group || '—'}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs font-medium text-[var(--text-secondary)]">{i.business || '—'}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-[var(--text-muted)] text-xs">
                      {i.interview_date ? new Date(i.interview_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <StarDisplay rating={i.star_rating} />
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[i.status || 'new'] || STATUS_STYLES.new}`}>
                        {STATUS_LABELS[i.status || 'new'] || 'New'}
                      </span>
                    </td>
                  </tr>
                </Link>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
