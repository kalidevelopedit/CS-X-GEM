import { PageShell } from '@/components/PageShell';

export default function ETFsPage() {
  return (
    <PageShell showAuthStrip={true}>
      <section className="bg-white py-16 border-b" style={{ borderColor: 'var(--border-grey)' }}>
        <div className="max-w-[var(--content-width)] mx-auto px-4">
          <h1 className="text-[44px] font-light mb-6" style={{ color: 'var(--text-primary)' }}>
            Exchange-Traded Funds (ETFs)
          </h1>
          <p className="text-[18px] max-w-3xl mb-8" style={{ color: 'var(--text-secondary)' }}>
            Build a diversified portfolio with low costs and tax efficiency. Trade over 2,000 commission-free ETFs from leading providers.
          </p>
        </div>
      </section>

      <section className="py-20 bg-[#F5F6F7] border-b" style={{ borderColor: 'var(--border-grey)' }}>
        <div className="max-w-[var(--content-width)] mx-auto px-4">
          <div className="grid grid-cols-3 gap-8">
            <div className="bg-white border p-8 rounded-[2px]" style={{ borderColor: 'var(--border-grey)' }}>
              <h3 className="text-[20px] font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Commission-free ETFs</h3>
              <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>Pay $0 online commissions when trading U.S. listed ETFs. No account minimums required.</p>
            </div>
            <div className="bg-white border p-8 rounded-[2px]" style={{ borderColor: 'var(--border-grey)' }}>
              <h3 className="text-[20px] font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Schwab ETFs™</h3>
              <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>Access our proprietary index ETFs with some of the lowest operating expenses in the industry.</p>
            </div>
            <div className="bg-white border p-8 rounded-[2px]" style={{ borderColor: 'var(--border-grey)' }}>
              <h3 className="text-[20px] font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Third-party ETFs</h3>
              <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>Choose from thousands of ETFs spanning multiple asset classes from providers like Vanguard, iShares, and State Street.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-[var(--content-width)] mx-auto px-4">
          <h2 className="text-[28px] font-normal mb-8" style={{ color: 'var(--text-primary)' }}>Featured Broad Market ETFs</h2>
          
          <div className="border rounded-[2px] overflow-hidden" style={{ borderColor: 'var(--border-grey)' }}>
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr style={{ backgroundColor: 'var(--nav-bg)', color: 'white' }}>
                  <th className="py-3 px-4 font-normal">Symbol</th>
                  <th className="py-3 px-4 font-normal">Name</th>
                  <th className="py-3 px-4 font-normal text-right">Expense Ratio</th>
                  <th className="py-3 px-4 font-normal text-right">1Yr Return</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-grey)', color: 'var(--text-primary)' }}>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-bold text-[var(--link-blue)]">FUSX</td>
                  <td className="py-3 px-4">Schwab U.S. Broad Market ETF</td>
                  <td className="py-3 px-4 text-right">0.03%</td>
                  <td className="py-3 px-4 text-right text-green-600">+22.4%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-bold text-[var(--link-blue)]">FIND</td>
                  <td className="py-3 px-4">Schwab International Dividend ETF</td>
                  <td className="py-3 px-4 text-right">0.06%</td>
                  <td className="py-3 px-4 text-right text-green-600">+14.2%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-bold text-[var(--link-blue)]">FAGG</td>
                  <td className="py-3 px-4">Schwab U.S. Aggregate Bond ETF</td>
                  <td className="py-3 px-4 text-right">0.04%</td>
                  <td className="py-3 px-4 text-right text-green-600">+4.1%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-bold text-[var(--link-blue)]">VOO</td>
                  <td className="py-3 px-4">Vanguard S&P 500 ETF</td>
                  <td className="py-3 px-4 text-right">0.03%</td>
                  <td className="py-3 px-4 text-right text-green-600">+24.8%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-bold text-[var(--link-blue)]">QQQ</td>
                  <td className="py-3 px-4">Invesco QQQ Trust</td>
                  <td className="py-3 px-4 text-right">0.20%</td>
                  <td className="py-3 px-4 text-right text-green-600">+38.5%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
