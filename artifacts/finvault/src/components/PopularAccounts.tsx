import { ChevronRight } from 'lucide-react';

const accounts = [
  {
    title: 'Individual Brokerage',
    description: 'Invest in stocks, ETFs, options, bonds, and more with a personal account.',
    testId: 'card-account-individual',
  },
  {
    title: 'Joint Brokerage',
    description: 'Invest in stocks, ETFs, options, bonds, and more with another individual.',
    testId: 'card-account-joint',
  },
  {
    title: 'Roth IRA',
    description: 'Plan for your future with a Roth IRA.',
    testId: 'card-account-roth',
  },
  {
    title: 'Traditional IRA',
    description: 'Plan for your future with a Traditional IRA.',
    testId: 'card-account-traditional',
  },
  {
    title: 'Rollover IRA',
    description: 'Roll over your prior retirement plan from a former employer.',
    testId: 'card-account-rollover',
  },
];

export function PopularAccounts() {
  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-[var(--content-width)] mx-auto px-4">
        <h2
          className="text-[30px] font-light mb-10"
          style={{ color: 'var(--text-primary)' }}
        >
          Get started with one of our most popular accounts.
        </h2>

        <div className="grid grid-cols-5 gap-4">
          {accounts.map((account) => (
            <button
              key={account.testId}
              data-testid={account.testId}
              className="flex flex-col justify-between text-left px-4 py-5 border border-gray-200 bg-white hover:border-gray-400 transition-colors group"
              style={{ borderRadius: '2px', minHeight: '180px' }}
            >
              <div className="space-y-2">
                <p className="text-[15px] font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
                  {account.title}
                </p>
                <p className="text-[13px] leading-snug" style={{ color: 'var(--text-secondary)' }}>
                  {account.description}
                </p>
              </div>
              <ChevronRight
                size={18}
                className="mt-4 group-hover:translate-x-0.5 transition-transform"
                style={{ color: 'var(--action-blue)' }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
