export function SiteFooter() {
  return (
    <footer
      className="w-full py-10 border-t border-gray-200"
      style={{ backgroundColor: 'var(--section-grey)' }}
    >
      <div className="max-w-[var(--content-width)] mx-auto px-4">
        <div className="grid grid-cols-5 gap-6 mb-10 text-[13px]" style={{ color: 'var(--link-blue)' }}>
          {[
            ['Invest', 'Stocks', 'ETFs', 'Options', 'Mutual Funds', 'Bonds'],
            ['Accounts', 'Brokerage', 'Roth IRA', 'Traditional IRA', 'Rollover IRA', '401(k)'],
            ['Advice', 'Wealth Management', 'Portfolio Advisory', 'Financial Planning', 'Education'],
            ['Research', 'Market Insights', 'Earnings', 'Economic Calendar', 'Screeners'],
            ['About', 'About Schwab', 'Newsroom', 'Careers', 'Investor Relations'],
          ].map((col) => (
            <div key={col[0]} className="space-y-2">
              <p className="font-bold text-[13px] mb-3" style={{ color: 'var(--text-primary)' }}>
                {col[0]}
              </p>
              {col.slice(1).map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block hover:underline"
                  style={{ color: 'var(--link-blue)' }}
                >
                  {item}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="border-t border-gray-300 pt-6">
          <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            © 2026 Charles Schwab. All rights reserved. Charles Schwab, Inc. (Member SIPC). Brokerage products, including stocks, bonds, and mutual funds are not deposits or obligations of Charles Schwab Bank, N.A., are not guaranteed by Charles Schwab Bank, N.A., and involve investment risks. Charles Schwab Bank, N.A. and Charles Schwab are separate but affiliated companies and subsidiaries of The Charles Schwab Corporation.
          </p>
        </div>
      </div>
    </footer>
  );
}
