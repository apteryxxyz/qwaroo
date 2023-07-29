'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utilities/styling';
import { DiscordIcon } from './discord-icon';
import { ProfileButton } from './profile-button';
import { QwarooIcon } from './qwaroo-icon';
import { ThemeToggle } from './theme-toggle';

export function DesktopNavigationBar() {
  const pathname = usePathname();

  return (
    <div className="container hidden h-14 items-center md:flex">
      <Link
        href="/"
        className="inline-flex items-center text-xl font-bold text-primary"
      >
        <QwarooIcon />
        Qwaroo
      </Link>

      <span className="mx-8 h-7 w-[1px] rotate-[20deg] bg-foreground" />

      <nav className="mr-auto inline-flex items-center space-x-6">
        <Link
          href="/games"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === '/games' ? 'text-foreground' : 'text-foreground/60',
          )}
        >
          Games
        </Link>

        <Link
          href="/games/create"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === '/games/create'
              ? 'text-foreground'
              : 'text-foreground/60',
          )}
        >
          Create
        </Link>

        <Link
          href="/posts"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === '/posts' ? 'text-foreground' : 'text-foreground/60',
          )}
        >
          Blog
        </Link>
      </nav>

      <span className="mx-8 h-7 w-[1px] rotate-[20deg] bg-foreground" />

      <div className="m-4 inline-flex items-center space-x-4">
        <Link href="/discord">
          <DiscordIcon className="h-5 w-5" />
        </Link>

        <ThemeToggle />
      </div>

      <span className="mx-8 h-7 w-[1px] rotate-[20deg] bg-foreground" />

      <ProfileButton />
    </div>
  );
}
