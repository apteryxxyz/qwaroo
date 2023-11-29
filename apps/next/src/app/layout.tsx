import '@qwaroo/tailwind-config/styles.css';
import { GeistSans } from 'geist/font/sans';
import { Backdrop } from '@/components/backdrop';
import {
  ClientProviders,
  ServerProviders,
} from '@/components/context-providers';
import { GoogleAnalytics } from '@/components/google-analytics';
import { NavigationBar } from '@/components/navigation-bar';
import type { LayoutProps } from '@/types';
import { APP } from '@/utilities/constants';
import { generateMetadata, generateViewport } from './metadata';

export const metadata = generateMetadata({
  title: {
    template: APP.TITLE_TEMPLATE,
    default: APP.DEFAULT_TITLE,
  },
});

export const viewport = generateViewport();

export default function RootLayout(p: LayoutProps) {
  return (
    <ServerProviders>
      <html lang="en" className={GeistSans.className}>
        <GoogleAnalytics />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        <body key="body" className="flex flex-col">
          <ClientProviders>
            <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
              <NavigationBar />
            </header>

            <main className="container flex-1 gap-6 py-10">{p.children}</main>

            <footer></footer>
          </ClientProviders>

          <Backdrop />
        </body>
      </html>
    </ServerProviders>
  );
}
