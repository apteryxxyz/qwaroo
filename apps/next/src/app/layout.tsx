import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { Backdrop } from '@/components/backdrop';
import { DesktopNavigationBar } from '@/components/header/desktop-navigation-bar';
import { MobileNavigationBar } from '@/components/header/mobile-navigation-bar';
import { HTMLProviders, MainProviders } from '@/components/providers';
import type { LayoutProps } from '@/types';
import '@/styles/reset.css';
import '@qwaroo/tailwind-config/styles.css';
import Link from 'next/link';
import { allPosts } from 'contentlayer/generated';
import { Footer } from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    template: '%s on Qwaroo',
    default: 'Qwaroo',
  },
};

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
