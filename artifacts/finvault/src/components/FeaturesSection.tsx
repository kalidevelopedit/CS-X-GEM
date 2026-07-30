import { GraduationCap, DollarSign, ShieldCheck, ChevronRight } from 'lucide-react';

const features = [
  {
    icon: GraduationCap,
    title: 'World-class education for every investor.',
    links: [{ label: 'Explore Insights & Education', testId: 'link-education' }],
    testId: 'card-feature-education',
  },
  {
    icon: DollarSign,
    title: 'Transparent pricing and low costs.',
    links: [{ label: 'See all our fees', testId: 'link-fees' }],
    testId: 'card-feature-pricing',
  },
  {
    icon: ShieldCheck,
    title: 'Your satisfaction is guaranteed and your security is our priority.',
    links: [
      { label: 'Satisfaction Guarantee', testId: 'link-satisfaction' },
      { label: 'Security Guarantee', testId: 'link-security' },
    ],
    testId: 'card-feature-security',
  },
];

export function FeaturesSection() {
  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-[var(--content-width)] mx-auto px-4">
        <h2
          className="text-center text-[32px] font-light mb-12"
          style={{ color: 'var(--text-primary)' }}
        >
          You deserve more. We can help.
        </h2>

        <div className="grid grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.testId}
                data-testid={feature.testId}
                className="flex flex-col items-center text-center px-8 py-10 border border-gray-200 bg-white"
                style={{ borderRadius: '2px' }}
              >
                {/* Icon — outline only, no filled background */}
                <div className="mb-6">
                  <Icon size={52} strokeWidth={1.25} style={{ color: 'var(--action-blue)' }} />
                </div>

                <p
                  className="text-[17px] font-bold leading-snug mb-5"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {feature.title}
                </p>

                <div className="space-y-1">
                  {feature.links.map((link) => (
                    <a
                      key={link.testId}
                      href="#"
                      data-testid={link.testId}
                      className="flex items-center justify-center gap-1 text-[14px] hover:underline"
                      style={{ color: 'var(--link-blue)' }}
                    >
                      {link.label}
                      <ChevronRight size={14} />
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
