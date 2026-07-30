import { PageShell } from '@/components/PageShell';
import { AwardsSection } from '@/components/AwardsSection';
import { Shield, Headphones, Monitor, PiggyBank } from 'lucide-react';

export default function WhyFinVaultPage() {
  return (
    <PageShell showAuthStrip={false}>
      <section className="bg-[var(--nav-bg)] py-20 text-white border-b-4" style={{ borderColor: 'var(--brand-blue)' }}>
        <div className="max-w-[var(--content-width)] mx-auto px-4 text-center">
          <h1 className="text-[48px] font-light mb-6">
            For over 50 years, we've had one focus: You.
          </h1>
          <p className="text-[20px] max-w-3xl mx-auto opacity-90 leading-relaxed">
            Since our founding, we've believed in making investing accessible to everyone. We continue to break down barriers to help you achieve your financial goals.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-[var(--content-width)] mx-auto px-4">
          <div className="grid grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'Always putting clients first', desc: 'Our Satisfaction Guarantee ensures that if you are not completely satisfied for any reason, we will refund your eligible fee or commission.' },
              { icon: Monitor, title: 'Cutting-edge technology', desc: 'We build industry-leading platforms that provide the speed, reliability, and tools necessary for modern trading.' },
              { icon: Headphones, title: 'Exceptional service', desc: 'Our investment professionals are available 24/7 to answer questions, guide your strategy, and support your needs.' },
              { icon: PiggyBank, title: 'Transparent pricing', desc: '$0 commissions on online equity trades and no hidden account maintenance fees. Keep more of what you earn.' }
            ].map((v, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <v.icon className="w-12 h-12 mb-6" style={{ color: 'var(--brand-blue)' }} strokeWidth={1.5} />
                <h3 className="text-[18px] font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{v.title}</h3>
                <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AwardsSection />

      <section className="bg-[#EEF7FD] py-16 border-t border-b" style={{ borderColor: 'var(--border-grey)' }}>
        <div className="max-w-[var(--content-width)] mx-auto px-4 flex items-center justify-between">
          <div>
            <h2 className="text-[28px] font-normal mb-2" style={{ color: 'var(--text-primary)' }}>Ready to experience the Schwab difference?</h2>
            <p className="text-[16px]" style={{ color: 'var(--text-secondary)' }}>Opening an account takes less than 10 minutes.</p>
          </div>
          <button
            className="px-8 h-[47px] text-white font-bold text-[16px] hover:opacity-90 transition-opacity rounded-[24px]"
            style={{ backgroundColor: 'var(--cta-orange)' }}
          >
            Open an account
          </button>
        </div>
      </section>
    </PageShell>
  );
}
