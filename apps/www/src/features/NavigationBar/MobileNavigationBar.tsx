'use client';

import { NavigationIcon, TrelloIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/Button';
import { DiscordIcon, QwarooIcon } from '@/components/Icons';
import { Sheet } from '@/components/Sheet';
import { ProfileButton } from '@/features/ProfileButton';

export function MobileNavigationBar() {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    return <div className="flex md:hidden items-center container h-14">
        <Link href="/" className="inline-flex items-center text-xl font-bold text-primary">
            <QwarooIcon className="inline w-8 h-8 mr-2 fill-primary" />
            Qwaroo
        </Link>

        <Sheet open={open} onOpenChange={setOpen}>
            <Sheet.Trigger asChild>
                <Button className="ml-auto" variant="outline">
                    <NavigationIcon />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </Sheet.Trigger>

            <Sheet.Content className="flex flex-col items-center" size="content" position="right">
                <Sheet.Header className="mt-[30%]">
                    <Link
                        href="/"
                        className="inline-flex items-center text-xl font-bold text-primary"
                    >
                        <QwarooIcon className="inline w-8 h-8 mr-2 fill-primary" />
                        Qwaroo
                    </Link>
                </Sheet.Header>

                <nav className="flex flex-col gap-6 my-6">
                    <Link
                        href="/games"
                        onClick={() => {
                            router.push('/games');
                            setOpen(false);
                        }}
                        className="text-xl text-foreground"
                    >
                        Games
                    </Link>

                    <Link
                        href="/games/create"
                        onClick={() => {
                            router.push('/');
                            setOpen(false);
                        }}
                        className="text-xl text-foreground"
                    >
                        Create
                    </Link>
                </nav>

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

                <ProfileButton />
            </Sheet.Content>
        </Sheet>
    </div>;
}
