import { PageShell } from '@/components/PageShell';
import { Link } from 'wouter';

export default function IRAPage() {
  return (
    <PageShell showAuthStrip={true}>
      <section className="bg-[var(--section-grey)] py-16 border-b" style={{ borderColor: 'var(--border-grey)' }}>
        <div className="max-w-[var(--content-width)] mx-auto px-4 text-center">
          <h1 className="text-[44px] font-light mb-6" style={{ color: 'var(--text-primary)' }}>
            Individual Retirement Accounts (IRAs)
          </h1>
          <p className="text-[18px] max-w-3xl mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
            Take control of your retirement with an IRA that fits your goals and tax strategy.
          </p>
          <button
            data-testid="cta-open-ira"
            className="px-8 h-[47px] text-white font-bold text-[16px] hover:opacity-90 transition-opacity rounded-[24px]"
            style={{ backgroundColor: 'var(--cta-orange)' }}
          >
            Open an IRA account
          </button>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-[var(--content-width)] mx-auto px-4">
          <div className="grid grid-cols-3 gap-6 mb-8">
            {[
              { title: 'Roth IRA', desc: 'Contribute after-tax dollars, and enjoy tax-free growth and withdrawals in retirement.' },
              { title: 'Traditional IRA', desc: 'Contributions may be tax-deductible now, and earnings grow tax-deferred until withdrawn.' },
              { title: 'Rollover IRA', desc: 'Consolidate old 401(k)s and employer plans into one manageable retirement account.' }
            ].map((ira, i) => (
              <div key={i} className="border p-6 rounded-[2px] bg-white flex flex-col" style={{ borderColor: 'var(--border-grey)' }}>
                <h3 className="text-[20px] font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{ira.title}</h3>
                <p className="text-[14px] flex-1 mb-6" style={{ color: 'var(--text-secondary)' }}>{ira.desc}</p>
                <Link href="/ira" className="text-[var(--link-blue)] font-bold text-[14px] hover:underline">Learn more &gt;</Link>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6 w-2/3 mx-auto">
            {[
              { title: 'Inherited IRA', desc: 'For beneficiaries who have inherited retirement assets from a deceased individual.' },
              { title: 'SEP IRA', desc: 'A simplified plan for self-employed individuals and small business owners.' }
            ].map((ira, i) => (
              <div key={i} className="border p-6 rounded-[2px] bg-white flex flex-col" style={{ borderColor: 'var(--border-grey)' }}>
                <h3 className="text-[20px] font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{ira.title}</h3>
                <p className="text-[14px] flex-1 mb-6" style={{ color: 'var(--text-secondary)' }}>{ira.desc}</p>
                <Link href="/ira" className="text-[var(--link-blue)] font-bold text-[14px] hover:underline">Learn more &gt;</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--section-grey)] border-t" style={{ borderColor: 'var(--border-grey)' }}>
        <div className="max-w-[var(--content-width)] mx-auto px-4">
          <h2 className="text-[28px] font-normal mb-8 text-center" style={{ color: 'var(--text-primary)' }}>Compare Tax Advantages</h2>
          <div className="bg-white border rounded-[2px] overflow-hidden mx-auto max-w-4xl" style={{ borderColor: 'var(--border-grey)' }}>
            <table className="w-full text-left text-[15px]">
              <thead>
                <tr style={{ backgroundColor: 'var(--nav-bg)', color: 'white' }}>
                  <th className="py-4 px-6 font-normal w-1/3">Feature</th>
                  <th className="py-4 px-6 font-normal w-1/3 border-l border-white/20">Traditional IRA</th>
                  <th className="py-4 px-6 font-normal w-1/3 border-l border-white/20">Roth IRA</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-grey)', color: 'var(--text-primary)' }}>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-6 font-bold">Tax benefit</td>
                  <td className="py-4 px-6 border-l" style={{ borderColor: 'var(--border-grey)' }}>Tax-deductible contributions</td>
                  <td className="py-4 px-6 border-l" style={{ borderColor: 'var(--border-grey)' }}>Tax-free withdrawals</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-6 font-bold">Income limits</td>
                  <td className="py-4 px-6 border-l" style={{ borderColor: 'var(--border-grey)' }}>None (but deductibility may be limited)</td>
                  <td className="py-4 px-6 border-l" style={{ borderColor: 'var(--border-grey)' }}>Must be under MAGI limits</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-6 font-bold">RMDs (Required Minimum Distributions)</td>
                  <td className="py-4 px-6 border-l" style={{ borderColor: 'var(--border-grey)' }}>Required starting at age 73</td>
                  <td className="py-4 px-6 border-l" style={{ borderColor: 'var(--border-grey)' }}>Not required during owner's lifetime</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
