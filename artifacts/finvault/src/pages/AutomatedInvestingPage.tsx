import { PageShell } from '@/components/PageShell';
import { RefreshCw, TrendingDown, DollarSign, BrainCircuit } from 'lucide-react';

export default function AutomatedInvestingPage() {
  return (
    <PageShell showAuthStrip={true}>
      <section className="bg-[#344B58] py-20 text-white">
        <div className="max-w-[var(--content-width)] mx-auto px-4 text-center">
          <h1 className="text-[48px] font-light mb-6">
            Automated investing. Built around you.
          </h1>
          <p className="text-[18px] max-w-2xl mx-auto mb-10 text-white/80">
            Let technology manage your portfolio. Intelligent Portfolios build, monitor, and automatically rebalance a diversified portfolio of ETFs based on your goals.
          </p>
          <button
            data-testid="cta-get-started-auto"
            className="px-8 h-[47px] text-white font-bold text-[16px] hover:opacity-90 transition-opacity rounded-[24px]"
            style={{ backgroundColor: 'var(--cta-orange)' }}
          >
            Get started
          </button>
        </div>
      </section>

      <section className="py-20 bg-white border-b" style={{ borderColor: 'var(--border-grey)' }}>
        <div className="max-w-[var(--content-width)] mx-auto px-4">
          <div className="grid grid-cols-4 gap-6">
            {[
              { icon: RefreshCw, title: 'Automatic rebalancing', desc: 'Keeps your portfolio aligned with your target risk profile.' },
              { icon: TrendingDown, title: 'Tax-loss harvesting', desc: 'Automatically offsets capital gains to improve tax efficiency.' },
              { icon: DollarSign, title: 'No advisory fees', desc: '$0 advisory fees and $0 account management fees.' },
              { icon: BrainCircuit, title: 'Expert-built portfolios', desc: 'Strategies designed by the Schwab Investment Strategy team.' }
            ].map((f, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 mx-auto bg-[#F5F6F7] border flex items-center justify-center rounded-[2px] mb-4" style={{ borderColor: 'var(--border-grey)' }}>
                  <f.icon className="w-8 h-8" style={{ color: 'var(--brand-blue)' }} strokeWidth={1.5} />
                </div>
                <h3 className="text-[16px] font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--section-grey)]">
        <div className="max-w-[var(--content-width)] mx-auto px-4 text-center">
          <h2 className="text-[32px] font-normal mb-16" style={{ color: 'var(--text-primary)' }}>How it works</h2>
          <div className="flex justify-between max-w-4xl mx-auto relative">
            <div className="absolute top-[24px] left-[15%] right-[15%] h-0.5 bg-[var(--border-grey)] -z-10"></div>
            {[
              { step: '1', title: 'Answer questions', desc: 'Tell us about your goals, timeline, and risk tolerance.' },
              { step: '2', title: 'We build your portfolio', desc: 'Our algorithm selects a diversified mix of ETFs for you.' },
              { step: '3', title: 'Stay on track', desc: 'We automatically monitor and rebalance your investments daily.' }
            ].map((s, i) => (
              <div key={i} className="w-[220px] bg-white border p-6 rounded-[2px] shadow-sm relative" style={{ borderColor: 'var(--border-grey)' }}>
                <div className="w-12 h-12 rounded-full border bg-white flex items-center justify-center text-[20px] font-bold absolute -top-6 left-1/2 -translate-x-1/2" style={{ borderColor: 'var(--border-grey)', color: 'var(--nav-bg)' }}>
                  {s.step}
                </div>
                <h3 className="text-[18px] font-bold mt-6 mb-3" style={{ color: 'var(--text-primary)' }}>{s.title}</h3>
                <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
