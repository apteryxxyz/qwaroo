'use client';

import { TrelloIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ProfileButton } from '../auth/ProfileButton';
import { Button } from '../ui/Button';
import { DiscordIcon, Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { cn, tw } from '@/utilities/styling';

export function NavigationBar() {
    const pathname = usePathname();

    return <header
        data-side="client"
        className="sticky top-0 z-40 w-full border-b supports-backdrop-blur:bg-background/60 bg-background/95 backdrop-blur"
    >
        <div className="container flex h-14 items-center">
            <Link href="/" className="inline-flex items-center text-xl font-bold text-primary">
                <Logo className="inline w-8 h-8 mr-2 fill-primary" />
                Qwaroo
            </Link>

            <span className="hidden md:block mx-8 h-7 w-[1px] bg-foreground rotate-[20deg]" />

            <nav className={tw('m-auto md:(m-0,mr-auto) inline-flex items-center space-x-6')}>
                <Link
                    href="/games"
                    className={cn(
                        'transition-colors hover:text-foreground/80',
                        pathname === '/games' ? 'text-foreground' : 'text-foreground/60'
                    )}
                >
                    Games
                </Link>
                <Link
                    href="/"
                    className={cn(
                        'transition-colors hover:text-foreground/80',
                        pathname === '/games/create' ? 'text-foreground' : 'text-foreground/60'
                    )}
                >
                    Create
                </Link>
            </nav>

            <span className="hidden md:block mx-8 h-7 w-[1px] bg-foreground rotate-[20deg]" />

            <div className="m-4 inline-flex items-center space-x-4">
                <Link href="/">
                    <Button variant="ghost" size="sm" className="w-5 h-5 px-0">
                        <DiscordIcon className="stroke-foreground stroke-0 dark:stroke-2" />
                        <span className="sr-only">Join the Discord server</span>
                    </Button>
                </Link>

                <Link href="/">
                    <Button variant="ghost" size="sm" className="w-5 h-5 px-0">
                        <TrelloIcon />
                        <span className="sr-only">View progress on trello</span>
                    </Button>
                </Link>

                <ThemeToggle />
            </div>

            <span className="hidden md:block mx-8 h-7 w-[1px] bg-foreground rotate-[20deg]" />

            <ProfileButton />
        </div>
    </header>;
}
