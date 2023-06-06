'use client';

import '@/styles/reset.css';
import '@/styles/tailwind.css';

import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { ServerThemeProvider } from 'next-themes';
import { Toaster } from '@/components/Toaster';
import { Backdrop } from '@/features/Backdrop';
import { NavigationBar } from '@/features/NavigationBar';
import { TailwindIndicator } from '@/features/TailwindIndicator';

const inter = Inter({ subsets: ['latin'] });

export default async function Layout(props: { children: React.ReactNode }) {
    if (!props) return null;

    return <ServerThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
    >
        <html lang="en" className={inter.className}>
            <body key="body" className="bg-background text-foreground">
                <SessionProvider>
                    <NavigationBar />
                    <main className="container py-10">{props.children}</main>
                    <TailwindIndicator />
                </SessionProvider>

                <Backdrop />
                <Toaster />
            </body>
        </html>
    </ServerThemeProvider>;
}
