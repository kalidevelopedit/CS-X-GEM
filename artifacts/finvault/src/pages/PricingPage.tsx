import { PageShell } from '@/components/PageShell';
import { useState } from 'react';

export default function PricingPage() {
  const [tab, setTab] = useState<'online' | 'broker'>('online');

  return (
    <PageShell showAuthStrip={true}>
      <section className="bg-white py-16 border-b" style={{ borderColor: 'var(--border-grey)' }}>
        <div className="max-w-[var(--content-width)] mx-auto px-4 text-center">
          <h1 className="text-[48px] font-light mb-6" style={{ color: 'var(--text-primary)' }}>
            Commission-free trading online.
          </h1>
          <p className="text-[20px] mb-8" style={{ color: 'var(--text-secondary)' }}>
            Transparent pricing with no hidden fees or account minimums.
          </p>
        </div>
      </section>

      <section className="py-20 bg-[var(--section-grey)]">
        <div className="max-w-[var(--content-width)] mx-auto px-4">
          
          <div className="bg-white border rounded-[2px] overflow-hidden" style={{ borderColor: 'var(--border-grey)' }}>
            <div className="flex border-b" style={{ borderColor: 'var(--border-grey)' }}>
              <button 
                onClick={() => setTab('online')}
                className={`flex-1 py-4 text-[16px] font-bold transition-colors ${tab === 'online' ? 'bg-white' : 'bg-gray-100 hover:bg-gray-50'}`}
                style={{ color: tab === 'online' ? 'var(--brand-blue)' : 'var(--text-secondary)' }}
              >
                Online Trades
              </button>
              <div className="w-px bg-gray-300"></div>
              <button 
                onClick={() => setTab('broker')}
                className={`flex-1 py-4 text-[16px] font-bold transition-colors ${tab === 'broker' ? 'bg-white' : 'bg-gray-100 hover:bg-gray-50'}`}
                style={{ color: tab === 'broker' ? 'var(--brand-blue)' : 'var(--text-secondary)' }}
              >
                Broker-Assisted Trades
              </button>
            </div>

            <table className="w-full text-left text-[15px]">
              <thead>
                <tr style={{ backgroundColor: 'var(--nav-bg)', color: 'white' }}>
                  <th className="py-4 px-6 font-normal w-1/3">Investment Product</th>
                  <th className="py-4 px-6 font-normal">Pricing</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-grey)', color: 'var(--text-primary)' }}>
                <tr className="hover:bg-gray-50">
                  <td className="py-5 px-6 font-bold">Stocks & ETFs</td>
                  <td className="py-5 px-6 font-mono text-[16px]">{tab === 'online' ? '$0' : '$0 + $25 service charge'}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-5 px-6 font-bold">Options</td>
                  <td className="py-5 px-6 font-mono text-[16px]">{tab === 'online' ? '$0 base + $0.65/contract' : '$0.65/contract + $25'}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-5 px-6 font-bold">Mutual Funds</td>
                  <td className="py-5 px-6 font-mono text-[16px]">{tab === 'online' ? '$0 (no-load, no-transaction-fee)' : '$0 + $25 service charge'}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-5 px-6 font-bold">Bonds (new issues)</td>
                  <td className="py-5 px-6 font-mono text-[16px]">$0</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-5 px-6 font-bold">Treasury Bills</td>
                  <td className="py-5 px-6 font-mono text-[16px]">$0</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="text-[12px] mt-6 text-center" style={{ color: 'var(--text-secondary)' }}>
            * Standard exchange fees and regulatory fees may apply. See full fee schedule for details.
          </p>

        </div>
      </section>
    </PageShell>
  );
}
