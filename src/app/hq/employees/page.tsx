import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Suspense } from 'react';
import { Users } from 'lucide-react';
import EmployeeFilters from './components/EmployeeFilters';
import EmployeeTable from './components/EmployeeTable';

// ─── Types ─────────────────────────────────────────────

interface RawBusiness {
  id: string;
  name: string;
  slug: string;
}

interface RawEmployeeBusiness {
  hire_date: string | null;
  active: boolean;
  businesses: RawBusiness | null;
}

interface RawEmployeeDocument {
  id: string;
  status: string;
  document_type_id: string;
  business_id: string;
  created_at: string;
}

interface RawEmployee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  created_at: string;
  archived_at: string | null;
  archived_reason: string | null;
  employee_businesses: RawEmployeeBusiness[];
  employee_documents: RawEmployeeDocument[];
}

interface Requirement {
  business_id: string;
  document_type_id: string;
  required: boolean;
  document_types: { requires_signature: boolean; requires_file_upload: boolean } | null;
}

type EmployeeStatus = 'complete' | 'missing' | 'no-requirements' | 'archived';

interface ProcessedEmployee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  businessNames: string[];
  businessIds: string[];
  requiredCount: number;
  completedCount: number;
  lastSubmission: string | null;
  status: EmployeeStatus;
  archivedAt: string | null;
  archivedReason: string | null;
}

// ─── Helpers ───────────────────────────────────────────

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ─── Filter wrapper (needs Suspense for useSearchParams) ─

function FiltersWrapper({ businesses }: { businesses: RawBusiness[] }) {
  return (
    <Suspense fallback={<div className="h-11 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg animate-pulse" />}>
      <EmployeeFilters businesses={businesses} />
    </Suspense>
  );
}

// ─── Page ──────────────────────────────────────────────

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<{ business?: string; status?: string; q?: string }>;
}) {
  const params = await searchParams;

  // ── Fetch all data ──────────────────────────────────
  const [employeesRes, requirementsRes, businessesRes] = await Promise.all([
    supabase
      .from('employees')
      .select(`
        id, first_name, last_name, email, phone, created_at,
        archived_at, archived_reason,
        employee_businesses (
          hire_date, active,
          businesses ( id, name, slug )
        ),
        employee_documents (
          id, status, document_type_id, business_id, created_at
        )
      `)
      .order('created_at', { ascending: false }),

    supabase
      .from('business_document_requirements')
      .select('business_id, document_type_id, required, document_types(requires_signature, requires_file_upload)')
      .eq('required', true),

    supabase
      .from('businesses')
      .select('id, name, slug')
      .order('name'),
  ]);

  const employees = (employeesRes.data || []) as unknown as RawEmployee[];
  const requirements = (requirementsRes.data || []) as unknown as Requirement[];
  const businesses = (businessesRes.data || []) as RawBusiness[];

  // ── Process employees ───────────────────────────────
  const processed: ProcessedEmployee[] = employees.map((emp) => {
    const businessIds = (emp.employee_businesses || [])
      .map((eb) => eb.businesses?.id)
      .filter((id): id is string => !!id);

    const businessNames = (emp.employee_businesses || [])
      .map((eb) => eb.businesses?.name)
      .filter((n): n is string => !!n);

    // Only count steps that actually create employee_document records
    const requiredDocs = requirements.filter((r) =>
      businessIds.includes(r.business_id) &&
      (r.document_types?.requires_signature || r.document_types?.requires_file_upload)
    );

    const completedDocs = (emp.employee_documents || []).filter(
      (d) => d.status === 'complete'
    );

    const completedKeys = new Set(
      completedDocs.map((d) => `${d.business_id}:${d.document_type_id}`)
    );

    const requiredCount = requiredDocs.length;
    const completedCount = requiredDocs.filter((r) =>
      completedKeys.has(`${r.business_id}:${r.document_type_id}`)
    ).length;

    const lastSubmission = completedDocs.reduce(
      (latest, doc) =>
        !latest || new Date(doc.created_at) > new Date(latest)
          ? doc.created_at
          : latest,
      null as string | null
    );

    const status: EmployeeStatus =
      emp.archived_at
        ? 'archived'
        : requiredCount === 0
        ? 'no-requirements'
        : completedCount >= requiredCount
        ? 'complete'
        : 'missing';

    return {
      id: emp.id,
      firstName: emp.first_name,
      lastName: emp.last_name,
      email: emp.email,
      businessNames,
      businessIds,
      requiredCount,
      completedCount,
      lastSubmission,
      status,
      archivedAt: emp.archived_at,
      archivedReason: emp.archived_reason,
    };
  });

  // ── Apply filters ────────────────────────────────────
  // By default show only active employees; archived only when explicitly requested
  const showArchived = params.status === 'archived';
  let filtered = processed.filter((e) =>
    showArchived ? e.status === 'archived' : e.status !== 'archived'
  );

  if (params.business) {
    filtered = filtered.filter((e) => e.businessIds.includes(params.business!));
  }
  if (params.status === 'complete') {
    filtered = filtered.filter((e) => e.status === 'complete');
  } else if (params.status === 'missing') {
    filtered = filtered.filter((e) => e.status === 'missing');
  }
  if (params.q) {
    const q = params.q.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q)
    );
  }

  // ── Stats (active employees only) ──────────────────
  const active = processed.filter((e) => e.status !== 'archived');
  const totalCount = active.length;
  const completeCount = active.filter((e) => e.status === 'complete').length;
  const missingCount = active.filter((e) => e.status === 'missing').length;
  const archivedCount = processed.filter((e) => e.status === 'archived').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Users size={24} className="text-[var(--accent)]" />
            Employees
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            All employee records and document submissions across all businesses
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-5">
          <div className="text-3xl font-bold text-[var(--text-primary)]">{totalCount}</div>
          <div className="text-sm text-[var(--text-muted)] mt-1">Active Employees</div>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-green-500/20 rounded-xl p-5">
          <div className="text-3xl font-bold text-green-400">{completeCount}</div>
          <div className="text-sm text-[var(--text-muted)] mt-1">All Docs Complete</div>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-amber-500/20 rounded-xl p-5">
          <div className="text-3xl font-bold text-amber-400">{missingCount}</div>
          <div className="text-sm text-[var(--text-muted)] mt-1">Missing Items</div>
        </div>
        <a
          href={archivedCount > 0 ? '/hq/employees?status=archived' : '#'}
          className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-5 block transition-opacity hover:opacity-80"
        >
          <div className="text-3xl font-bold text-[var(--text-muted)]">{archivedCount}</div>
          <div className="text-sm text-[var(--text-muted)] mt-1">
            Archived {archivedCount > 0 ? '→' : ''}
          </div>
        </a>
      </div>

      {/* Archived view banner */}
      {showArchived && (
        <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
          <p className="text-sm text-[var(--text-muted)]">Showing archived (former) employees. Records are never deleted.</p>
          <a href="/hq/employees" className="text-sm font-medium text-[var(--accent)] hover:opacity-80">← Back to active</a>
        </div>
      )}

      {/* Filters */}
      <FiltersWrapper businesses={businesses} />

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-12 text-center">
          <Users size={32} className="text-[var(--text-muted)] mx-auto mb-3" />
          <p className="text-[var(--text-secondary)] font-medium">No employees found</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {processed.length === 0
              ? 'No employees have submitted documents yet.'
              : 'Try adjusting your filters.'}
          </p>
        </div>
      ) : (
        <EmployeeTable employees={filtered.map((e) => ({
          id: e.id,
          firstName: e.firstName,
          lastName: e.lastName,
          email: e.email,
          businessNames: e.businessNames,
          requiredCount: e.requiredCount,
          completedCount: e.completedCount,
          lastSubmission: e.lastSubmission,
          status: e.status,
        }))} />
      )}

      {/* Result count */}
      {filtered.length > 0 && (
        <p className="text-xs text-[var(--text-muted)] text-right">
          Showing {filtered.length} of {totalCount} employee{totalCount !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
