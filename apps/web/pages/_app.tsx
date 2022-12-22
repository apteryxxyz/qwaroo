import '@fortawesome/fontawesome-svg-core/styles.css';
import '#/styles/common.css';

import { Client } from '@owenii/client';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Bubbles } from '#/components/Background/Bubbles';
import { FooterBar } from '#/components/FooterBar';
import { NavigationBar } from '#/components/NavigationBar';
import { ClientProvider } from '#/contexts/ClientContext';
import { useApiUrl } from '#/hooks/useEnv';
import { pageView } from '#/utilities/googleServices';

const client = new Client({ apiHost: useApiUrl() });

export default ({ Component, pageProps }: AppProps) => {
    const router = useRouter();

    useEffect(() => {
        // Login the client if the user has an id and token
        const uid = localStorage.getItem('owenii.user_id');
        const token = localStorage.getItem('owenii.token');
        if (uid && token) void client.login(uid, token);
        Reflect.set(globalThis, '__OWENII_CLIENT__', client);
    }, []);

    useEffect(() => {
        // Google analytics page view
        const handleChange = (url: string) => pageView(url);

        router.events.on('routeChangeComplete', handleChange);
        router.events.on('hashChangeComplete', handleChange);

        return () => {
            router.events.off('routeChangeComplete', handleChange);
            router.events.off('hashChangeComplete', handleChange);
        };
    }, [router.events]);

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
