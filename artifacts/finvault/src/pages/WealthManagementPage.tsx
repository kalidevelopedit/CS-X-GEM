import { PageShell } from '@/components/PageShell';
import { Link } from 'wouter';

export default function WealthManagementPage() {
  return (
    <PageShell showAuthStrip={true}>
      <section className="bg-white py-16 border-b" style={{ borderColor: 'var(--border-grey)' }}>
        <div className="max-w-[var(--content-width)] mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-[44px] font-light mb-6 leading-tight" style={{ color: 'var(--text-primary)' }}>
              Personalized wealth management services.<br/>Flexible investment solutions.
            </h1>
            <p className="text-[18px] mb-8" style={{ color: 'var(--text-secondary)' }}>
              Partner with a dedicated wealth advisor who will help you create a comprehensive financial plan and manage your portfolio through every stage of life.
            </p>
            <button
              data-testid="cta-wealth-management"
              className="px-8 h-[47px] text-white font-bold text-[16px] hover:opacity-90 transition-opacity rounded-[24px]"
              style={{ backgroundColor: 'var(--login-blue)' }}
            >
              Start a conversation
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--section-grey)]">
        <div className="max-w-[var(--content-width)] mx-auto px-4">
          <h2 className="text-[28px] font-normal mb-10" style={{ color: 'var(--text-primary)' }}>Choose the level of advice you need</h2>
          
          <div className="space-y-6">
            {[
              {
                title: 'Schwab Wealth Advisory',
                subtitle: 'Ongoing, personalized wealth management',
                desc: 'Work 1-on-1 with a dedicated professional who will help you build and manage a comprehensive wealth plan tailored to your unique situation. Ideal for complex financial needs.',
                min: '$500,000 minimum'
              },
              {
                title: 'Schwab Managed Portfolios',
                subtitle: 'Professionally managed mutual fund and ETF portfolios',
                desc: 'Select from a variety of diversified portfolios managed by professional portfolio managers, designed to align with your personal risk tolerance and goals.',
                min: '$25,000 minimum'
              },
              {
                title: 'Schwab Advisor Network',
                subtitle: 'Referrals to independent advisory firms',
                desc: 'We can connect you with an independent, specialized investment advisor in your area if your financial situation requires specific expertise or highly customized management.',
                min: '$500,000 minimum'
              }
            ].map((svc, i) => (
              <div key={i} className="bg-white border p-8 rounded-[2px] flex items-start gap-8" style={{ borderColor: 'var(--border-grey)' }}>
                <div className="flex-1">
                  <h3 className="text-[22px] font-bold mb-1" style={{ color: 'var(--brand-blue)' }}>{svc.title}</h3>
                  <p className="text-[16px] font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{svc.subtitle}</p>
                  <p className="text-[15px] mb-4 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>{svc.desc}</p>
                  <Link href="#" className="text-[var(--link-blue)] font-bold text-[14px] hover:underline">Learn more &gt;</Link>
                </div>
                <div className="w-[200px] border-l pl-8 shrink-0 flex flex-col justify-center" style={{ borderColor: 'var(--border-grey)' }}>
                  <span className="text-[13px] font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>Investment Minimum</span>
                  <span className="text-[18px] font-light" style={{ color: 'var(--text-primary)' }}>{svc.min}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
