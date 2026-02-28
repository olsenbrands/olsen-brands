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
  step_type: string; // 'signature' | 'file_upload' | 'informational' | 'app_download' | 'survey'
  requires_signature: boolean;
  requires_file_upload: boolean;
  requires_form_fill: boolean;
  current_version: string;
  content: string | null;
  content_url: string | null;
  app_store_url: string | null;
  play_store_url: string | null;
};

type Business = {
  id: string;
  name: string;
  slug: string;
  type: string | null;
  location: string | null;
  welcome_copy: string | null;
  logo_url: string | null;
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

  // Survey
  const [surveyRating, setSurveyRating] = useState<number | null>(null);
  const [surveyWasClear, setSurveyWasClear] = useState<boolean | null>(null);
  const [surveyFeedback, setSurveyFeedback] = useState('');

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

  function advanceOrComplete(newEmpId: string | null, completedDoc: CompletedDoc | null) {
    if (completedDoc) setCompletedDocs(prev => [...prev, completedDoc]);
    if (newEmpId) setEmployeeId(newEmpId);

    if (activeDocIndex + 1 < documentTypes.length) {
      setActiveDocIndex(activeDocIndex + 1);
      resetDocState();
    } else {
      setStep('complete');
    }
  }

  function handleInformationalAdvance() {
    advanceOrComplete(null, null);
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

  // Submit survey
  async function handleSurveySubmit() {
    if (!surveyRating) return setSubmitError('Please select a rating before submitting.');
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`/api/onboarding/${slug}/survey`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          rating: surveyRating,
          wasClear: surveyWasClear,
          feedback: surveyFeedback,
        }),
      });
      const json = await res.json();
      if (!res.ok) return setSubmitError(json.error || 'Something went wrong. Please try again.');
      advanceOrComplete(null, null);
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
      {/* Header + progress */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
        {/* Top row */}
        <div className="px-6 pt-4 pb-2 flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Employee Onboarding
            </p>
            <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              {business.name}
            </p>
          </div>
          {/* Big step counter */}
          <div className="text-right">
            <p className="leading-none">
              <span className="text-3xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                {currentStepNum}
              </span>
              <span className="text-base font-medium" style={{ color: 'var(--text-muted)' }}> / {totalSteps}</span>
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>steps complete</p>
          </div>
        </div>

        {/* Current step label */}
        <div className="px-6 pb-2">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
            {step === 'identity' ? 'Getting started' : activeDoc ? activeDoc.name : ''}
          </p>
        </div>

        {/* Segmented progress bar — one pill per step */}
        <div className="px-6 pb-4 flex gap-1.5">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
            <div
              key={s}
              className="flex-1 rounded-full transition-all duration-500"
              style={{
                height: '6px',
                background: s <= currentStepNum ? 'var(--accent)' : 'var(--border)',
                opacity: s < currentStepNum ? 0.45 : s === currentStepNum ? 1 : 0.2,
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* ── Step: Identity ──────────────────────────────────────────────── */}
        {step === 'identity' && (
          <form onSubmit={handleIdentitySubmit} className="flex flex-col gap-8">

            {/* Welcome narrative */}
            <div className="flex flex-col gap-5">
              {/* Logo / icon + heading */}
              <div className="flex flex-col gap-4">
                {business.logo_url ? (
                  <img
                    src={business.logo_url}
                    alt={`${business.name} logo`}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                ) : (
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: 'rgba(201,83,60,0.12)', border: '1px solid rgba(201,83,60,0.25)' }}
                  >
                    🎉
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                    Welcome to the {business.name} family.
                  </h2>
                  {business.location && (
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                      {business.location} · We&apos;re so glad you&apos;re here.
                    </p>
                  )}
                </div>
              </div>

              {/* Business narrative */}
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {business.welcome_copy ??
                  `We work hard, take care of each other, and have a lot of fun doing it. You're joining a team that's genuinely excited to have you — and we can't wait to see what you bring.`}
              </p>

              {/* Divider + what-to-expect */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }} className="flex flex-col gap-3">
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  First things first — let&apos;s get your paperwork completed.
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Here&apos;s what you&apos;ll do on the next {totalDocs > 1 ? `${totalDocs} steps` : 'step'}:
                </p>
                <ul className="flex flex-col gap-2.5">
                  {documentTypes.map((doc) => {
                    const icon =
                      doc.step_type === 'signature' ? '📋'
                      : doc.step_type === 'file_upload' ? '📎'
                      : doc.step_type === 'informational' ? '💳'
                      : doc.step_type === 'app_download' ? '📱'
                      : doc.step_type === 'survey' ? '⭐'
                      : '✅';
                    const copy =
                      doc.step_type === 'signature'
                        ? <><strong style={{ color: 'var(--text-primary)' }}>Read and sign our {doc.name}.</strong>{' '}This sets clear expectations for what great performance looks like on our team.</>
                      : doc.step_type === 'file_upload'
                        ? <><strong style={{ color: 'var(--text-primary)' }}>Upload your {doc.name}.</strong>{' '}Don&apos;t have it yet? No problem — just let us know and we&apos;ll follow up.</>
                      : doc.step_type === 'informational'
                        ? <><strong style={{ color: 'var(--text-primary)' }}>{doc.name}.</strong>{' '}Important info you&apos;ll want to read before your first shift.</>
                      : doc.step_type === 'app_download'
                        ? <><strong style={{ color: 'var(--text-primary)' }}>{doc.name}.</strong>{' '}We&apos;ll walk you through getting set up with the apps your team uses every day.</>
                      : doc.step_type === 'survey'
                        ? <><strong style={{ color: 'var(--text-primary)' }}>Share your experience.</strong>{' '}A quick 30-second survey so we can keep making onboarding better.</>
                      : <><strong style={{ color: 'var(--text-primary)' }}>{doc.name}.</strong>{' '}{doc.description ?? ''}</>;
                    return (
                      <li key={doc.id} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <span className="mt-0.5 flex-shrink-0 text-base leading-none">{icon}</span>
                        <span>{copy}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Form fields */}
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
              Let&apos;s go →
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

            {/* ── Informational Step ── */}
            {activeDoc.step_type === 'informational' && (
              <>
                {activeDoc.content && (
                  <div className="rounded-lg p-5 text-sm leading-relaxed whitespace-pre-wrap"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                    {activeDoc.content}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleInformationalAdvance}
                  className="w-full py-3 rounded font-medium text-sm transition-opacity hover:opacity-90"
                  style={{ background: 'var(--accent)', color: '#ffffff' }}>
                  Got it →
                </button>
              </>
            )}

            {/* ── App Download Step ── */}
            {activeDoc.step_type === 'app_download' && (
              <>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {activeDoc.slug === 'mytoast-app'
                    ? 'MyToast is where you see your schedule and request time off. Download it now and you\'ll be all set before your first shift.'
                    : activeDoc.slug === 'band-app'
                    ? 'Band is how your team communicates — schedule updates, announcements, shift changes, and team posts all live here. Download it and watch for an invite from your manager.'
                    : `Download ${activeDoc.name} to stay connected with your team.`}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  {activeDoc.app_store_url && (
                    <a
                      href={activeDoc.app_store_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-5 py-3.5 rounded-lg transition-opacity hover:opacity-80 flex-1 justify-center"
                      style={{ background: '#000000', color: '#ffffff' }}
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      <span className="font-medium text-sm">App Store</span>
                    </a>
                  )}
                  {activeDoc.play_store_url && (
                    <a
                      href={activeDoc.play_store_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-5 py-3.5 rounded-lg transition-opacity hover:opacity-80 flex-1 justify-center"
                      style={{ background: '#01875f', color: '#ffffff' }}
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M3.18 23.76c.3.18.64.24.98.2L14.76 12 3.18 0c-.34-.04-.68.02-.98.2C1.6.62 1.25 1.2 1.25 2v19.98c0 .8.35 1.38.93 1.78zM16.54 13.77l-2.85-2.85 2.85-2.85 3.42 1.97c.98.56.98 1.48 0 2.04l-3.42 1.97-3.42 1.97zm-1.42-1.42L3.67 1.52l10.38 10.41-3.37 3.37 4.44-2.95z"/>
                      </svg>
                      <span className="font-medium text-sm">Google Play</span>
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleInformationalAdvance}
                  className="w-full py-3 rounded font-medium text-sm transition-opacity hover:opacity-90"
                  style={{ background: 'var(--accent)', color: '#ffffff' }}>
                  {activeDocIndex + 1 < totalDocs ? `I've downloaded it →` : `All done →`}
                </button>
              </>
            )}

            {/* ── Survey Step ── */}
            {activeDoc.step_type === 'survey' && (
              <>
                <p style={{ color: 'var(--text-secondary)' }}>
                  You&apos;re almost done! Before you go, take 30 seconds to let us know how your onboarding went. Your feedback genuinely helps us make this better for the next person.
                </p>

                {/* Star rating */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    How was your overall onboarding experience?
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setSurveyRating(star)}
                        className="text-3xl transition-transform hover:scale-110 active:scale-95"
                        style={{ opacity: surveyRating && star <= surveyRating ? 1 : 0.25 }}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                  {surveyRating && (
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {surveyRating === 5 ? 'Amazing — glad to hear it! 🎉'
                        : surveyRating === 4 ? 'Great! Thanks for the feedback.'
                        : surveyRating === 3 ? 'Good to know. We\'ll work on it.'
                        : surveyRating === 2 ? 'Sorry it wasn\'t smoother. We appreciate the honesty.'
                        : 'We\'re sorry. We want to do better — tell us what happened below.'}
                    </p>
                  )}
                </div>

                {/* Was it clear? */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Was everything clear and easy to understand?
                  </label>
                  <div className="flex gap-3">
                    {[{ label: 'Yes', val: true }, { label: 'Not really', val: false }].map(({ label, val }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setSurveyWasClear(val)}
                        className="px-4 py-2 rounded text-sm font-medium transition-all"
                        style={{
                          background: surveyWasClear === val ? 'var(--accent)' : 'var(--bg-secondary)',
                          color: surveyWasClear === val ? '#ffffff' : 'var(--text-secondary)',
                          border: `1px solid ${surveyWasClear === val ? 'var(--accent)' : 'var(--border)'}`,
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Any feedback or suggestions? <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
                  </label>
                  <textarea
                    value={surveyFeedback}
                    onChange={(e) => setSurveyFeedback(e.target.value)}
                    placeholder="What could we improve? What worked well?"
                    rows={3}
                    className="px-3 py-2.5 rounded text-sm outline-none resize-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  />
                </div>

                {submitError && <p className="text-sm" style={{ color: '#f44336' }}>{submitError}</p>}

                <button
                  type="button"
                  disabled={!surveyRating || submitting}
                  onClick={handleSurveySubmit}
                  className="w-full py-3 rounded font-medium text-sm transition-opacity disabled:opacity-40"
                  style={{ background: 'var(--accent)', color: '#ffffff' }}>
                  {submitting ? <Spinner /> : 'Submit & Finish Onboarding →'}
                </button>

                <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                  Your feedback goes directly to management. Thanks for helping us improve.
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
