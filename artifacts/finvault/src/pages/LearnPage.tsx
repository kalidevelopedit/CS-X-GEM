import { PageShell } from '@/components/PageShell';
import { useState } from 'react';
import { Link } from 'wouter';

const CATEGORIES = ['All', 'Stocks', 'ETFs', 'Options', 'Retirement', 'Bonds', 'Personal Finance'];

const ARTICLES = [
  { cat: 'Stocks', title: 'Understanding Market Volatility in 2026', date: 'October 15, 2026' },
  { cat: 'Retirement', title: '5 Steps to Prepare for Retirement in Your 50s', date: 'October 12, 2026' },
  { cat: 'Options', title: 'Covered Calls: Generating Income from Your Portfolio', date: 'October 8, 2026' },
  { cat: 'Personal Finance', title: 'Building a Rainy Day Fund Using High-Yield Savings', date: 'October 5, 2026' },
  { cat: 'ETFs', title: 'Core vs. Satellite Strategy with Index Funds', date: 'October 1, 2026' },
  { cat: 'Bonds', title: 'How Interest Rates Impact the Bond Market', date: 'September 28, 2026' },
];

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState('All');

  const filtered = activeTab === 'All' ? ARTICLES : ARTICLES.filter(a => a.cat === activeTab);

  return (
    <PageShell showAuthStrip={true}>
      <section className="bg-white py-16 border-b" style={{ borderColor: 'var(--border-grey)' }}>
        <div className="max-w-[var(--content-width)] mx-auto px-4">
          <h1 className="text-[44px] font-light mb-6" style={{ color: 'var(--text-primary)' }}>
            Insights & Education
          </h1>
          <p className="text-[18px] max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
            Expert analysis, market commentary, and educational resources to help you become a better investor.
          </p>
        </div>
      </section>

      <section className="bg-[#F5F6F7] py-6 border-b" style={{ borderColor: 'var(--border-grey)' }}>
        <div className="max-w-[var(--content-width)] mx-auto px-4 flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 text-[14px] font-bold rounded-[2px] transition-colors border ${
                activeTab === cat 
                  ? 'bg-[var(--nav-bg)] text-white border-[var(--nav-bg)]' 
                  : 'bg-white text-[var(--text-secondary)] border-[var(--border-grey)] hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-[var(--content-width)] mx-auto px-4">
          <div className="grid grid-cols-3 gap-6">
            {filtered.map((article, i) => (
              <div key={i} className="border p-6 rounded-[2px] flex flex-col bg-white" style={{ borderColor: 'var(--border-grey)' }}>
                <span className="text-[12px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--brand-blue)' }}>
                  {article.cat}
                </span>
                <h3 className="text-[20px] font-bold mb-4 leading-snug" style={{ color: 'var(--text-primary)' }}>
                  {article.title}
                </h3>
                <div className="flex-1"></div>
                <div className="flex items-center justify-between mt-6 pt-4 border-t" style={{ borderColor: 'var(--border-grey)' }}>
                  <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>{article.date}</span>
                  <Link href="#" className="text-[13px] font-bold hover:underline" style={{ color: 'var(--link-blue)' }}>Read more &gt;</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
