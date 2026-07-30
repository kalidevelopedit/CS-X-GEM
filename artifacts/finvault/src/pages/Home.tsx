import { Header } from '@/components/Header';
import { AuthStrip } from '@/components/AuthStrip';
import { LocationAlert } from '@/components/LocationAlert';
import { HeroSection } from '@/components/HeroSection';
import { CtaPanel } from '@/components/CtaPanel';
import { InvestmentPathCards } from '@/components/InvestmentPathCards';
import { FeaturesSection } from '@/components/FeaturesSection';
import { PopularAccounts } from '@/components/PopularAccounts';
import { AwardsSection } from '@/components/AwardsSection';
import { ImportantNotice } from '@/components/ImportantNotice';
import { FaqSection } from '@/components/FaqSection';
import { ContactHelp } from '@/components/ContactHelp';
import { OtherSites } from '@/components/OtherSites';
import { SiteFooter } from '@/components/SiteFooter';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <AuthStrip />
      <LocationAlert />
      <HeroSection />
      <CtaPanel />
      <InvestmentPathCards />
      <FeaturesSection />
      <PopularAccounts />
      <AwardsSection />
      <ImportantNotice />
      <FaqSection />
      <ContactHelp />
      <OtherSites />
      <SiteFooter />
    </div>
  );
}
