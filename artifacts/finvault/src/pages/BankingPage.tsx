import { PageShell } from '@/components/PageShell';
import { ShieldCheck } from 'lucide-react';

export default function BankingPage() {
  return (
    <PageShell showAuthStrip={true}>
      <section className="bg-white py-16 border-b relative overflow-hidden" style={{ borderColor: 'var(--border-grey)' }}>
        <div className="max-w-[var(--content-width)] mx-auto px-4 flex">
          <div className="max-w-2xl z-10">
            <h1 className="text-[48px] font-light mb-6" style={{ color: 'var(--text-primary)' }}>
              Banking and brokerage, together at last.
            </h1>
            <p className="text-[20px] mb-10" style={{ color: 'var(--text-secondary)' }}>
              Manage your cash and investments in one place. Enjoy unlimited ATM fee rebates worldwide and no foreign transaction fees.
            </p>
            <button
              className="px-8 h-[47px] text-white font-bold text-[16px] hover:opacity-90 transition-opacity rounded-[24px]"
              style={{ backgroundColor: 'var(--cta-orange)' }}
            >
              Open a Checking Account
            </button>
          </div>
        </div>
      </section>

      <div className="bg-[#344B58] text-white py-3 flex items-center justify-center gap-3 text-[14px]">
        <ShieldCheck className="w-5 h-5 text-green-400" />
        Deposits are FDIC insured up to $250,000 per depositor.
      </div>

      <section className="py-20 bg-[#F5F6F7]">
        <div className="max-w-[var(--content-width)] mx-auto px-4">
          <div className="grid grid-cols-3 gap-8">
            <div className="bg-white border rounded-[2px] overflow-hidden flex flex-col" style={{ borderColor: 'var(--border-grey)' }}>
              <div className="h-2 w-full" style={{ backgroundColor: 'var(--brand-blue)' }}></div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-[22px] font-bold mb-4" style={{ color: 'var(--text-primary)' }}>High Yield Investor Checking®</h3>
                <p className="text-[15px] mb-6 flex-1" style={{ color: 'var(--text-secondary)' }}>
                  A checking account linked directly to your brokerage account. Unlimited ATM fee rebates worldwide. No monthly service fees. No account minimums.
                </p>
                <a href="#" className="text-[var(--link-blue)] font-bold hover:underline">Learn more &gt;</a>
              </div>
            </div>

            <div className="bg-white border rounded-[2px] overflow-hidden flex flex-col" style={{ borderColor: 'var(--border-grey)' }}>
              <div className="h-2 w-full" style={{ backgroundColor: 'var(--brand-blue)' }}></div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-[22px] font-bold mb-4" style={{ color: 'var(--text-primary)' }}>High Yield Savings</h3>
                <p className="text-[15px] mb-6 flex-1" style={{ color: 'var(--text-secondary)' }}>
                  Earn competitive interest rates on your idle cash. Easy transfers between your savings and checking or brokerage accounts.
                </p>
                <a href="#" className="text-[var(--link-blue)] font-bold hover:underline">Learn more &gt;</a>
              </div>
            </div>

            <div className="bg-white border rounded-[2px] overflow-hidden flex flex-col" style={{ borderColor: 'var(--border-grey)' }}>
              <div className="h-2 w-full" style={{ backgroundColor: 'var(--brand-blue)' }}></div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-[22px] font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Pledged Asset Line®</h3>
                <p className="text-[15px] mb-6 flex-1" style={{ color: 'var(--text-secondary)' }}>
                  Leverage your portfolio for liquidity without selling your investments. A flexible line of credit backed by eligible assets.
                </p>
                <a href="#" className="text-[var(--link-blue)] font-bold hover:underline">Learn more &gt;</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
