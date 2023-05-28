'use client';

import '@/styles/reset.css';
import '@/styles/tailwind.css';

import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { ServerThemeProvider } from 'next-themes';
import { TailwindIndicator } from '@/components/TailwindIndicator';
import { NavigationBar } from '@/components/header/NavigationBar';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout(props: { children: React.ReactNode }) {
    if (!props) return null;

    return <ServerThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <html lang="en" className={inter.className}>
            <body key="body" className="bg-background text-foreground">
                <SessionProvider>
                    <NavigationBar />
                    <main className="container py-10">{props.children}</main>
                    <TailwindIndicator />
                </SessionProvider>
            </body>
        </html>
    </ServerThemeProvider>;
}