'use client';

import { useRef } from 'react';
import ReactSignatureCanvas from 'react-signature-canvas';

interface SignaturePadProps {
  onSigned: (dataUrl: string | null) => void;
  isSigned: boolean;
}

export default function SignaturePad({ onSigned, isSigned }: SignaturePadProps) {
  const sigRef = useRef<ReactSignatureCanvas>(null);

  function handleEnd() {
    if (!sigRef.current || sigRef.current.isEmpty()) return;
    const dataUrl = sigRef.current.getCanvas().toDataURL('image/png');
    onSigned(dataUrl);
  }

  function handleClear() {
    sigRef.current?.clear();
    onSigned(null);
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
        Sign your name below
      </label>

      <div
        className="relative rounded overflow-hidden"
        style={{ border: '1px solid var(--border)', background: '#ffffff' }}
      >
        <ReactSignatureCanvas
          ref={sigRef}
          penColor="#1a1a1a"
          canvasProps={{
            width: 600,
            height: 160,
            className: 'w-full touch-none',
            style: { display: 'block' },
          }}
          onEnd={handleEnd}
        />

        {!isSigned && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ color: '#cccccc', fontSize: '14px' }}
          >
            Draw your signature here
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleClear}
          className="text-sm underline transition-opacity hover:opacity-70"
          style={{ color: 'var(--text-muted)' }}
        >
          Clear signature
        </button>

        {isSigned && (
          <span className="text-sm flex items-center gap-1.5" style={{ color: '#4caf50' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Signature captured
          </span>
        )}
      </div>
    </div>
  );
}
