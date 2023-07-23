'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DiscordLogoIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/button';
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
        <Link href="/discord">
          <Button variant="ghost" size="sm" className="h-5 w-5 px-0">
            <DiscordLogoIcon className="h-5 w-5" />
            <span className="sr-only">Join the Discord server</span>
          </Button>
        </Link>

        {/* <Link href="/">
          <Button variant="ghost" size="sm" className="w-5 h-5 px-0">
            <TrelloIcon />
            <span className="sr-only">View progress on trello</span>
          </Button>
        </Link> */}

        <ThemeToggle />
      </div>

      <span className="mx-8 h-7 w-[1px] rotate-[20deg] bg-foreground" />

      <ProfileButton />
    </div>
  );
}
