import { useState } from 'react';
import { useLocation } from 'wouter';
import { Search, Heart, MapPin, ChevronRight } from 'lucide-react';

const BREEDS = [
  { name: 'British Shorthair', trait: 'Calm · Affectionate', age: '2 yr', location: 'London, UK', color: '#E8F4F8' },
  { name: 'Maine Coon', trait: 'Playful · Intelligent', age: '1 yr', location: 'Boston, MA', color: '#F0F7F0' },
  { name: 'Ragdoll', trait: 'Gentle · Social', age: '3 yr', location: 'Seattle, WA', color: '#FDF4EE' },
  { name: 'Siamese', trait: 'Vocal · Loyal', age: '4 yr', location: 'New York, NY', color: '#F5F0F8' },
  { name: 'Persian', trait: 'Quiet · Elegant', age: '2 yr', location: 'Paris, FR', color: '#FFF5F5' },
  { name: 'Scottish Fold', trait: 'Sweet · Curious', age: '1 yr', location: 'Edinburgh, UK', color: '#F8F5E8' },
];

const CAT_ICONS: Record<string, string> = {
  'British Shorthair': '🐱',
  'Maine Coon': '🐈',
  'Ragdoll': '😺',
  'Siamese': '🐾',
  'Persian': '🐈‍⬛',
  'Scottish Fold': '😸',
};

export default function AdminLogin() {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() === '2468') {
      localStorage.setItem('finvault_admin_auth', 'true');
      setLocation('/admin/dashboard');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const toggleLike = (name: string) => {
    setLiked(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: '"Helvetica Neue", Arial, sans-serif' }}>

      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #EBEBEB', padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.5px' }}>
            Paws<span style={{ color: '#E07B54' }}>&</span>Find
          </span>
          <span style={{ fontSize: 11, color: '#999', fontWeight: 400, marginLeft: 4 }}>Pet Adoption</span>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {['Cats', 'Dogs', 'Rabbits', 'Birds', 'Shelters'].map(item => (
            <a key={item} href="#" style={{ fontSize: 14, color: '#444', textDecoration: 'none', fontWeight: 500 }}
               onMouseEnter={e => (e.currentTarget.style.color = '#E07B54')}
               onMouseLeave={e => (e.currentTarget.style.color = '#444')}>
              {item}
            </a>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button style={{ fontSize: 14, color: '#444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Log In</button>
          <button style={{ fontSize: 14, color: '#fff', background: '#E07B54', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontWeight: 600 }}>
            List a Pet
          </button>
        </div>
      </header>

      {/* Hero search */}
      <section style={{ background: 'linear-gradient(135deg, #FFF8F5 0%, #FEF3EC 60%, #F9EBE0 100%)', padding: '56px 48px 48px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '3px', color: '#E07B54', textTransform: 'uppercase', marginBottom: 12 }}>
          Thousands of pets waiting
        </p>
        <h1 style={{ fontSize: 46, fontWeight: 800, color: '#1A1A1A', lineHeight: 1.1, marginBottom: 16, letterSpacing: '-1px' }}>
          Find your perfect<br />companion today
        </h1>
        <p style={{ fontSize: 16, color: '#666', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
          Browse thousands of loving animals from shelters and breeders near you.
        </p>

        {/* Search bar — secret passcode input */}
        <form onSubmit={handleSearch} style={{ maxWidth: 560, margin: '0 auto', position: 'relative' }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            background: '#fff', border: `2px solid ${error ? '#E53E3E' : '#E8E8E8'}`,
            borderRadius: 50, padding: '4px 4px 4px 20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            transition: 'border-color 0.2s',
          }}>
            <Search size={18} color="#999" style={{ flexShrink: 0 }} />
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setError(false); }}
              placeholder="Search breeds, names, or locations..."
              style={{
                flex: 1, border: 'none', outline: 'none', fontSize: 15, color: '#1A1A1A',
                padding: '10px 12px', background: 'transparent',
              }}
            />
            <button type="submit" style={{
              background: '#E07B54', color: '#fff', border: 'none', borderRadius: 40,
              padding: '10px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              transition: 'background 0.15s', flexShrink: 0,
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#C9663E')}
              onMouseLeave={e => (e.currentTarget.style.background = '#E07B54')}>
              Search
            </button>
          </div>
          {error && (
            <p style={{ fontSize: 13, color: '#E53E3E', marginTop: 8 }}>
              No results found. Try a different search.
            </p>
          )}
        </form>

        {/* Quick filters */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          {['🐱 Cats', '🐶 Dogs', '🐰 Rabbits', '📍 Near Me', '🏠 Adoption Ready'].map(tag => (
            <button key={tag} style={{
              fontSize: 12, fontWeight: 600, color: '#555', background: '#fff',
              border: '1px solid #E8E8E8', borderRadius: 20, padding: '5px 12px',
              cursor: 'pointer',
            }}>
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Stats bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #F0F0F0', padding: '16px 48px', display: 'flex', justifyContent: 'center', gap: 48 }}>
        {[['48,291', 'Pets Available'], ['2,847', 'Shelters Listed'], ['1.2M', 'Happy Adoptions'], ['4.9★', 'Adopter Rating']].map(([v, l]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#1A1A1A' }}>{v}</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Featured breeds */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.3px' }}>Featured Cats</h2>
            <p style={{ fontSize: 14, color: '#888', marginTop: 4 }}>Handpicked companions looking for homes</p>
          </div>
          <a href="#" style={{ fontSize: 13, fontWeight: 600, color: '#E07B54', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            View all <ChevronRight size={14} />
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {BREEDS.map(breed => (
            <div key={breed.name} style={{
              background: '#fff', border: '1px solid #EBEBEB', borderRadius: 12, overflow: 'hidden',
              transition: 'box-shadow 0.2s', cursor: 'pointer',
            }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
              {/* Image placeholder */}
              <div style={{ height: 180, background: breed.color, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <span style={{ fontSize: 64 }}>{CAT_ICONS[breed.name]}</span>
                <button
                  onClick={() => toggleLike(breed.name)}
                  style={{
                    position: 'absolute', top: 12, right: 12, background: '#fff', border: 'none',
                    borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}>
                  <Heart size={14} fill={liked.has(breed.name) ? '#E07B54' : 'none'} color={liked.has(breed.name) ? '#E07B54' : '#999'} />
                </button>
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A' }}>{breed.name}</div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{breed.trait}</div>
                  </div>
                  <span style={{ fontSize: 11, background: '#F5F5F5', color: '#555', borderRadius: 4, padding: '3px 7px', fontWeight: 600 }}>{breed.age}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 10 }}>
                  <MapPin size={12} color="#AAA" />
                  <span style={{ fontSize: 12, color: '#AAA' }}>{breed.location}</span>
                </div>
                <button style={{
                  width: '100%', marginTop: 12, padding: '9px 0', background: '#1A1A1A', color: '#fff',
                  border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#333')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#1A1A1A')}>
                  Meet {breed.name.split(' ')[0]}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why adopt section */}
      <section style={{ background: '#F7F2EE', padding: '48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A', marginBottom: 8 }}>Why adopt through Paws & Find?</h2>
        <p style={{ fontSize: 14, color: '#777', marginBottom: 36 }}>Everything you need for a smooth adoption journey.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, maxWidth: 900, margin: '0 auto' }}>
          {[
            { icon: '✓', title: 'Verified Shelters', desc: 'Every shelter is vetted and licensed' },
            { icon: '🏠', title: 'Home Matching', desc: 'Smart algorithm finds the right fit' },
            { icon: '💬', title: 'Live Support', desc: '24/7 adoption guidance from experts' },
            { icon: '♻️', title: 'Return Policy', desc: 'Hassle-free returns within 14 days' },
          ].map(item => (
            <div key={item.title} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{item.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: '#888', lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1A1A1A', padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>
          Paws<span style={{ color: '#E07B54' }}>&</span>Find
        </div>
        <div style={{ fontSize: 12, color: '#666' }}>© 2026 Paws & Find Inc. All rights reserved.</div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy', 'Terms', 'Cookies', 'Contact'].map(l => (
            <a key={l} href="#" style={{ fontSize: 12, color: '#666', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
