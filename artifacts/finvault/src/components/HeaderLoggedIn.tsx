/**
 * Schwab logged-in navigation bar.
 * Matches the reference image: Accounts | Trade | Research | Move Money | Products | Learn | How To
 * Right: Search | Messages | Support | User Name ▾
 */
import { useState, useRef, useEffect } from 'react';
import { Search, Mail, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Link } from 'wouter';

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

interface DropdownItem { label: string; href?: string }
const NAV_MENUS: Record<string, DropdownItem[]> = {
  Accounts: [
    { label: 'Account Summary' }, { label: 'Positions' }, { label: 'History' },
    { label: 'Statements' }, { label: 'Account Features' },
  ],
  Trade: [
    { label: 'Stocks & ETFs' }, { label: 'Options' }, { label: 'Mutual Funds' },
    { label: 'Fixed Income' }, { label: 'Futures' },
  ],
  Research: [
    { label: 'U.S. Markets' }, { label: 'International Markets' },
    { label: 'Research Tools' }, { label: 'Watchlist' },
  ],
  'Move Money': [
    { label: 'Deposit & Withdraw' }, { label: 'Transfer Between Accounts' },
    { label: 'Wire Funds' }, { label: 'Pay Bills' },
  ],
  Products: [
    { label: 'Schwab Bank' }, { label: 'Intelligent Portfolios' },
    { label: 'Advisor Services' }, { label: 'Schwab 529' },
  ],
  Learn: [
    { label: 'Market Commentary' }, { label: 'Insights & Ideas' },
    { label: 'Education Center' }, { label: 'Events' },
  ],
  'How To': [
    { label: 'Order Types' }, { label: 'Trade Walkthrough' },
    { label: 'Video Tutorials' }, { label: 'FAQs' },
  ],
};

export function HeaderLoggedIn() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const name = getLoggedInName();

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, []);

  return (
    <header
      ref={headerRef}
      style={{
        background: '#fff',
        borderBottom: '1px solid #E5E7EB',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'stretch', height: 48 }}>

        {/* Logo tile */}
        <Link href="/">
          <div style={{
            width: 82, height: 48, background: '#1AACE2', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0, cursor: 'pointer',
          }}>
            <svg width="60" height="36" viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
              <text x="100" y="60" textAnchor="middle" fontFamily="Georgia,'Times New Roman',serif" fontStyle="italic" fontSize="52" fontWeight="400" fill="white">charles</text>
              <text x="100" y="108" textAnchor="middle" fontFamily="Arial,Helvetica,sans-serif" fontWeight="900" fontSize="38" fill="white" letterSpacing="3">SCHWAB</text>
            </svg>
          </div>
        </Link>

        {/* Nav items */}
        <nav style={{ display: 'flex', alignItems: 'stretch', flex: 1 }}>
          {Object.entries(NAV_MENUS).map(([label, items]) => (
            <div key={label} style={{ position: 'relative', display: 'flex', alignItems: 'stretch' }}>
              <button
                onClick={() => setOpenMenu(openMenu === label ? null : label)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 3,
                  padding: '0 12px', height: '100%', background: 'none', border: 'none',
                  cursor: 'pointer', fontSize: 13.5, fontWeight: 500, color: '#1F2937',
                  borderBottom: openMenu === label ? '2px solid #1AACE2' : '2px solid transparent',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { if (openMenu !== label) e.currentTarget.style.color = '#1AACE2'; }}
                onMouseLeave={(e) => { if (openMenu !== label) e.currentTarget.style.color = '#1F2937'; }}
              >
                {label}
                {openMenu === label ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>

              {openMenu === label && (
                <div style={{
                  position: 'absolute', top: 48, left: 0, minWidth: 200,
                  background: '#fff', border: '1px solid #E5E7EB', borderTop: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100,
                }}>
                  {items.map(item => (
                    <button key={item.label}
                      onClick={() => setOpenMenu(null)}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        padding: '9px 16px', background: 'none', border: 'none',
                        cursor: 'pointer', fontSize: 13, color: '#374151',
                        borderBottom: '1px solid #F9FAFB',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#F0F8FF'; e.currentTarget.style.color = '#1AACE2'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#374151'; }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right side: Search | Messages | Support | User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '0 12px', flexShrink: 0 }}>

          {/* Search */}
          <div style={{ position: 'relative', marginRight: 4 }}>
            <input
              type="search"
              placeholder="Search"
              style={{
                height: 28, width: 150, padding: '0 28px 0 10px', border: '1px solid #D1D5DB',
                borderRadius: 3, fontSize: 12, color: '#374151', outline: 'none',
                background: '#F9FAFB',
              }}
            />
            <Search size={13} color="#9CA3AF" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Messages */}
          <button style={{
            display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'none',
            border: 'none', cursor: 'pointer', fontSize: 12.5, color: '#374151', borderRadius: 3,
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#F3F4F6'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}>
            <Mail size={15} color="#374151" />
            <span>Messages</span>
          </button>

          {/* Support */}
          <button style={{
            display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'none',
            border: 'none', cursor: 'pointer', fontSize: 12.5, color: '#374151', borderRadius: 3,
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#F3F4F6'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}>
            <HelpCircle size={15} color="#374151" />
            <span>Support</span>
          </button>

          {/* User name dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowUserMenu(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px',
                background: showUserMenu ? '#F3F4F6' : 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600, color: '#111827', borderRadius: 3,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#F3F4F6'; }}
              onMouseLeave={(e) => { if (!showUserMenu) e.currentTarget.style.background = 'none'; }}
            >
              {/* Avatar circle */}
              <div style={{
                width: 26, height: 26, borderRadius: '50%', background: '#344B58',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>
                  {name.slice(0, 1).toUpperCase()}
                </span>
              </div>
              {name}
              {showUserMenu ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {showUserMenu && (
              <div style={{
                position: 'absolute', right: 0, top: 44,
                background: '#fff', border: '1px solid #E5E7EB',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)', borderRadius: 3, minWidth: 210, zIndex: 100,
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{name}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Charles Schwab Account</div>
                </div>
                {['Account Summary', 'Positions', 'History', 'Transfer & Payments', 'Profile & Settings'].map(item => (
                  <button key={item}
                    style={{ width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#374151', display: 'block' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                    {item}
                  </button>
                ))}
                <div style={{ borderTop: '1px solid #F3F4F6' }}>
                  <button
                    onClick={() => { localStorage.removeItem('finvault_login_attempts'); window.location.href = '/'; }}
                    style={{ width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#B91C1C', display: 'block' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#FDF2F2'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
