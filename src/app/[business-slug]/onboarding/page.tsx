'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const SignaturePad = dynamic(() => import('@/components/onboarding/SignaturePad'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-40 rounded flex items-center justify-center"
      style={{ background: '#f5f5f5', border: '1px solid var(--border)' }}
    >
      <span style={{ color: 'var(--text-muted)' }}>Loading signature pad…</span>
    </div>
  ),
});

type DocumentType = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  requires_signature: boolean;
  requires_file_upload: boolean;
  requires_form_fill: boolean;
  current_version: string;
  content: string | null;
};

type Business = {
  id: string;
  name: string;
  slug: string;
  type: string | null;
  location: string | null;
};

type Step = 'identity' | 'document' | 'complete';

type CompletedDoc = {
  documentId: string;
  pdfDownloadUrl: string | null;
};

export default function OnboardingPage() {
  const params = useParams();
  const slug = params['business-slug'] as string;

  const [business, setBusiness] = useState<Business | null>(null);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Steps
  const [step, setStep] = useState<Step>('identity');
  const [activeDocIndex, setActiveDocIndex] = useState(0);

  // Identity
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [identityError, setIdentityError] = useState<string | null>(null);

  // Track employee ID across docs
  const [employeeId, setEmployeeId] = useState<string | null>(null);

  // Signature doc state
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [hasScrolledPolicy, setHasScrolledPolicy] = useState(false);
  const policyRef = useRef<HTMLDivElement>(null);

  // File upload doc state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [completedDocs, setCompletedDocs] = useState<CompletedDoc[]>([]);

  // Reset per-doc state when moving to a new doc
  const resetDocState = useCallback(() => {
    setSignatureDataUrl(null);
    setHasScrolledPolicy(false);
    setSelectedFile(null);
    setFilePreviewUrl(null);
    setSubmitError(null);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/onboarding/${slug}`);
        if (!res.ok) {
          const json = await res.json();
          setError(json.error || 'This onboarding link is not valid.');
          return;
        }
        const json = await res.json();
        setBusiness(json.business);
        setDocumentTypes(json.documentTypes || []);
      } catch {
        setError('Failed to load. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  function handlePolicyScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 80) setHasScrolledPolicy(true);
  }

  function handleIdentitySubmit(e: React.FormEvent) {
    e.preventDefault();
    setIdentityError(null);
    if (!firstName.trim()) return setIdentityError('Please enter your first name.');
    if (!lastName.trim()) return setIdentityError('Please enter your last name.');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return setIdentityError('Please enter a valid email address.');
    setStep('document');
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file && file.type.startsWith('image/')) {
      setFilePreviewUrl(URL.createObjectURL(file));
    } else {
      setFilePreviewUrl(null);
    }
  }

  function advanceOrComplete(newEmpId: string, completedDoc: CompletedDoc) {
    const updated = [...completedDocs, completedDoc];
    setCompletedDocs(updated);
    setEmployeeId(newEmpId);

    if (activeDocIndex + 1 < documentTypes.length) {
      setActiveDocIndex(activeDocIndex + 1);
      resetDocState();
    } else {
      setStep('complete');
    }
  }

  // Submit signature doc
  async function handleSignatureSubmit() {
    if (!signatureDataUrl) return;
    const activeDoc = documentTypes[activeDocIndex];
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`/api/onboarding/${slug}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          documentTypeId: activeDoc.id,
          signatureDataUrl,
        }),
      });
      const json = await res.json();
      if (!res.ok) return setSubmitError(json.error || 'Something went wrong. Please try again.');
      advanceOrComplete(json.employeeId, { documentId: json.documentId, pdfDownloadUrl: json.pdfDownloadUrl });
    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // Submit file upload doc
  async function handleUploadSubmit() {
    if (!selectedFile || !employeeId) return;
    const activeDoc = documentTypes[activeDocIndex];
    setSubmitting(true);
    setSubmitError(null);

    try {
      const fd = new FormData();
      fd.append('employeeId', employeeId);
      fd.append('documentTypeId', activeDoc.id);
      fd.append('file', selectedFile);

      const res = await fetch(`/api/onboarding/${slug}/upload`, { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) return setSubmitError(json.error || 'Something went wrong. Please try again.');
      advanceOrComplete(employeeId, { documentId: json.documentId, pdfDownloadUrl: null });
    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // Force file download (not open in browser)
  async function handleDownload(url: string, filename: string) {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, '_blank');
    }
  }

  // ─── Loading / Error ──────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-md w-full text-center">
          <div className="text-4xl mb-4">🔗</div>
          <h1 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Link not found</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{error || 'This onboarding link is not valid.'}</p>
        </div>
      </div>
    );
  }

  if (documentTypes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-md w-full text-center">
          <div className="text-4xl mb-4">✅</div>
          <h1 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Nothing to complete</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{business.name} has no required documents at this time.</p>
        </div>
      </div>
    );
  }

  const activeDoc = documentTypes[activeDocIndex];
  const totalDocs = documentTypes.length;
  const pdfDoc = completedDocs.find(d => d.pdfDownloadUrl);

  // ─── Complete Screen ──────────────────────────────────────────────────────

  if (step === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-lg w-full text-center flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
            style={{ background: 'rgba(76, 175, 80, 0.12)', border: '2px solid #4caf50' }}>
            ✓
          </div>
          <div>
            <h1 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Onboarding complete
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Thanks, {firstName}. All your documents have been submitted and saved.
            </p>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              {business.name} · {completedDocs.length} document{completedDocs.length !== 1 ? 's' : ''} on file
            </p>
          </div>

          {pdfDoc?.pdfDownloadUrl && (
            <button
              onClick={() => handleDownload(
                pdfDoc.pdfDownloadUrl!,
                `${business.name.replace(/\s+/g, '-')}-Employee-Policy.pdf`
              )}
              className="inline-flex items-center gap-2 px-5 py-3 rounded text-sm font-medium transition-opacity hover:opacity-80"
              style={{ background: 'var(--accent)', color: '#ffffff' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download your signed policy PDF
            </button>
          )}

          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Your records are on file. You can close this window.
          </p>
        </div>
      </div>
    );
  }

  // ─── Main Layout ──────────────────────────────────────────────────────────

  const totalSteps = totalDocs + 1; // +1 for identity
  const currentStepNum = step === 'identity' ? 1 : activeDocIndex + 2;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Top bar */}
      <div className="w-full px-6 py-4 flex items-center gap-3"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Employee Onboarding
          </p>
          <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            {business.name}
          </p>
        </div>
        <div className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>
          Step {currentStepNum} of {totalSteps}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1" style={{ background: 'var(--border)' }}>
        <div
          className="h-1 transition-all duration-500"
          style={{
            background: 'var(--accent)',
            width: `${(currentStepNum / totalSteps) * 100}%`,
          }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* ── Step: Identity ──────────────────────────────────────────────── */}
        {step === 'identity' && (
          <form onSubmit={handleIdentitySubmit} className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                Welcome to {business.name}
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                Please enter your name and email to get started. You'll complete {totalDocs} document{totalDocs !== 1 ? 's' : ''} today.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>First Name</label>
                  <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                    placeholder="Jane" autoFocus autoComplete="given-name"
                    className="px-3 py-2.5 rounded text-sm outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Last Name</label>
                  <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                    placeholder="Smith" autoComplete="family-name"
                    className="px-3 py-2.5 rounded text-sm outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="jane@example.com" autoComplete="email"
                  className="px-3 py-2.5 rounded text-sm outline-none"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
              </div>
            </div>

            {identityError && <p className="text-sm" style={{ color: '#f44336' }}>{identityError}</p>}

            <button type="submit" className="w-full py-3 rounded font-medium text-sm transition-opacity hover:opacity-90"
              style={{ background: 'var(--accent)', color: '#ffffff' }}>
              Continue →
            </button>

            <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
              Your information is stored securely and used only for employment records.
            </p>
          </form>
        )}

        {/* ── Step: Document ──────────────────────────────────────────────── */}
        {step === 'document' && activeDoc && (
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                Document {activeDocIndex + 1} of {totalDocs}
              </p>
              <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                {activeDoc.name}
              </h2>
              {activeDoc.description && (
                <p style={{ color: 'var(--text-secondary)' }}>{activeDoc.description}</p>
              )}
            </div>

            {/* ── Signature Document ── */}
            {activeDoc.requires_signature && (
              <>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Please read the full document below, then sign at the bottom.
                </p>

                {activeDoc.content && (
                  <div className="relative">
                    <div ref={policyRef} onScroll={handlePolicyScroll}
                      className="rounded overflow-y-auto text-sm leading-relaxed whitespace-pre-wrap"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        padding: '20px',
                        maxHeight: '360px',
                        color: 'var(--text-secondary)',
                      }}>
                      {activeDoc.content.replace(
                        '{{EFFECTIVE_DATE}}',
                        new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                      )}
                    </div>
                    {!hasScrolledPolicy && (
                      <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-center pb-3 pointer-events-none rounded-b"
                        style={{ background: 'linear-gradient(to bottom, transparent, var(--bg-secondary))' }}>
                        <span className="text-xs animate-bounce" style={{ color: 'var(--text-muted)' }}>
                          ↓ Scroll to read the full document
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Version {activeDoc.current_version} · Signing as {firstName} {lastName} ({email})
                </p>

                <SignaturePad onSigned={setSignatureDataUrl} isSigned={!!signatureDataUrl} />

                {submitError && <p className="text-sm" style={{ color: '#f44336' }}>{submitError}</p>}

                <button
                  type="button"
                  disabled={!signatureDataUrl || submitting}
                  onClick={handleSignatureSubmit}
                  className="w-full py-3 rounded font-medium text-sm transition-opacity disabled:opacity-40"
                  style={{ background: 'var(--accent)', color: '#ffffff' }}>
                  {submitting ? <Spinner /> : activeDocIndex + 1 < totalDocs ? 'Save & Continue →' : 'Submit & Complete Onboarding'}
                </button>

                <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                  By submitting, you confirm that you have read and agree to the above document.
                </p>
              </>
            )}

            {/* ── File Upload Document ── */}
            {activeDoc.requires_file_upload && (
              <>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Upload a photo or PDF of your valid Food Handler's Permit. Make sure the name, date, and issuing authority are clearly visible.
                </p>

                <div
                  className="rounded flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors"
                  style={{
                    border: `2px dashed ${selectedFile ? 'var(--accent)' : 'var(--border)'}`,
                    padding: '32px 20px',
                    background: selectedFile ? 'rgba(201, 83, 60, 0.04)' : 'var(--bg-secondary)',
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {filePreviewUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={filePreviewUrl} alt="Permit preview" className="max-h-48 rounded object-contain" />
                  ) : selectedFile ? (
                    <div className="flex items-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--accent)' }}>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {selectedFile.name}
                      </span>
                    </div>
                  ) : (
                    <>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text-muted)' }}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
                        Tap to upload a photo or PDF
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        JPG, PNG, HEIC, or PDF · Max 10MB
                      </p>
                    </>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/heic,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {selectedFile && (
                  <button
                    type="button"
                    onClick={() => { setSelectedFile(null); setFilePreviewUrl(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    className="text-sm underline self-start transition-opacity hover:opacity-70"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Remove file
                  </button>
                )}

                {submitError && <p className="text-sm" style={{ color: '#f44336' }}>{submitError}</p>}

                <button
                  type="button"
                  disabled={!selectedFile || submitting}
                  onClick={handleUploadSubmit}
                  className="w-full py-3 rounded font-medium text-sm transition-opacity disabled:opacity-40"
                  style={{ background: 'var(--accent)', color: '#ffffff' }}>
                  {submitting ? <Spinner /> : activeDocIndex + 1 < totalDocs ? 'Save & Continue →' : 'Submit & Complete Onboarding'}
                </button>

                <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                  Your permit is stored securely and only accessible to management.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <span className="flex items-center justify-center gap-2">
      <div className="w-4 h-4 rounded-full border-2 animate-spin"
        style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#ffffff' }} />
      Saving…
    </span>
  );
}
