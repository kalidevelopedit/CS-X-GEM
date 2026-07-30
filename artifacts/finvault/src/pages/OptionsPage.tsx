import { PageShell } from '@/components/PageShell';

export default function OptionsPage() {
  return (
    <PageShell showAuthStrip={true}>
      <section className="bg-white py-16 border-b" style={{ borderColor: 'var(--border-grey)' }}>
        <div className="max-w-[var(--content-width)] mx-auto px-4 text-center">
          <h1 className="text-[44px] font-light mb-6" style={{ color: 'var(--text-primary)' }}>
            Options trading for every level.
          </h1>
          <p className="text-[18px] max-w-2xl mx-auto mb-10" style={{ color: 'var(--text-secondary)' }}>
            Whether you want to generate income, hedge risk, or speculate on market direction, we provide the tools and education you need.
          </p>
          <div className="inline-block bg-[var(--alert-bg)] border px-6 py-4 rounded-[2px]" style={{ borderColor: 'var(--alert-border)' }}>
            <span className="text-[18px] font-bold" style={{ color: 'var(--text-primary)' }}>
              $0 base commission + $0.65/contract
            </span>
            <span className="block text-[13px] mt-1" style={{ color: 'var(--text-secondary)' }}>
              No exercise or assignment fees.
            </span>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F5F6F7]">
        <div className="max-w-[var(--content-width)] mx-auto px-4">
          <div className="grid grid-cols-3 gap-8">
            <div className="bg-white border p-8 rounded-[2px]" style={{ borderColor: 'var(--border-grey)' }}>
              <div className="text-[48px] font-bold mb-4 opacity-10" style={{ color: 'var(--nav-bg)' }}>01</div>
              <h3 className="text-[20px] font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Learning options basics</h3>
              <p className="text-[15px] mb-6" style={{ color: 'var(--text-secondary)' }}>Understand calls and puts. Learn how to buy options for leverage and sell them for income.</p>
            </div>
            
            <div className="bg-white border p-8 rounded-[2px]" style={{ borderColor: 'var(--border-grey)' }}>
              <div className="text-[48px] font-bold mb-4 opacity-10" style={{ color: 'var(--nav-bg)' }}>02</div>
              <h3 className="text-[20px] font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Building your strategy</h3>
              <p className="text-[15px] mb-6" style={{ color: 'var(--text-secondary)' }}>Implement covered calls to generate yield on existing stock positions, or cash-secured puts to acquire stock at a discount.</p>
            </div>

            <div className="bg-white border p-8 rounded-[2px]" style={{ borderColor: 'var(--border-grey)' }}>
              <div className="text-[48px] font-bold mb-4 opacity-10" style={{ color: 'var(--nav-bg)' }}>03</div>
              <h3 className="text-[20px] font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Advanced multi-leg trades</h3>
              <p className="text-[15px] mb-6" style={{ color: 'var(--text-secondary)' }}>Execute complex strategies like iron condors, straddles, and butterflies using our dedicated thinkorswim® platform.</p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
