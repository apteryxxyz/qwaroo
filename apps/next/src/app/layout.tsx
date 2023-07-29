import { Inter } from 'next/font/google';
import { Backdrop } from '@/components/backdrop';
import { DesktopNavigationBar } from '@/components/desktop-navigation-bar';
import { MobileNavigationBar } from '@/components/mobile-navigation-bar';
import { HTMLProviders, MainProviders } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import type { LayoutProps } from '@/types';
import '@/styles/reset.css';
import '@qwaroo/tailwind-config/styles.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { allPosts } from 'contentlayer/generated';
import { Footer } from '@/components/footer';
import { absoluteUrl } from '@/utilities/url';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL(absoluteUrl('/')),
  applicationName: 'Qwaroo',
  title: {
    template: '%s on Qwaroo',
    default: 'Qwaroo',
  },

  openGraph: {
    type: 'website',
    siteName: 'Qwaroo',
    locale: 'en',
    title: 'Qwaroo',
    description:
      'Higher or Lower on a whole new level, play one of the many games we have to offer, or create your own and share it with your friends!',
    images: [
      {
        url: absoluteUrl('/images/og.png'),
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: 'summary',
    title: 'Qwaroo',
    description:
      'Higher or Lower on a whole new level, play one of the many games we have to offer, or create your own and share it with your friends!',
    creator: '@apteryxxyz',
    images: [absoluteUrl('/images/og.png')],
  },
} satisfies Metadata;

export default function Layout(p: LayoutProps) {
  const post = allPosts.at(-1);

  return (
    <HTMLProviders>
      <html lang="en" className={inter.className}>
        <body key="body" className="flex flex-col">
          <MainProviders>
            <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
              <MobileNavigationBar />
              <DesktopNavigationBar />
              {post?.bannerText && (
                <p className="flex w-screen items-center justify-center bg-brand p-1 text-center text-white">
                  {post.bannerText}&nbsp;
                  <Link href={`/posts/${post.slug}`} className="underline">
                    Read more →
                  </Link>
                </p>
              )}
            </header>

            <main className="container flex-1 gap-6 py-10">{p.children}</main>

            <Footer />
          </MainProviders>

          <Backdrop />
          <Toaster />
        </body>
      </html>
    </HTMLProviders>
  );
}
