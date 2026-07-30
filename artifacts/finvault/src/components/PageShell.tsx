import { ReactNode } from 'react';
import { Header } from '@/components/Header';
import { SiteFooter } from '@/components/SiteFooter';
import { AuthStrip } from '@/components/AuthStrip';

export function PageShell({ children, showAuthStrip = false }: { children: ReactNode, showAuthStrip?: boolean }) {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      {showAuthStrip && <AuthStrip />}
      <main className="flex-1 w-full relative">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
