import { useState } from 'react';
import { Search, SlidersHorizontal, Heart, MapPin, Star, ChevronDown, X } from 'lucide-react';

type Species = 'all' | 'cats' | 'dogs' | 'rabbits';

const CAT_BREEDS = [
  { name: 'British Shorthair', origin: 'United Kingdom', coat: 'Short, dense', temperament: 'Calm, Affectionate, Loyal', size: 'Medium–Large', lifespan: '12–17 yr', rating: 4.9, reviews: 2140, color: '#E8F2F8', emoji: '🐱' },
  { name: 'Maine Coon', origin: 'United States', coat: 'Long, silky', temperament: 'Playful, Intelligent, Gentle', size: 'Large', lifespan: '13–14 yr', rating: 4.8, reviews: 1876, color: '#F0F7EF', emoji: '🐈' },
  { name: 'Ragdoll', origin: 'United States', coat: 'Semi-long, soft', temperament: 'Docile, Calm, Social', size: 'Large', lifespan: '15–20 yr', rating: 4.9, reviews: 2310, color: '#FDF5EE', emoji: '😺' },
  { name: 'Siamese', origin: 'Thailand', coat: 'Short, fine', temperament: 'Vocal, Curious, Loyal', size: 'Medium', lifespan: '12–15 yr', rating: 4.7, reviews: 1543, color: '#F5F0F8', emoji: '🐾' },
  { name: 'Persian', origin: 'Iran', coat: 'Long, thick', temperament: 'Quiet, Sweet, Dignified', size: 'Medium', lifespan: '10–17 yr', rating: 4.8, reviews: 1987, color: '#FFF5F5', emoji: '🐈‍⬛' },
  { name: 'Scottish Fold', origin: 'Scotland', coat: 'Short or long', temperament: 'Adaptable, Gentle, Curious', size: 'Small–Medium', lifespan: '11–14 yr', rating: 4.7, reviews: 1234, color: '#F8F6E8', emoji: '😸' },
  { name: 'Bengal', origin: 'United States', coat: 'Short, spotted', temperament: 'Active, Athletic, Smart', size: 'Medium–Large', lifespan: '10–16 yr', rating: 4.6, reviews: 1102, color: '#EEFAF0', emoji: '🐆' },
  { name: 'Sphynx', origin: 'Canada', coat: 'Hairless', temperament: 'Energetic, Affectionate, Extroverted', size: 'Medium', lifespan: '9–15 yr', rating: 4.5, reviews: 876, color: '#FFF9F0', emoji: '🐱' },
];

const DOG_BREEDS = [
  { name: 'Labrador Retriever', origin: 'Canada', coat: 'Short, dense', temperament: 'Friendly, Active, Outgoing', size: 'Large', lifespan: '10–12 yr', rating: 4.9, reviews: 3412, color: '#FFF9E8', emoji: '🐕' },
  { name: 'French Bulldog', origin: 'France', coat: 'Short, smooth', temperament: 'Adaptable, Playful, Smart', size: 'Small–Medium', lifespan: '10–12 yr', rating: 4.8, reviews: 2890, color: '#F5F0F8', emoji: '🐶' },
  { name: 'Golden Retriever', origin: 'Scotland', coat: 'Long, wavy', temperament: 'Intelligent, Reliable, Trustworthy', size: 'Large', lifespan: '10–12 yr', rating: 4.9, reviews: 3178, color: '#FFF4E8', emoji: '🦮' },
  { name: 'German Shepherd', origin: 'Germany', coat: 'Double coat, medium', temperament: 'Confident, Courageous, Smart', size: 'Large', lifespan: '9–13 yr', rating: 4.8, reviews: 2654, color: '#F0F7EF', emoji: '🐕‍🦺' },
  { name: 'Beagle', origin: 'England', coat: 'Short, dense', temperament: 'Curious, Merry, Friendly', size: 'Small–Medium', lifespan: '10–15 yr', rating: 4.7, reviews: 1876, color: '#F8F6E8', emoji: '🐩' },
  { name: 'Dachshund', origin: 'Germany', coat: 'Smooth, wire, long', temperament: 'Lively, Playful, Devoted', size: 'Small', lifespan: '12–16 yr', rating: 4.7, reviews: 1654, color: '#FFF0F0', emoji: '🌭' },
];

const RABBIT_BREEDS = [
  { name: 'Holland Lop', origin: 'Netherlands', coat: 'Dense, rollback', temperament: 'Calm, Affectionate, Playful', size: 'Small', lifespan: '7–14 yr', rating: 4.8, reviews: 876, color: '#F5F0F8', emoji: '🐰' },
  { name: 'Mini Rex', origin: 'United States', coat: 'Short, velvety', temperament: 'Curious, Calm, Friendly', size: 'Small', lifespan: '7–10 yr', rating: 4.7, reviews: 654, color: '#F0F7EF', emoji: '🐇' },
  { name: 'Lionhead', origin: 'Belgium', coat: 'Long, mane', temperament: 'Energetic, Sociable, Playful', size: 'Small', lifespan: '7–10 yr', rating: 4.6, reviews: 543, color: '#FFF5F0', emoji: '🦁' },
  { name: 'Flemish Giant', origin: 'Belgium', coat: 'Dense, glossy', temperament: 'Gentle, Calm, Docile', size: 'Giant', lifespan: '5–8 yr', rating: 4.5, reviews: 432, color: '#F8F8E8', emoji: '🐰' },
];

export default function AnimalPage() {
  const [species, setSpecies] = useState<Species>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const allBreeds = [
    ...CAT_BREEDS.map(b => ({ ...b, species: 'cats' as const })),
    ...DOG_BREEDS.map(b => ({ ...b, species: 'dogs' as const })),
    ...RABBIT_BREEDS.map(b => ({ ...b, species: 'rabbits' as const })),
  ];

  const filtered = allBreeds.filter(b => {
    const matchesSpecies = species === 'all' || b.species === species;
    const matchesSearch = !searchQuery || b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.temperament.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecies && matchesSearch;
  });

  const toggleLike = (name: string) => {
    setLiked(prev => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n; });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: '"Helvetica Neue", Arial, sans-serif' }}>

      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #EBEBEB', padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.5px' }}>
            Paws<span style={{ color: '#E07B54' }}>&</span>Find
          </span>
          <span style={{ fontSize: 11, color: '#999', fontWeight: 400, marginLeft: 4 }}>Breed Directory</span>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {['Cats', 'Dogs', 'Rabbits', 'Shelters', 'Resources'].map(item => (
            <a key={item} href="#" style={{ fontSize: 14, color: '#444', textDecoration: 'none', fontWeight: 500 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#E07B54')}
              onMouseLeave={e => (e.currentTarget.style.color = '#444')}>
              {item}
            </a>
          ))}
        </nav>
        <button style={{ fontSize: 14, color: '#fff', background: '#E07B54', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontWeight: 600 }}>
          List a Pet
        </button>
      </header>

      {/* Hero banner */}
      <div style={{ background: 'linear-gradient(135deg, #FFF8F5 0%, #FEF0E6 100%)', padding: '40px 48px 32px', borderBottom: '1px solid #F0E8E0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '3px', color: '#E07B54', textTransform: 'uppercase', marginBottom: 8 }}>Breed Directory</p>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.5px', marginBottom: 6 }}>Find your perfect breed</h1>
          <p style={{ fontSize: 15, color: '#777', marginBottom: 24, maxWidth: 480 }}>
            Detailed profiles on {allBreeds.length}+ breeds — temperament, coat type, size, lifespan, and more.
          </p>

          {/* Search + filters */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1.5px solid #E8E8E8', borderRadius: 8, padding: '0 14px', gap: 8, flex: '0 0 340px' }}>
              <Search size={16} color="#AAA" />
              <input
                type="text"
                placeholder="Search by breed or trait..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: 14, padding: '10px 0', color: '#1A1A1A', background: 'transparent', width: '100%' }}
              />
              {searchQuery && <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><X size={14} color="#AAA" /></button>}
            </div>

            {/* Species tabs */}
            <div style={{ display: 'flex', gap: 6, background: '#fff', border: '1.5px solid #E8E8E8', borderRadius: 8, padding: 4 }}>
              {(['all', 'cats', 'dogs', 'rabbits'] as Species[]).map(s => (
                <button key={s} onClick={() => setSpecies(s)} style={{
                  padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                  background: species === s ? '#1A1A1A' : 'transparent',
                  color: species === s ? '#fff' : '#777',
                  transition: 'all 0.15s',
                }}>
                  {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            <button onClick={() => setShowFilters(!showFilters)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', border: '1.5px solid #E8E8E8', borderRadius: 8,
              background: '#fff', color: '#444', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>
              <SlidersHorizontal size={15} /> Filters <ChevronDown size={13} />
            </button>

            <span style={{ fontSize: 13, color: '#999', marginLeft: 8 }}>{filtered.length} breeds found</span>
          </div>
        </div>
      </div>

      {/* Breed grid */}
      <div style={{ maxWidth: 1200, margin: '32px auto', padding: '0 48px 64px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#AAA' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#555' }}>No breeds match "{searchQuery}"</div>
            <div style={{ fontSize: 14, color: '#AAA', marginTop: 6 }}>Try a different name or trait</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {filtered.map(breed => (
              <div key={breed.name} style={{
                background: '#fff', border: '1px solid #EBEBEB', borderRadius: 12, overflow: 'hidden',
                transition: 'transform 0.15s, box-shadow 0.15s', cursor: 'pointer',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>

                {/* Image area */}
                <div style={{ height: 140, background: breed.color, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <span style={{ fontSize: 52 }}>{breed.emoji}</span>
                  <button onClick={() => toggleLike(breed.name)} style={{
                    position: 'absolute', top: 10, right: 10, background: '#fff', border: 'none',
                    borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}>
                    <Heart size={12} fill={liked.has(breed.name) ? '#E07B54' : 'none'} color={liked.has(breed.name) ? '#E07B54' : '#BBB'} />
                  </button>
                  <span style={{ position: 'absolute', bottom: 8, left: 10, fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', color: '#888', textTransform: 'uppercase' }}>
                    {breed.species}
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', lineHeight: 1.3 }}>{breed.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Star size={11} fill="#F5A623" color="#F5A623" />
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#333' }}>{breed.rating}</span>
                    </div>
                  </div>

                  {/* Specs */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 8px', marginBottom: 10 }}>
                    {[
                      ['Size', breed.size],
                      ['Lifespan', breed.lifespan],
                      ['Origin', breed.origin],
                      ['Coat', breed.coat],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: '#AAA', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{k}</div>
                        <div style={{ fontSize: 12, color: '#444', fontWeight: 500, marginTop: 1 }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Temperament tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                    {breed.temperament.split(', ').map(t => (
                      <span key={t} style={{ fontSize: 10, fontWeight: 600, color: '#666', background: '#F5F5F5', borderRadius: 4, padding: '2px 7px' }}>{t}</span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{
                      flex: 1, padding: '8px 0', background: '#1A1A1A', color: '#fff', border: 'none',
                      borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    }}>View Breed</button>
                    <button style={{
                      padding: '8px 12px', background: '#fff', color: '#E07B54', border: '1.5px solid #E07B54',
                      borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    }}>Adopt</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ background: '#1A1A1A', padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>Paws<span style={{ color: '#E07B54' }}>&</span>Find</div>
        <div style={{ fontSize: 12, color: '#555' }}>© 2026 Paws & Find Inc. All rights reserved.</div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <a key={l} href="#" style={{ fontSize: 12, color: '#555', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
