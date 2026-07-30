import { PageShell } from '@/components/PageShell';

export default function BondsPage() {
  return (
    <PageShell showAuthStrip={true}>
      <section className="bg-white py-16 border-b" style={{ borderColor: 'var(--border-grey)' }}>
        <div className="max-w-[var(--content-width)] mx-auto px-4">
          <h1 className="text-[44px] font-light mb-6" style={{ color: 'var(--text-primary)' }}>
            Bonds & Fixed Income
          </h1>
          <p className="text-[18px] max-w-3xl mb-8" style={{ color: 'var(--text-secondary)' }}>
            Generate steady income and reduce portfolio volatility with our extensive selection of fixed-income products.
          </p>
          <div className="inline-block bg-[var(--nav-bg)] text-white px-6 py-3 rounded-[2px] text-[15px] font-bold">
            Pricing: $0 for new issues online | $1/bond online for secondary market
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F5F6F7]">
        <div className="max-w-[var(--content-width)] mx-auto px-4">
          <h2 className="text-[28px] font-normal mb-10" style={{ color: 'var(--text-primary)' }}>Fixed-Income Solutions</h2>
          
          <div className="grid grid-cols-3 gap-6">
            {[
              { title: 'Corporate Bonds', desc: 'Higher yields issued by companies. Search by rating, maturity, and yield.' },
              { title: 'Treasury Bills', desc: 'Backed by the U.S. government. Highly liquid and safe short-term investments.' },
              { title: 'Municipal Bonds', desc: 'Issued by states and municipalities. Often exempt from federal taxes.' },
              { title: 'Certificates of Deposit (CDs)', desc: 'FDIC-insured fixed term deposits from various banks nationwide.' },
              { title: 'Agency Bonds', desc: 'Issued by government-sponsored enterprises like Fannie Mae and Freddie Mac.' }
            ].map((bond, i) => (
              <div key={i} className="bg-white border p-6 rounded-[2px]" style={{ borderColor: 'var(--border-grey)' }}>
                <h3 className="text-[18px] font-bold mb-3" style={{ color: 'var(--brand-blue)' }}>{bond.title}</h3>
                <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>{bond.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
