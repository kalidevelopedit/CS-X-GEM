import { PageShell } from '@/components/PageShell';
import { Monitor, Smartphone, LayoutDashboard, BarChart2 } from 'lucide-react';
import { useState } from 'react';

export default function TradingPage() {
  const [tab, setTab] = useState('desktop');

  return (
    <PageShell showAuthStrip={true}>
      <section className="bg-white py-16 border-b" style={{ borderColor: 'var(--border-grey)' }}>
        <div className="max-w-[var(--content-width)] mx-auto px-4 text-center">
          <h1 className="text-[48px] font-light mb-6" style={{ color: 'var(--text-primary)' }}>
            Trade brilliantly.
          </h1>
          <p className="text-[20px] max-w-3xl mx-auto mb-10" style={{ color: 'var(--text-secondary)' }}>
            Unlock the market with thinkorswim®. Pro-level tools, real-time data, and deep analytics designed to give you an edge.
          </p>
          <button
            data-testid="cta-open-trading"
            className="px-8 h-[47px] text-white font-bold text-[16px] hover:opacity-90 transition-opacity rounded-[24px]"
            style={{ backgroundColor: 'var(--cta-orange)' }}
          >
            Open a trading account
          </button>
        </div>
      </section>

      <section className="py-20 bg-[var(--section-grey)]">
        <div className="max-w-[var(--content-width)] mx-auto px-4">
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-white border rounded-[2px] p-1 shadow-sm" style={{ borderColor: 'var(--border-grey)' }}>
              {[
                { id: 'desktop', label: 'thinkorswim® Desktop', icon: Monitor },
                { id: 'web', label: 'thinkorswim® Web', icon: LayoutDashboard },
                { id: 'mobile', label: 'thinkorswim® Mobile', icon: Smartphone }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-6 py-3 text-[15px] font-bold rounded-[2px] transition-colors ${
                    tab === t.id ? 'bg-[var(--nav-bg)] text-white' : 'text-[var(--text-secondary)] hover:bg-gray-50'
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border p-12 rounded-[2px] max-w-4xl mx-auto shadow-sm" style={{ borderColor: 'var(--border-grey)' }}>
            <div className="grid grid-cols-2 gap-12">
              <div>
                <h2 className="text-[28px] font-normal mb-6" style={{ color: 'var(--text-primary)' }}>
                  {tab === 'desktop' && 'The ultimate trading powerhouse'}
                  {tab === 'web' && 'Streamlined interface, powerful execution'}
                  {tab === 'mobile' && 'The market in your pocket'}
                </h2>
                <ul className="space-y-4 text-[15px]" style={{ color: 'var(--text-secondary)' }}>
                  <li className="flex items-start gap-3">
                    <BarChart2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--action-blue)' }} />
                    <span>Advanced charting with 400+ technical studies and customizable overlays.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BarChart2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--action-blue)' }} />
                    <span>Options analytics including probability cones and risk graphs.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BarChart2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--action-blue)' }} />
                    <span>Customizable layouts to match your unique trading workflow.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BarChart2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--action-blue)' }} />
                    <span>Real-time data streaming and level II quotes.</span>
                  </li>
                </ul>
              </div>
              <div className="bg-[#F5F6F7] border border-dashed flex items-center justify-center min-h-[300px]" style={{ borderColor: 'var(--border-grey)' }}>
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[12px]">Platform Preview</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
