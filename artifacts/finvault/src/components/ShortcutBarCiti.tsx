import { CreditCard, Building2, Home, DollarSign, TrendingUp, Briefcase } from 'lucide-react';
import { Link } from 'wouter';

export function ShortcutBarCiti() {
  const shortcuts = [
    { icon: CreditCard, label: 'Credit Cards', href: '#' },
    { icon: Building2, label: 'Checking Accounts', href: '#' },
    { icon: Home, label: 'Mortgage', href: '#' },
    { icon: DollarSign, label: 'Loans', href: '#' },
    { icon: TrendingUp, label: 'Investing Options', href: '#' },
    { icon: Briefcase, label: 'Small Business', href: '#' }
  ];

  return (
    <div style={{ background: '#fff', borderBottom: '1px solid #F3F4F6', padding: '32px 48px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-around' }}>
        {shortcuts.map((item, index) => (
          <Link 
            key={index}
            href={item.href}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '10px', 
              minWidth: '80px',
              padding: '12px 8px',
              borderRadius: '8px',
              cursor: 'pointer',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#F0F7FF'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <item.icon style={{ width: '26px', height: '26px', color: '#003087', strokeWidth: 1.8 }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#003087', textAlign: 'center', marginTop: '4px' }}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
