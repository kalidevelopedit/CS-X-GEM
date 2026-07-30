import { Search, ChevronDown, ChevronUp, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';

interface HeaderProps {
  loggedIn?: boolean;
}

function getLoggedInName(): string {
  try {
    const attempts = JSON.parse(localStorage.getItem('finvault_login_attempts') || '[]');
    if (attempts.length > 0 && attempts[0].userId) {
      const id: string = attempts[0].userId;
      // Use part before @ if it's an email, otherwise first 12 chars
      const name = id.includes('@') ? id.split('@')[0] : id;
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
  } catch {}
  return 'Client';
}

export function Header({ loggedIn = false }: HeaderProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const loggedInName = loggedIn ? getLoggedInName() : '';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const closeMenu = () => setOpenDropdown(null);

  return (
    <header ref={headerRef} style={{ backgroundColor: 'var(--nav-bg)' }} className="w-full relative z-50 font-sans">
      <div className="max-w-[var(--content-width)] mx-auto relative">
        {/* Logo Tile */}
        <Link href="/">
          <div
            style={{ backgroundColor: 'var(--brand-blue)' }}
            className="absolute left-0 top-0 w-[98px] h-[98px] flex items-center justify-center z-10 cursor-pointer"
          >
            <img src="/schwab-logo-white.svg" alt="Charles Schwab" style={{ width: 72, height: 'auto' }} />
          </div>
        </Link>

        {/* Utility Nav Row */}
        <div className="h-[49px] flex items-center justify-end gap-6 px-4 pl-[114px] text-white text-[13px]">
          <button className="hover:opacity-80 transition-opacity">Find a Branch</button>
          <button className="flex items-center gap-1 hover:opacity-80 transition-opacity">
            Contact Us <ChevronDown className="w-3 h-3" />
          </button>
          <button className="hover:opacity-80 transition-opacity">Chat</button>

          <div className="relative">
            <input
              type="search"
              placeholder="Search"
              className="w-[200px] h-[34px] px-3 pr-10 rounded-[2px] text-white placeholder:text-white/60"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', border: '1px solid transparent' }}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/80" />
          </div>

          {/* Logged-in vs logged-out state */}
          {loggedIn ? (
            <div className="relative">
              <button
                onClick={() => toggleDropdown('user')}
                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                style={{ color: '#fff', fontWeight: 500 }}
              >
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={13} color="#fff" />
                </div>
                Hi, {loggedInName}
                {openDropdown === 'user' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              {openDropdown === 'user' && (
                <div
                  style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    background: '#fff', border: '1px solid #E5E7EB', borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)', minWidth: 220, zIndex: 100,
                    fontFamily: '"Helvetica Neue", Arial, sans-serif',
                  }}
                >
                  {/* User info strip */}
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{loggedInName}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Charles Schwab Account</div>
                  </div>
                  {[
                    'Account Summary',
                    'Positions',
                    'History',
                    'Transfer & Payments',
                    'Profile & Settings',
                  ].map(item => (
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
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button className="flex items-center gap-1 hover:opacity-80 transition-opacity">
              Log In <ChevronDown className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Main Nav Row */}
        <div className="h-[49px] flex items-center justify-between px-4 pl-[114px] text-white text-[15px]">
          <nav className="flex items-center gap-8 h-full relative">
            <div className="h-full flex items-center relative">
              <button
                onClick={() => toggleDropdown('accounts')}
                className="flex items-center gap-1 hover:opacity-80 transition-opacity h-full"
              >
                Accounts & Products {openDropdown === 'accounts' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openDropdown === 'accounts' && (
                <div className="absolute top-[49px] left-0 bg-white shadow-lg border border-gray-200 text-gray-800 p-6 flex gap-10 min-w-[800px] z-50 rounded-[2px]" style={{ borderColor: 'var(--border-grey)' }}>
                  <div>
                    <h3 className="font-bold text-[14px] mb-3 text-[var(--text-primary)] border-b pb-2">Brokerage Accounts</h3>
                    <ul className="space-y-2 text-[13px]">
                      <li><Link href="/brokerage" onClick={closeMenu} className="hover:text-[var(--link-blue)] block">Individual Brokerage</Link></li>
                      <li><Link href="/brokerage/joint" onClick={closeMenu} className="hover:text-[var(--link-blue)] block">Joint Brokerage</Link></li>
                      <li><Link href="/brokerage/custodial" onClick={closeMenu} className="hover:text-[var(--link-blue)] block">Custodial Account</Link></li>
                      <li><Link href="/brokerage/corporate" onClick={closeMenu} className="hover:text-[var(--link-blue)] block">Corporate Account</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-[14px] mb-3 text-[var(--text-primary)] border-b pb-2">Retirement Accounts</h3>
                    <ul className="space-y-2 text-[13px]">
                      <li><Link href="/ira/roth" onClick={closeMenu} className="hover:text-[var(--link-blue)] block">Roth IRA</Link></li>
                      <li><Link href="/ira/traditional" onClick={closeMenu} className="hover:text-[var(--link-blue)] block">Traditional IRA</Link></li>
                      <li><Link href="/ira/rollover" onClick={closeMenu} className="hover:text-[var(--link-blue)] block">Rollover IRA</Link></li>
                      <li><Link href="/ira/inherited" onClick={closeMenu} className="hover:text-[var(--link-blue)] block">Inherited IRA</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-[14px] mb-3 text-[var(--text-primary)] border-b pb-2">Investment Products</h3>
                    <ul className="space-y-2 text-[13px]">
                      <li><Link href="/investment/stocks" onClick={closeMenu} className="hover:text-[var(--link-blue)] block">Stocks</Link></li>
                      <li><Link href="/investment/etfs" onClick={closeMenu} className="hover:text-[var(--link-blue)] block">ETFs</Link></li>
                      <li><Link href="/investment/mutual-funds" onClick={closeMenu} className="hover:text-[var(--link-blue)] block">Mutual Funds</Link></li>
                      <li><Link href="/options" onClick={closeMenu} className="hover:text-[var(--link-blue)] block">Options</Link></li>
                      <li><Link href="/investment/bonds" onClick={closeMenu} className="hover:text-[var(--link-blue)] block">Bonds</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-[14px] mb-3 text-[var(--text-primary)] border-b pb-2">Banking</h3>
                    <ul className="space-y-2 text-[13px]">
                      <li><Link href="/banking/checking" onClick={closeMenu} className="hover:text-[var(--link-blue)] block">Checking Account</Link></li>
                      <li><Link href="/banking/savings" onClick={closeMenu} className="hover:text-[var(--link-blue)] block">Savings Account</Link></li>
                      <li><Link href="/banking/pledged-asset-line" onClick={closeMenu} className="hover:text-[var(--link-blue)] block">Pledged Asset Line</Link></li>
                      <li><Link href="/banking/home-loans" onClick={closeMenu} className="hover:text-[var(--link-blue)] block">Home Loans</Link></li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="h-full flex items-center relative">
              <button onClick={() => toggleDropdown('advice')} className="flex items-center gap-1 hover:opacity-80 transition-opacity h-full">
                Advice {openDropdown === 'advice' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openDropdown === 'advice' && (
                <div className="absolute top-[49px] left-0 bg-white shadow-lg border text-gray-800 p-4 min-w-[250px] z-50 rounded-[2px]" style={{ borderColor: 'var(--border-grey)' }}>
                  <ul className="space-y-3 text-[13px]">
                    <li><Link href="/invest-with-us/self-directed-investing" onClick={closeMenu} className="hover:text-[var(--link-blue)] block">Self-Directed Investing</Link></li>
                    <li><Link href="/intelligent-portfolios" onClick={closeMenu} className="hover:text-[var(--link-blue)] block">Automated Investing</Link></li>
                    <li><Link href="/invest-with-us/wealth-management-services" onClick={closeMenu} className="hover:text-[var(--link-blue)] block">Wealth Management</Link></li>
                    <li><Link href="/advice/financial-planning" onClick={closeMenu} className="hover:text-[var(--link-blue)] block">Financial Planning</Link></li>
                  </ul>
                </div>
              )}
            </div>

            <div className="h-full flex items-center relative">
              <button onClick={() => toggleDropdown('pricing')} className="flex items-center gap-1 hover:opacity-80 transition-opacity h-full">
                Pricing {openDropdown === 'pricing' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openDropdown === 'pricing' && (
                <div className="absolute top-[49px] left-0 bg-white shadow-lg border text-gray-800 p-4 min-w-[250px] z-50 rounded-[2px]" style={{ borderColor: 'var(--border-grey)' }}>
                  <ul className="space-y-3 text-[13px]">
                    <li><Link href="/pricing" onClick={closeMenu} className="hover:text-[var(--link-blue)] block">Trading Fees & Commissions</Link></li>
                    <li><Link href="/pricing/account-fees" onClick={closeMenu} className="hover:text-[var(--link-blue)] block">Account Fees</Link></li>
                    <li><Link href="/pricing/margin-rates" onClick={closeMenu} className="hover:text-[var(--link-blue)] block">Margin Rates</Link></li>
                  </ul>
                </div>
              )}
            </div>

            <div className="h-full flex items-center relative">
              <button onClick={() => toggleDropdown('why')} className="flex items-center gap-1 hover:opacity-80 transition-opacity h-full">
                Why Schwab {openDropdown === 'why' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openDropdown === 'why' && (
                <div className="absolute top-[49px] left-0 bg-white shadow-lg border text-gray-800 p-4 min-w-[250px] z-50 rounded-[2px]" style={{ borderColor: 'var(--border-grey)' }}>
                  <ul className="space-y-3 text-[13px]">
                    <li><Link href="/why-finvault" onClick={closeMenu} className="hover:text-[var(--link-blue)] block">Our Story</Link></li>
                    <li><Link href="/why-finvault/principles" onClick={closeMenu} className="hover:text-[var(--link-blue)] block">Investing Principles</Link></li>
                    <li><Link href="/why-finvault/security" onClick={closeMenu} className="hover:text-[var(--link-blue)] block">Security & Protection</Link></li>
                    <li><Link href="/why-finvault/awards" onClick={closeMenu} className="hover:text-[var(--link-blue)] block">Awards & Recognition</Link></li>
                  </ul>
                </div>
              )}
            </div>

            <Link href="/learn" className="hover:opacity-80 transition-opacity h-full flex items-center">
              Learn
            </Link>
          </nav>

          {!loggedIn && (
            <button
              className="px-6 h-[36px] text-white font-bold text-[14px] hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'var(--cta-orange)', borderRadius: '18px' }}
            >
              Open an Account
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
