'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet } from '@/components/ui/sheet';
import { DiscordIcon } from './discord-icon';
import { ProfileButton } from './profile-button';
import { QwarooIcon } from './qwaroo-icon';
import { ThemeToggle } from './theme-toggle';

export function MobileNavigationBar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="container flex h-14 items-center md:hidden">
      <Link
        href="/"
        className="relative inline-flex items-center text-xl font-bold text-primary"
      >
        <QwarooIcon />
        Qwaroo
        <span className="absolute -top-1.5 right-0 text-sm uppercase">
          Beta
        </span>
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <Sheet.Trigger asChild>
          <Button className="ml-auto" variant="outline">
            <MapIcon className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </Sheet.Trigger>

        <Sheet.Content
          className="flex max-w-fit flex-col items-center"
          side="right"
        >
          <Sheet.Header className="mt-[30%]">
            <Link
              href="/"
              className="relative inline-flex items-center text-xl font-bold text-primary"
            >
              <QwarooIcon />
              Qwaroo
              <span className="absolute -top-1.5 right-0 text-sm uppercase">
                Beta
              </span>
            </Link>
          </Sheet.Header>

          <nav className="my-6 flex flex-col gap-6 text-center">
            <Link
              href="/games"
              onClick={() => setOpen(false)}
              className="text-xl text-foreground"
            >
              Games
            </Link>

            <Link
              href="/games/create"
              onClick={() => setOpen(false)}
              className="text-xl text-foreground"
            >
              Create
            </Link>

            <Link
              href="/blog"
              onClick={() => setOpen(false)}
              className="text-xl text-foreground"
            >
              Blog
            </Link>
          </nav>

          <div className="m-4 inline-flex items-center space-x-4">
            <a href="/discord" target="_blank">
              <DiscordIcon className="h-5 w-5" />
            </a>

            <ThemeToggle />
          </div>

          <ProfileButton />
        </Sheet.Content>
      </Sheet>
    </div>
  );
}
