import { PageShell } from '@/components/PageShell';
import { LineChart, PiggyBank, CreditCard } from 'lucide-react';

export default function BrokeragePage() {
  return (
    <PageShell showAuthStrip={true}>
      {/* Hero */}
      <section className="bg-white py-16 border-b" style={{ borderColor: 'var(--border-grey)' }}>
        <div className="max-w-[var(--content-width)] mx-auto px-4">
          <h1 className="text-[44px] font-light mb-6" style={{ color: 'var(--text-primary)' }}>
            Smarter investing starts when you open a brokerage account.
          </h1>
          <p className="text-[18px] max-w-3xl mb-8" style={{ color: 'var(--text-secondary)' }}>
            Whether you want to trade actively, invest for the long term, or something in between, our standard brokerage account gives you the flexibility and tools you need.
          </p>
          <button
            data-testid="cta-open-brokerage"
            className="px-8 h-[47px] text-white font-bold text-[16px] hover:opacity-90 transition-opacity rounded-[24px]"
            style={{ backgroundColor: 'var(--cta-orange)' }}
          >
            Open an account
          </button>
        </div>
      </section>

      {/* Pricing Strip */}
      <section className="w-full py-4 border-b bg-[#F5F6F7]" style={{ borderColor: 'var(--border-grey)' }}>
        <div className="max-w-[var(--content-width)] mx-auto px-4 flex items-center justify-center gap-12 text-[15px] font-bold" style={{ color: 'var(--text-primary)' }}>
          <span>$0 online equity trades</span>
          <span className="text-gray-400 font-normal">|</span>
          <span>$0 account minimums</span>
          <span className="text-gray-400 font-normal">|</span>
          <span>No hidden fees</span>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-[var(--content-width)] mx-auto px-4 grid grid-cols-3 gap-8">
          {[
            {
              icon: LineChart,
              title: 'Buy and sell with ease',
              desc: 'Trade stocks, options, mutual funds, ETFs, and more all from one intuitive platform.'
            },
            {
              icon: PiggyBank,
              title: 'Set money aside for your goals',
              desc: 'Easily set up recurring transfers and automate your investment strategy.'
            },
            {
              icon: CreditCard,
              title: 'Use your funds any time',
              desc: 'Enjoy free checking and a linked debit card with our paired checking account.'
            }
          ].map((item, i) => (
            <div key={i} className="border p-8 rounded-[2px] bg-white flex flex-col items-center text-center" style={{ borderColor: 'var(--border-grey)' }}>
              <item.icon className="w-12 h-12 mb-6" style={{ color: 'var(--action-blue)' }} strokeWidth={1.5} />
              <h3 className="text-[20px] font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
              <p className="text-[15px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
