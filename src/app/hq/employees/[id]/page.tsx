import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Download,
  Eye,
  User,
  Building2,
  Calendar,
  Mail,
  Phone,
  Globe,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────

interface DocumentType {
  id: string;
  name: string;
  slug: string;
  requires_signature: boolean;
  requires_file_upload: boolean;
  current_version: string;
}

interface Requirement {
  required: boolean;
  document_types: DocumentType | null;
}

interface RawBusiness {
  id: string;
  name: string;
  slug: string;
  business_document_requirements: Requirement[];
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
  version: string | null;
  signature_url: string | null;
  file_url: string | null;
  pdf_url: string | null;
  signed_at: string | null;
  ip_address: string | null;
  created_at: string;
}

interface RawEmployee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  created_at: string;
  confirmation_email_sent_at: string | null;
  confirmation_email_opened_at: string | null;
  employee_businesses: RawEmployeeBusiness[];
  employee_documents: RawEmployeeDocument[];
}

interface ProcessedDocument {
  docType: DocumentType;
  businessId: string;
  status: 'complete' | 'pending' | 'missing';
  version: string | null;
  signedAt: string | null;
  ipAddress: string | null;
  createdAt: string | null;
  pdfDownloadUrl: string | null;
  fileViewUrl: string | null;
}

// ─── Helpers ───────────────────────────────────────────

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateTime(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Denver',
  }) + ' MT';
}

function DocStatusBadge({ status }: { status: ProcessedDocument['status'] }) {
  if (status === 'complete') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
        <CheckCircle2 size={12} />
        Complete
      </span>
    );
  }
  if (status === 'pending') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
        <Clock size={12} />
        Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
      <AlertCircle size={12} />
      Missing
    </span>
  );
}

// ─── Page ──────────────────────────────────────────────

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // ── Fetch employee with all related data ────────────
  const { data: raw, error } = await supabase
    .from('employees')
    .select(`
      id, first_name, last_name, email, phone, created_at,
      confirmation_email_sent_at, confirmation_email_opened_at,
      employee_businesses (
        hire_date, active,
        businesses (
          id, name, slug,
          business_document_requirements (
            required,
            document_types ( id, name, slug, requires_signature, requires_file_upload, current_version )
          )
        )
      ),
      employee_documents (
        id, status, document_type_id, business_id, version,
        signature_url, file_url, pdf_url, signed_at, ip_address, created_at
      )
    `)
    .eq('id', id)
    .single();

  if (error || !raw) {
    notFound();
  }

  const employee = raw as unknown as RawEmployee;

  // ── Generate signed URLs for all completed docs ─────
  // Build lookup: `{business_id}:{document_type_id}` → RawEmployeeDocument
  const docMap = new Map<string, RawEmployeeDocument>();
  for (const doc of employee.employee_documents || []) {
    docMap.set(`${doc.business_id}:${doc.document_type_id}`, doc);
  }

  // ── Build per-business document status list ─────────
  type BusinessSection = {
    business: RawBusiness;
    hireDate: string | null;
    documents: ProcessedDocument[];
  };

  const businessSections: BusinessSection[] = await Promise.all(
    (employee.employee_businesses || []).map(async (eb) => {
      const business = eb.businesses;
      if (!business) return null;

      const docs: ProcessedDocument[] = await Promise.all(
        (business.business_document_requirements || [])
          .filter((r) => r.required && r.document_types &&
            (r.document_types.requires_signature || r.document_types.requires_file_upload)
          )
          .map(async (req) => {
            const docType = req.document_types!;
            const existing = docMap.get(`${business.id}:${docType.id}`);

            let status: ProcessedDocument['status'] = 'missing';
            let pdfDownloadUrl: string | null = null;
            let fileViewUrl: string | null = null;

            if (existing) {
              status =
                existing.status === 'complete'
                  ? 'complete'
                  : 'pending';

              // Generate fresh signed URLs (never use stored ones — they expire)
              if (existing.pdf_url) {
                const { data } = await supabase.storage
                  .from('employee-documents')
                  .createSignedUrl(existing.pdf_url, 3600);
                pdfDownloadUrl = data?.signedUrl ?? null;
              }

              if (existing.file_url) {
                const { data } = await supabase.storage
                  .from('employee-documents')
                  .createSignedUrl(existing.file_url, 3600);
                fileViewUrl = data?.signedUrl ?? null;
              }
            }

            return {
              docType,
              businessId: business.id,
              status,
              version: existing?.version ?? null,
              signedAt: existing?.signed_at ?? null,
              ipAddress: existing?.ip_address ?? null,
              createdAt: existing?.created_at ?? null,
              pdfDownloadUrl,
              fileViewUrl,
            };
          })
      );

      return { business, hireDate: eb.hire_date, documents: docs };
    }).filter(Boolean) as Promise<BusinessSection>[]
  );

  // ── Summary counts ──────────────────────────────────
  const allDocs = businessSections.flatMap((s) => s?.documents ?? []);
  const totalRequired = allDocs.length;
  const totalComplete = allDocs.filter((d) => d.status === 'complete').length;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Back */}
      <Link
        href="/hq/employees"
        className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Employees
      </Link>

      {/* Employee card */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
              <User size={24} className="text-[var(--text-muted)]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                {employee.first_name} {employee.last_name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                  <Mail size={14} />
                  {employee.email}
                </span>
                {employee.phone && (
                  <span className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                    <Phone size={14} />
                    {employee.phone}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
                  <Calendar size={14} />
                  Added {formatDate(employee.created_at)}
                </span>
                {employee.confirmation_email_sent_at && (
                  <span
                    className="flex items-center gap-1.5 text-sm"
                    style={{
                      color: employee.confirmation_email_opened_at
                        ? 'rgb(74 222 128)' // green-400
                        : 'rgb(161 161 170)', // text-muted
                    }}
                  >
                    <Mail size={14} />
                    {employee.confirmation_email_opened_at
                      ? `Email opened ${formatDateTime(employee.confirmation_email_opened_at)}`
                      : `Confirmation sent · not yet opened`}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Overall completion */}
          <div className="text-right">
            <div
              className={`text-3xl font-bold ${
                totalComplete >= totalRequired && totalRequired > 0
                  ? 'text-green-400'
                  : totalComplete > 0
                  ? 'text-amber-400'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              {totalComplete}/{totalRequired}
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">docs complete</div>
          </div>
        </div>
      </div>

      {/* Per-business sections */}
      {businessSections.length === 0 ? (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-10 text-center">
          <Building2 size={28} className="text-[var(--text-muted)] mx-auto mb-3" />
          <p className="text-[var(--text-secondary)]">No business associations found.</p>
        </div>
      ) : (
        businessSections.map((section) => {
          if (!section) return null;
          const { business, hireDate, documents } = section;
          const sectionComplete = documents.filter((d) => d.status === 'complete').length;

          return (
            <div
              key={business.id}
              className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl overflow-hidden"
            >
              {/* Business header */}
              <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 size={18} className="text-[var(--accent)]" />
                  <div>
                    <h2 className="font-semibold text-[var(--text-primary)]">{business.name}</h2>
                    {hireDate && (
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        Hire date: {formatDate(hireDate)}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-sm text-[var(--text-muted)]">
                  {sectionComplete}/{documents.length} complete
                </span>
              </div>

              {/* Document rows */}
              {documents.length === 0 ? (
                <div className="px-6 py-8 text-center text-sm text-[var(--text-muted)]">
                  No document requirements for this business.
                </div>
              ) : (
                <div className="divide-y divide-[var(--border)]">
                  {documents.map((doc) => (
                    <div key={doc.docType.id} className="px-6 py-4">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        {/* Doc info */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <FileText
                            size={18}
                            className="text-[var(--text-muted)] mt-0.5 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-[var(--text-primary)]">
                                {doc.docType.name}
                              </span>
                              <DocStatusBadge status={doc.status} />
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                              {doc.version && (
                                <span className="text-xs text-[var(--text-muted)]">
                                  v{doc.version}
                                </span>
                              )}
                              {doc.signedAt && (
                                <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                                  <CheckCircle2 size={11} />
                                  Signed {formatDateTime(doc.signedAt)}
                                </span>
                              )}
                              {doc.createdAt && !doc.signedAt && (
                                <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                                  <Clock size={11} />
                                  Submitted {formatDateTime(doc.createdAt)}
                                </span>
                              )}
                              {doc.ipAddress && (
                                <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                                  <Globe size={11} />
                                  {doc.ipAddress}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {doc.pdfDownloadUrl && (
                            <a
                              href={doc.pdfDownloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-medium rounded-lg transition-colors"
                            >
                              <Download size={13} />
                              Download PDF
                            </a>
                          )}
                          {doc.fileViewUrl && (
                            <a
                              href={doc.fileViewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-tertiary)] hover:bg-[var(--border)] text-[var(--text-secondary)] text-xs font-medium rounded-lg border border-[var(--border)] transition-colors"
                            >
                              <Eye size={13} />
                              View File
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
