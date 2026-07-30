import { HeaderCiti } from '@/components/HeaderCiti';
import { HeroCiti } from '@/components/HeroCiti';
import { ShortcutBarCiti } from '@/components/ShortcutBarCiti';
import { ChevronRight } from 'lucide-react';
import { Link } from 'wouter';

// ── Product Cards ─────────────────────────────────────────────────────────────

function ProductSectionCiti() {
  const cards = [
    {
      eyebrow: 'SCHWAB® / AADVANTAGE® PLATINUM SELECT®',
      title: 'Earn 80,000 AAdvantage® bonus miles',
      description: 'After $3,500 in purchases within the first 4 months of account opening. Limited Time Offer!',
      image: '/card-doublecash.png',
      imgBg: '#1a1a2e',
      cta: 'Apply Now',
      cta2: 'Additional Information',
    },
    {
      eyebrow: 'SCHWAB® / AADVANTAGE® CREDIT CARDS',
      title: 'Explore Schwab® / AAdvantage® cards',
      description: 'Travel to over 1,000 destinations worldwide with AAdvantage® bonus miles.',
      image: '/cards-grid.png',
      imgBg: '#E8EEF6',
      cta: 'Learn More',
      cta2: null,
    },
    {
      eyebrow: 'SCHWAB® CHECKING ACCOUNT',
      title: '',
      description: 'Earn a bonus when you open a Regular Checking account with Enhanced Direct Deposits & required activities.',
      isBonusCard: true,
      cta: 'Learn More',
      cta2: null,
    },
  ];

  return (
    <div style={{ background: '#fff', padding: '40px 48px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {cards.map((card, i) => (
          <div
            key={i}
            style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
          >
            {/* Image area */}
            {card.isBonusCard ? (
              <div style={{ height: '200px', background: '#003087', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '1px', marginBottom: '8px' }}>EARN A</div>
                <div style={{ fontSize: '64px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>$325</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginTop: '8px' }}>Checking Bonus</div>
              </div>
            ) : (
              <div style={{ height: '200px', background: card.imgBg, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={card.image}
                  alt={card.eyebrow}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}

            {/* Text area */}
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>
                {card.eyebrow}
              </div>
              {card.title && (
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#111827', margin: '0 0 8px', lineHeight: 1.3 }}>
                  {card.title}
                </h3>
              )}
              <p style={{ fontSize: '13.5px', color: '#6B7280', lineHeight: '1.6', marginBottom: '16px', flex: 1 }}>
                {card.description}
              </p>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button style={{ background: '#003087', color: '#fff', border: 'none', borderRadius: '4px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#0041B8'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#003087'}>
                  {card.cta}
                </button>
                {card.cta2 && (
                  <a href="#" style={{ fontSize: '13px', color: '#003087', textDecoration: 'underline', fontWeight: 500 }}>
                    {card.cta2}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Credit Card Promo (two-row layout matching Citi.com) ──────────────────────

function CreditCardPromoCiti() {
  return (
    <div style={{ background: '#EAF3FB', padding: '0 48px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Row 1: 4-card grid left, copy right */}
        <div style={{ display: 'flex', gap: '48px', alignItems: 'center', padding: '40px 0 32px', borderBottom: '1px solid rgba(0,48,135,0.1)' }}>
          <div style={{ flex: '0 0 380px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
            <img src="/cards-grid.png" alt="Schwab credit cards" style={{ width: '100%', display: 'block' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', color: '#6B7280', textTransform: 'uppercase', marginBottom: '10px' }}>
              SCHWAB® CREDIT CARDS
            </div>
            <h2 style={{ fontSize: '34px', fontWeight: 900, color: '#111827', lineHeight: '1.1', marginBottom: '14px' }}>
              Choose the right Schwab®<br />credit card for you
            </h2>
            <p style={{ fontSize: '15px', color: '#4B5563', marginBottom: '22px', lineHeight: 1.6 }}>
              Whether you want Cash Back, a Low Intro Rate, Rewards for Costco Members, or Great Airline Miles, the choice is all yours.
            </p>
            <button
              style={{ background: '#003087', color: '#fff', border: 'none', borderRadius: '4px', padding: '13px 28px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#0041B8'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#003087'}>
              Learn More
            </button>
          </div>
        </div>

        {/* Row 2: copy left, Double Cash card right */}
        <div style={{ display: 'flex', gap: '48px', alignItems: 'center', padding: '32px 0 40px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', color: '#6B7280', textTransform: 'uppercase', marginBottom: '10px' }}>
              SCHWAB® DOUBLE CASH℠ CARD
            </div>
            <h2 style={{ fontSize: '34px', fontWeight: 900, color: '#111827', lineHeight: '1.1', marginBottom: '12px' }}>
              Earn 2% Cash Back
            </h2>
            <p style={{ fontSize: '15px', color: '#4B5563', marginBottom: '22px', lineHeight: 1.6 }}>
              1% when you buy and 1% as you pay on every purchase with no caps or annual fee.
            </p>
            <button
              style={{ background: '#fff', color: '#003087', border: '2px solid #003087', borderRadius: '4px', padding: '11px 26px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#003087'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#003087'; }}>
              Learn More
            </button>
          </div>
          <div style={{ flex: '0 0 380px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,48,135,0.18)' }}>
            <img src="/card-doublecash.png" alt="Schwab Double Cash card" style={{ width: '100%', display: 'block' }} />
          </div>
        </div>

      </div>
    </div>
  );
}

// ── "Your Future, Your Way" section ──────────────────────────────────────────

function FutureSection() {
  return (
    <div style={{ background: '#F9FAFB', padding: '0 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'stretch', minHeight: '340px' }}>

        {/* Left — real couple photo */}
        <div style={{ flex: '0 0 480px', overflow: 'hidden', position: 'relative', background: '#F0F4F8' }}>
          <img
            src="/couple-future.png"
            alt="Couple looking at tablet"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              display: 'block',
            }}
          />
        </div>

        {/* Right — copy */}
        <div style={{ flex: 1, padding: '48px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', color: '#6B7280', textTransform: 'uppercase', marginBottom: '12px' }}>
            SCHWAB FINANCIAL PATHWAYS
          </div>
          <h2 style={{ fontSize: '38px', fontWeight: 900, color: '#111827', lineHeight: '1.1', marginBottom: '14px' }}>
            Your future, your way
          </h2>
          <p style={{ fontSize: '16px', color: '#4B5563', lineHeight: '1.6', maxWidth: '440px', marginBottom: '24px' }}>
            Wherever you are on your financial journey, we're here to help with resources to support your goals.
          </p>
          <div>
            <button
              style={{ background: '#003087', color: '#fff', border: 'none', borderRadius: '4px', padding: '12px 28px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#0041B8'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#003087'}>
              Explore Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function FooterCiti() {
  const columns = [
    { title: 'Why Schwab', links: ['Our Story', 'Careers', 'Benefits and Services', 'Investor Relations'] },
    { title: 'Wealth Management', links: ['Schwab Gold®', 'Schwab Priority', 'Citi Priority', 'Wealth Advisors'] },
    { title: 'Business Banking', links: ['Small Business Accounts', 'Commercial Accounts'] },
    { title: 'Rates', links: ['Personal Banking', 'Credit Cards', 'Mortgage'] },
    { title: 'Help & Support', links: ['Contact Us', 'Help & FAQs', 'Security Center'] },
  ];

  return (
    <footer style={{ background: '#1a1a2e', padding: '48px 48px 32px', color: '#fff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Equal Housing Icon */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect x="8" y="16" width="20" height="16" stroke="#fff" strokeWidth="1.5" opacity="0.7" fill="none" />
            <path d="M6 18 L18 6 L30 18" stroke="#fff" strokeWidth="1.5" opacity="0.7" fill="none" />
          </svg>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '32px', marginBottom: '40px' }}>
          {columns.map((col, i) => (
            <div key={i}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>{col.title}</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {col.links.map((link, j) => (
                  <li key={j} style={{ marginBottom: '8px' }}>
                    <a href="#" style={{ fontSize: '12.8px', color: '#9CA3AF', textDecoration: 'none', lineHeight: '2.2' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.textDecoration = 'underline'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.textDecoration = 'none'; }}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderTop: '1px solid #374151' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Google Play — real brand badge */}
            <a href="https://play.google.com/store" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', background: '#000', border: '1px solid #4B5563', borderRadius: '8px', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Google Play triangle logo */}
              <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.5 0.774C0.5 0.287 1.046 0 1.458 0.272L19.25 10.498C19.635 10.753 19.635 11.247 19.25 11.502L1.458 21.728C1.046 22 0.5 21.713 0.5 21.226V0.774Z" fill="url(#gp1)"/>
                <defs>
                  <linearGradient id="gp1" x1="0.5" y1="0" x2="19.5" y2="11" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00C6FF"/>
                    <stop offset="0.3" stopColor="#00E676"/>
                    <stop offset="0.6" stopColor="#FFEB3B"/>
                    <stop offset="1" stopColor="#FF3D00"/>
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '9px', color: '#9CA3AF', lineHeight: 1 }}>GET IT ON</span>
                <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600, lineHeight: 1.4 }}>Google Play</span>
              </div>
            </a>
            {/* App Store — real Apple logo */}
            <a href="https://apps.apple.com" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', background: '#000', border: '1px solid #4B5563', borderRadius: '8px', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="18" height="22" viewBox="0 0 814 1000" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-42.4-150.3-109.1C90.6 754.5 64 651.6 64 549.3c0-163.7 107.4-250.5 208.5-250.5 55 0 100.5 36.2 134.5 36.2 32.8 0 84.2-38.4 147.4-38.4 23.7 0 108.2 2 165.9 78.3zm-80.5-170.4c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '9px', color: '#9CA3AF', lineHeight: 1 }}>Download on the</span>
                <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600, lineHeight: 1.4 }}>App Store</span>
              </div>
            </a>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#6B7280" xmlns="http://www.w3.org/2000/svg"
                onMouseEnter={(e) => e.currentTarget.style.fill = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.fill = '#6B7280'}
                style={{ cursor: 'pointer', transition: 'fill 0.15s' }}>
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            {/* X / Twitter */}
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#6B7280" xmlns="http://www.w3.org/2000/svg"
                onMouseEnter={(e) => e.currentTarget.style.fill = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.fill = '#6B7280'}
                style={{ cursor: 'pointer', transition: 'fill 0.15s' }}>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* YouTube */}
            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#6B7280" xmlns="http://www.w3.org/2000/svg"
                onMouseEnter={(e) => e.currentTarget.style.fill = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.fill = '#6B7280'}
                style={{ cursor: 'pointer', transition: 'fill 0.15s' }}>
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>

        <hr style={{ borderColor: '#374151', margin: '16px 0' }} />
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '12px', color: '#6B7280', marginBottom: '16px' }}>
          <span>© 2026 Charles Schwab Inc</span><span>|</span>
          <a href="#" style={{ color: '#6B7280', textDecoration: 'none' }}>Terms & Conditions</a><span>|</span>
          <a href="#" style={{ color: '#6B7280', textDecoration: 'none' }}>Privacy</a><span>|</span>
          <a href="#" style={{ color: '#6B7280', textDecoration: 'none' }}>Accessibility</a><span>|</span>
          <a href="#" style={{ color: '#6B7280', textDecoration: 'none' }}>Do Not Sell</a>
        </div>
        <hr style={{ borderColor: '#374151', margin: '16px 0' }} />
        <div style={{ fontSize: '11px', color: '#6B7280', lineHeight: '1.6', marginBottom: '16px' }}>
          <p style={{ marginBottom: '12px' }}>Charles Schwab, Inc. (Member SIPC) is a registered broker-dealer. Brokerage products including stocks, ETFs, bonds, and mutual funds are not FDIC insured, not bank guaranteed, and may lose value.</p>
          <p>Charles Schwab Bank, N.A. Member FDIC. Deposits are FDIC insured up to applicable limits. This website is intended for U.S. residents only.</p>
        </div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>Charles Schwab</div>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomeCiti() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <HeaderCiti />
      <HeroCiti />
      <ShortcutBarCiti />
      <ProductSectionCiti />
      <CreditCardPromoCiti />
      <FutureSection />
      <FooterCiti />
    </div>
  );
}
