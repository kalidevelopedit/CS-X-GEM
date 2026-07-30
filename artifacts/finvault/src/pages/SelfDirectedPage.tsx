import { PageShell } from '@/components/PageShell';
import { Smartphone, Monitor, MonitorPlay, CheckCircle } from 'lucide-react';

export default function SelfDirectedPage() {
  return (
    <PageShell showAuthStrip={true}>
      <section className="bg-white py-16 border-b" style={{ borderColor: 'var(--border-grey)' }}>
        <div className="max-w-[var(--content-width)] mx-auto px-4">
          <h1 className="text-[44px] font-light mb-4" style={{ color: 'var(--text-primary)' }}>
            Self-directed investing
          </h1>
          <p className="text-[22px] font-normal mb-8" style={{ color: 'var(--text-primary)' }}>
            Managing your investments, on your own terms.
          </p>
          <button
            data-testid="cta-open-self-directed"
            className="px-8 h-[47px] text-white font-bold text-[16px] hover:opacity-90 transition-opacity rounded-[24px] mb-10"
            style={{ backgroundColor: 'var(--cta-orange)' }}
          >
            Open an account
          </button>

          <div className="grid grid-cols-2 gap-8 text-[15px]" style={{ color: 'var(--text-secondary)' }}>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--brand-blue)' }} />
                <span><strong>Anywhere trading.</strong> Place trades easily via web, mobile, or advanced desktop platforms.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--brand-blue)' }} />
                <span><strong>Helpful trading features.</strong> Utilize conditional orders, trailing stops, and complex option strategies.</span>
              </li>
            </ul>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--brand-blue)' }} />
                <span><strong>Choice of investments.</strong> Access thousands of stocks, ETFs, mutual funds, and fixed-income products.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--brand-blue)' }} />
                <span><strong>Research & analysis tools.</strong> Rely on third-party analyst reports and real-time market data to make informed decisions.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--section-grey)]">
        <div className="max-w-[var(--content-width)] mx-auto px-4 text-center">
          <h2 className="text-[32px] font-normal mb-12" style={{ color: 'var(--text-primary)' }}>Platforms built for your trading style</h2>
          
          <div className="grid grid-cols-3 gap-8">
            {[
              { icon: Monitor, title: 'Web', desc: 'Fast, secure online access to your portfolio and market news from any browser.' },
              { icon: Smartphone, title: 'Mobile', desc: 'Trade, track, and transfer funds on the go with the highly-rated Schwab Mobile app.' },
              { icon: MonitorPlay, title: 'Desktop', desc: 'Advanced charting, customizable layouts, and pro-level tools for active traders.' }
            ].map((p, i) => (
              <div key={i} className="bg-white border p-8 rounded-[2px] flex flex-col items-center" style={{ borderColor: 'var(--border-grey)' }}>
                <p.icon className="w-16 h-16 mb-6" style={{ color: 'var(--action-blue)' }} strokeWidth={1} />
                <h3 className="text-[20px] font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{p.title}</h3>
                <p className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
