import { ChevronRight } from 'lucide-react';

const paths = [
  { label: 'Invest on my own', testId: 'card-invest-own' },
  { label: 'Trade with thinkorswim®', testId: 'card-thinkorswim' },
  { label: 'Automate my investing', testId: 'card-automate' },
  { label: 'Work with an advisor', testId: 'card-advisor' },
];

export function InvestmentPathCards() {
  return (
    <section className="w-full py-12 bg-white">
      <div className="max-w-[var(--content-width)] mx-auto px-4">
        <div className="grid grid-cols-4 gap-4">
          {paths.map((path) => (
            <button
              key={path.testId}
              data-testid={path.testId}
              className="flex items-center justify-between text-left px-5 py-6 border border-gray-200 bg-white hover:border-gray-400 transition-colors group"
              style={{ borderRadius: '2px' }}
            >
              <span className="text-[15px] font-bold" style={{ color: 'var(--text-primary)' }}>
                {path.label}
              </span>
              <ChevronRight
                size={18}
                className="flex-shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform"
                style={{ color: 'var(--action-blue)' }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
