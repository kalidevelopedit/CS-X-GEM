import { ExternalLink, ChevronRight } from 'lucide-react';

const sites = [
  {
    title: 'Advisors',
    description:
      'Get information about going independent with Schwab Advisor Services™ or becoming an independent franchise owner through Schwab Franchise.',
    links: [
      { label: 'Schwab Advisor Services™', testId: 'link-advisor-services' },
      { label: 'Schwab Franchise', testId: 'link-franchise' },
    ],
    testId: 'card-site-advisors',
  },
  {
    title: 'Investment professionals',
    description:
      'Find information about Schwab Funds™ and Schwab ETFs™ from Charles Schwab Investment Management, Inc.',
    links: [
      { label: 'Charles Schwab Investment Management, Inc.', testId: 'link-investment-mgmt' },
    ],
    testId: 'card-site-professionals',
  },
  {
    title: 'Employers',
    description: 'Get information about Schwab Workplace Services.',
    links: [
      { label: 'Schwab Workplace Services', testId: 'link-workplace' },
    ],
    testId: 'card-site-employers',
  },
];

export function OtherSites() {
  return (
    <section className="w-full py-14 bg-white">
      <div className="max-w-[var(--content-width)] mx-auto px-4">
        <p
          className="text-[17px] font-normal mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          Other sites for advisors, investment professionals and employers:
        </p>

        <div className="grid grid-cols-3 gap-5">
          {sites.map((site) => (
            <div
              key={site.testId}
              data-testid={site.testId}
              className="border border-gray-200 px-5 py-5"
              style={{ borderRadius: '2px' }}
            >
              <p
                className="text-[15px] font-bold mb-3"
                style={{ color: 'var(--text-primary)' }}
              >
                {site.title}
              </p>
              <p
                className="text-[13px] leading-relaxed mb-3"
                style={{ color: 'var(--text-secondary)' }}
              >
                {site.description.split(site.links[0]?.label ?? '|||')[0]}
                {site.links.map((link, i) => (
                  <span key={link.testId}>
                    <a
                      href="#"
                      data-testid={link.testId}
                      className="inline-flex items-center gap-0.5 hover:underline"
                      style={{ color: 'var(--link-blue)' }}
                    >
                      {link.label}
                      <ExternalLink size={11} />
                    </a>
                    {i < site.links.length - 1 && ' '}
                  </span>
                ))}
                .
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
