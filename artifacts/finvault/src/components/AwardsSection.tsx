const awards = [
  { rank: '#1', category: 'Overall', year: '2026', testId: 'award-overall' },
  { rank: '#1', category: 'Mobile\nTrading Apps', year: '2026', testId: 'award-mobile' },
  { rank: '#1', category: 'Customer\nService', year: '2026', testId: 'award-service' },
];

export function AwardsSection() {
  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-[var(--content-width)] mx-auto px-4 text-center">
        <p
          className="text-[20px] font-normal mb-16 max-w-3xl mx-auto leading-snug"
          style={{ color: 'var(--text-primary)' }}
        >
          Schwab is the first brokerage to win #1 Overall, #1 Mobile Apps, and #1 Customer Service in the same year since 2017
        </p>

        <div className="flex items-center justify-center gap-10">
          {awards.map((award) => (
            <div
              key={award.testId}
              data-testid={award.testId}
              className="flex flex-col items-center border border-gray-300 bg-white"
              style={{
                width: '180px',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              {/* Badge source label */}
              <div className="w-full px-3 py-2 bg-white border-b border-gray-200">
                <p className="text-[11px] text-center" style={{ color: 'var(--text-secondary)' }}>
                  ✦ StockBrokers.com
                </p>
              </div>

              {/* Dark banner with rank */}
              <div
                className="w-full py-4 flex items-center justify-center"
                style={{ backgroundColor: '#344B58' }}
              >
                <span className="text-white text-[22px] font-bold tracking-wide">
                  · {award.rank} ·
                </span>
              </div>

              {/* Category + year */}
              <div className="flex flex-col items-center justify-center py-5 px-4 gap-3 flex-1">
                <p
                  className="text-[17px] font-bold text-center leading-tight whitespace-pre-line"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {award.category}
                </p>
                <div className="w-12 border-t border-gray-300" />
                <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>
                  {award.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
