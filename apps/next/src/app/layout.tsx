import { Inter } from 'next/font/google';
import { Toaster } from '@/components/toaster';
import { Backdrop } from '@/features/backdrop';
import { DesktopNavigationBar } from '@/features/header/desktop-navigation-bar';
import { MobileNavigationBar } from '@/features/header/mobile-navigation-bar';
import { HTMLProviders, MainProviders } from '@/features/providers';
import type { LayoutProps } from '@/types';
import '@/styles/reset.css';
import '@qwaroo/tailwind-config/styles.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    template: '%s on Qwaroo',
    default: 'Qwaroo',
  },
};

export default function Layout(p: LayoutProps) {
  return (
    <HTMLProviders>
      <html lang="en" className={inter.className}>
        <body key="body">
          <MainProviders>
            <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
              <MobileNavigationBar />
              <DesktopNavigationBar />
            </header>
            <main className="container gap-6 py-10">{p.children}</main>
          </MainProviders>

          <Backdrop />
          <Toaster />
        </body>
      </html>
    </HTMLProviders>
  );
}
