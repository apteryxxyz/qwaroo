'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { QwarooIcon } from '@/components/icons/qwaroo-icon';
import { cn } from '@/utilities/styling';
import { ProfileButton } from './profile-button';
import { ThemeToggle } from './theme-toggle';

export function DesktopNavigationBar() {
  const pathname = usePathname();

  return (
    <div className="container hidden h-14 items-center md:flex">
      <Link
        href="/"
        className="inline-flex items-center text-xl font-bold text-primary"
      >
        <QwarooIcon className="mr-1 inline h-8 w-8 fill-primary" />
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
      </nav>

      <span className="mx-8 h-7 w-[1px] rotate-[20deg] bg-foreground" />

      <div className="m-4 inline-flex items-center space-x-4">
        <ThemeToggle />
      </div>

      <span className="mx-8 h-7 w-[1px] rotate-[20deg] bg-foreground" />

      <ProfileButton />
    </div>
  );
}
