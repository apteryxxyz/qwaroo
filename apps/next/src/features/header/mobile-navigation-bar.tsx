'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapIcon } from 'lucide-react';
import { Button } from '@/components/button';
import { QwarooIcon } from '@/components/icons/qwaroo-icon';
import { Sheet } from '@/components/sheet';
import { ProfileButton } from './profile-button';
import { ThemeToggle } from './theme-toggle';

export function MobileNavigationBar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="container flex h-14 items-center md:hidden">
      <Link
        href="/"
        className="inline-flex items-center text-xl font-bold text-primary"
      >
        <QwarooIcon className="mr-1 inline h-8 w-8 fill-primary" />
        Qwaroo
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <Sheet.Trigger asChild>
          <Button className="ml-auto" variant="outline">
            <MapIcon className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </Sheet.Trigger>

        <Sheet.Content className="flex flex-col items-center" side="right">
          <Sheet.Header className="mt-[30%]">
            <Link
              href="/"
              className="inline-flex items-center text-xl font-bold text-primary"
            >
              <QwarooIcon className="mr-1 inline h-8 w-8 fill-primary" />
              Qwaroo
            </Link>
          </Sheet.Header>

          <nav className="my-6 flex flex-col gap-6">
            <Link
              href="/games"
              onClick={() => {
                setOpen(false);
              }}
              className="text-xl text-foreground"
            >
              Games
            </Link>

            <Link
              href="/games/create"
              onClick={() => {
                setOpen(false);
              }}
              className="text-xl text-foreground"
            >
              Create
            </Link>
          </nav>

          <div className="m-4 inline-flex items-center space-x-4">
            {/* <Link href="/">
              <Button variant="ghost" size="sm" className="h-4 w-4 px-0">
                <DiscordLogoIcon className="mr-1 h-4 w-4" />
                <span className="sr-only">Join the Discord server</span>
              </Button>
            </Link> */}

            {/* <Link href="/">
              <Button variant="ghost" size="sm" className="w-5 h-5 px-0">
                <TrelloIcon /> 
                <span className="sr-only">View progress on trello</span>
              </Button>
            </Link> */}

            <ThemeToggle />
          </div>

          <ProfileButton />
        </Sheet.Content>
      </Sheet>
    </div>
  );
}
