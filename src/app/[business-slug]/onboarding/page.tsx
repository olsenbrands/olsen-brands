'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// Load SignaturePad only on the client — it uses canvas APIs
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

type Step = 'identity' | 'sign' | 'complete';

export default function OnboardingPage() {
  const params = useParams();
  const slug = params['business-slug'] as string;

  const [business, setBusiness] = useState<Business | null>(null);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [step, setStep] = useState<Step>('identity');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [identityError, setIdentityError] = useState<string | null>(null);

  // Currently active document (for signing)
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [hasScrolledPolicy, setHasScrolledPolicy] = useState(false);
  const policyRef = useRef<HTMLDivElement>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pdfDownloadUrl, setPdfDownloadUrl] = useState<string | null>(null);

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
    const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 80;
    if (atBottom) setHasScrolledPolicy(true);
  }

  function handleIdentitySubmit(e: React.FormEvent) {
    e.preventDefault();
    setIdentityError(null);

    if (!firstName.trim()) return setIdentityError('Please enter your first name.');
    if (!lastName.trim()) return setIdentityError('Please enter your last name.');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return setIdentityError('Please enter a valid email address.');

    setStep('sign');
  }

  async function handleSubmit() {
    if (!signatureDataUrl) return;
    if (!business) return;

    const activeDoc = documentTypes[activeDocIndex];
    if (!activeDoc) return;

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

      if (!res.ok) {
        setSubmitError(json.error || 'Something went wrong. Please try again.');
        return;
      }

      setPdfDownloadUrl(json.pdfDownloadUrl || null);
      setStep('complete');
    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // ─── Loading / Error States ─────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }}
          />
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
          <h1 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Link not found
          </h1>
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
          <h1 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Nothing to complete
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {business.name} has no required documents at this time.
          </p>
        </div>
      </div>
    );
  }

  const activeDoc = documentTypes[activeDocIndex];

  // ─── Complete Screen ─────────────────────────────────────────────────────

  if (step === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-lg w-full text-center flex flex-col items-center gap-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
            style={{ background: 'rgba(76, 175, 80, 0.12)', border: '2px solid #4caf50' }}
          >
            ✓
          </div>

          <div>
            <h1 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Onboarding complete
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Thanks, {firstName}. Your signed policy has been saved.
            </p>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              {business.name} · {activeDoc.name}
            </p>
          </div>

          {pdfDownloadUrl && (
            <a
              href={pdfDownloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded text-sm font-medium transition-opacity hover:opacity-80"
              style={{ background: 'var(--accent)', color: '#ffffff' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download your signed PDF
            </a>
          )}

          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            A copy has been saved on file. You can close this window.
          </p>
        </div>
      </div>
    );
  }

  // ─── Main Layout ─────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Top bar */}
      <div
        className="w-full px-6 py-4 flex items-center gap-3"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Employee Onboarding
          </p>
          <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            {business.name}
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-8">
          {['identity', 'sign'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors"
                style={{
                  background:
                    step === s
                      ? 'var(--accent)'
                      : ['complete'].includes(step) || (step === 'sign' && s === 'identity')
                      ? 'rgba(76,175,80,0.15)'
                      : 'var(--bg-tertiary)',
                  color:
                    step === s
                      ? '#fff'
                      : ['complete'].includes(step) || (step === 'sign' && s === 'identity')
                      ? '#4caf50'
                      : 'var(--text-muted)',
                  border:
                    step === s
                      ? '2px solid var(--accent)'
                      : (step === 'sign' && s === 'identity')
                      ? '2px solid #4caf50'
                      : '2px solid var(--border)',
                }}
              >
                {step === 'sign' && s === 'identity' ? '✓' : i + 1}
              </div>
              <span
                className="text-sm hidden sm:inline"
                style={{ color: step === s ? 'var(--text-primary)' : 'var(--text-muted)' }}
              >
                {s === 'identity' ? 'Your Info' : 'Sign Documents'}
              </span>
              {i < 1 && (
                <div
                  className="w-8 h-px mx-1"
                  style={{ background: step === 'sign' ? 'var(--accent)' : 'var(--border)' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── Step 1: Identity ─────────────────────────────────────────── */}
        {step === 'identity' && (
          <form onSubmit={handleIdentitySubmit} className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                Welcome to {business.name}
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                Please enter your name and email to get started.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jane"
                    className="px-3 py-2.5 rounded text-sm outline-none transition-colors"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}
                    autoComplete="given-name"
                    autoFocus
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Smith"
                    className="px-3 py-2.5 rounded text-sm outline-none transition-colors"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="px-3 py-2.5 rounded text-sm outline-none transition-colors"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                  autoComplete="email"
                />
              </div>
            </div>

            {identityError && (
              <p className="text-sm" style={{ color: '#f44336' }}>
                {identityError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded font-medium text-sm transition-opacity hover:opacity-90"
              style={{ background: 'var(--accent)', color: '#ffffff' }}
            >
              Continue →
            </button>

            <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
              Your information is stored securely and used only for employment records.
            </p>
          </form>
        )}

        {/* ── Step 2: Sign ─────────────────────────────────────────────── */}
        {step === 'sign' && activeDoc && (
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                Document {activeDocIndex + 1} of {documentTypes.length}
              </p>
              <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                {activeDoc.name}
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                Please read the full document below, then sign at the bottom.
              </p>
            </div>

            {/* Policy text */}
            {activeDoc.content && (
              <div className="relative">
                <div
                  ref={policyRef}
                  onScroll={handlePolicyScroll}
                  className="rounded overflow-y-auto text-sm leading-relaxed whitespace-pre-wrap"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    padding: '20px',
                    maxHeight: '360px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {activeDoc.content.replace(
                    '{{EFFECTIVE_DATE}}',
                    new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                  )}
                </div>
                {!hasScrolledPolicy && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-center pb-3 pointer-events-none rounded-b"
                    style={{
                      background:
                        'linear-gradient(to bottom, transparent, var(--bg-secondary))',
                    }}
                  >
                    <span className="text-xs animate-bounce" style={{ color: 'var(--text-muted)' }}>
                      ↓ Scroll to read the full document
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Version info */}
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Version {activeDoc.current_version} · Signing as {firstName} {lastName} ({email})
            </p>

            {/* Signature pad */}
            <SignaturePad
              onSigned={setSignatureDataUrl}
              isSigned={!!signatureDataUrl}
            />

            {submitError && (
              <p className="text-sm" style={{ color: '#f44336' }}>
                {submitError}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('identity')}
                className="px-4 py-3 rounded text-sm transition-opacity hover:opacity-70"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                }}
              >
                ← Back
              </button>

              <button
                type="button"
                disabled={!signatureDataUrl || submitting}
                onClick={handleSubmit}
                className="flex-1 py-3 rounded font-medium text-sm transition-opacity disabled:opacity-40"
                style={{ background: 'var(--accent)', color: '#ffffff' }}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border-2 animate-spin"
                      style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#ffffff' }}
                    />
                    Saving…
                  </span>
                ) : (
                  'Submit & Complete Onboarding'
                )}
              </button>
            </div>

            <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
              By submitting, you confirm that you have read and agree to the above document.
              A signed copy will be saved to your employment record.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
