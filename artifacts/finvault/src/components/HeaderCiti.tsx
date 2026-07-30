import { Search, ChevronRight, ChevronDown, MapPin, Globe, X, Info, User } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'wouter';

interface HeaderCitiProps {
  loggedIn?: boolean;
}

function getLoggedInName(): string {
  try {
    const attempts = JSON.parse(localStorage.getItem('finvault_login_attempts') || '[]');
    if (attempts.length > 0 && attempts[0].userId) {
      const id: string = attempts[0].userId;
      const name = id.includes('@') ? id.split('@')[0] : id;
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
  } catch {}
  return 'Client';
}

export function HeaderCiti({ loggedIn = false }: HeaderCitiProps) {
  const [showBanner, setShowBanner] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const loggedInName = loggedIn ? getLoggedInName() : '';

  return (
    <header style={{ position: 'sticky', top: 0, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', zIndex: 50 }}>
      {/* Notification Banner */}
      {showBanner && (
        <div style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', padding: '10px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Info style={{ width: '15px', height: '15px', color: '#003087', flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: '#374151' }}>
              Your browser may affect your online banking experience. For the best experience, please ensure your browser is up to date.
            </span>
            <a href="#" style={{ fontSize: '13px', color: '#003087', textDecoration: 'underline', marginLeft: '6px', flexShrink: 0 }}>Learn More</a>
          </div>
          <button onClick={() => setShowBanner(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', flexShrink: 0 }}>
            <X style={{ width: '16px', height: '16px', color: '#6B7280' }} />
          </button>
        </div>
      )}

      {/* Strip 1 */}
      <div style={{ borderBottom: '1px solid #E5E7EB', height: '64px', padding: '0 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <svg width="90" height="40" viewBox="0 0 120 54" xmlns="http://www.w3.org/2000/svg">
              <text x="4" y="46" fontFamily="Arial,Helvetica,sans-serif" fontWeight="900" fontSize="52" fill="#003087" letterSpacing="-1">citi</text>
              <path d="M78 10 Q88 3 98 10" stroke="#E31837" strokeWidth="5" fill="none" strokeLinecap="round"/>
            </svg>
          </Link>
          <div style={{ width: '1px', height: '40px', background: '#D1D5DB', margin: '0 20px' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ border: '2px solid #6B7280', padding: '1px 5px', display: 'inline-block' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#000' }}>FDIC</span>
              </div>
              <span style={{ fontSize: '11px', color: '#374151' }}>FDIC-Insured – Backed by the full faith and credit of the U.S. Government</span>
            </div>
            <span style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '2px' }}>Charles Schwab Bank, N.A.</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <MapPin style={{ width: '18px', height: '18px', color: '#6B7280' }} />
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#6B7280' }}>ATM/BRANCH</span>
          </button>
          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Globe style={{ width: '18px', height: '18px', color: '#6B7280' }} />
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#6B7280' }}>ENGLISH</span>
          </button>

          {/* Logged-in vs logged-out */}
          {loggedIn ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(v => !v)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 10px', borderRadius: 4 }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#003087', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={14} color="#fff" />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#003087' }}>Hi, {loggedInName}</span>
                <ChevronDown style={{ width: '13px', height: '13px', color: '#003087' }} />
              </button>
              {showUserMenu && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 4px)',
                  background: '#fff', border: '1px solid #E5E7EB', borderRadius: 4,
                  boxShadow: '0 4px 20px rgba(0,48,135,0.12)', minWidth: 220, zIndex: 100,
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{loggedInName}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Schwab Account</div>
                  </div>
                  {['Account Overview', 'My Cards', 'Payments', 'Profile & Settings'].map(item => (
                    <button
                      key={item}
                      style={{ width: '100%', textAlign: 'left', padding: '9px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#374151', display: 'block' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      {item}
                    </button>
                  ))}
                  <div style={{ borderTop: '1px solid #F3F4F6' }}>
                    <button
                      onClick={() => { localStorage.removeItem('finvault_login_attempts'); window.location.href = '/'; }}
                      style={{ width: '100%', textAlign: 'left', padding: '9px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#B91C1C', display: 'block' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#FDF2F2'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Strip 2 */}
      <div style={{ borderBottom: '1px solid #E5E7EB', height: '48px', padding: '0 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link href="/investment/etfs" style={{ fontSize: '14.4px', fontWeight: 500, color: '#003087', textDecoration: 'none' }}>
            Credit Cards
          </Link>
          <Link href="/banking" style={{ fontSize: '14.4px', fontWeight: 500, color: '#003087', textDecoration: 'none' }}>
            Banking
          </Link>
          <Link href="/pricing" style={{ fontSize: '14.4px', fontWeight: 500, color: '#003087', textDecoration: 'none' }}>
            Lending
          </Link>
          <Link href="/investment/etfs" style={{ fontSize: '14.4px', fontWeight: 500, color: '#003087', textDecoration: 'none' }}>
            Investing
          </Link>
          <Link href="/invest-with-us/wealth-management-services" style={{ fontSize: '14.4px', fontWeight: 500, color: '#003087', textDecoration: 'none' }}>
            Wealth Management
          </Link>
          {!loggedIn && (
            <Link href="/brokerage" style={{ fontSize: '14.4px', fontWeight: 600, color: '#003087', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}>
              Open an Account
              <ChevronRight style={{ width: '13px', height: '13px' }} />
            </Link>
          )}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <Search style={{ width: '18px', height: '18px', color: '#003087' }} />
          <span style={{ fontSize: '14px', color: '#6B7280' }}>How can we help?</span>
        </div>
      </div>
    </header>
  );
}
