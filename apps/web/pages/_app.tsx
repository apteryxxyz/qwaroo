/* eslint-disable @typescript-eslint/restrict-plus-operands */
import '@fortawesome/fontawesome-svg-core/styles.css';
import '#/styles/common.css';

import { Client } from '@owenii/client';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import { Bubbles } from '#/components/Background/Bubbles';
import { FooterBar } from '#/components/FooterBar';
import { NavigationBar } from '#/components/NavigationBar';
import { ClientProvider } from '#/contexts/ClientContext';
import { useApiUrl } from '#/hooks/useEnv';

const apiUrl = String(process.env['NEXT_PUBLIC_API_URL'] ?? '');
const client = new Client({ apiHost: apiUrl });

export default ({ Component, pageProps }: AppProps) => {
    useEffect(() => {}, []);

    useEffect(() => {
        const uid = localStorage.getItem('owenii.uid');
        const token = localStorage.getItem('owenii.token');
        if (uid && token) void client.login(uid, token);
        Reflect.set(globalThis, '__OWENII_CLIENT__', client);
    }, []);

    return <ClientProvider value={client}>
        <ThemeProvider
            enableSystem={true}
            attribute="class"
            storageKey="owenii.theme"
        >
            <Head>
                <link rel="preconnect" href={useApiUrl().toString()} />
            </Head>

            <div
                id="body"
                className="min-h-screen flex flex-col max-auto
                    bg-neutral-100 dark:bg-neutral-900"
            >
                <NavigationBar />

                <main
                    id="content"
                    className="z-10 max-w-7xl w-full h-full mx-auto p-3 mb-auto
                        text-black dark:text-white"
                >
                    <Component {...pageProps} />
                </main>

                <FooterBar />
            </div>

            <Bubbles count={20} />
        </ThemeProvider>
    </ClientProvider>;
};