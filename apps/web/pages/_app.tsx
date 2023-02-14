import '#/styles/common.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import { Pipe, Pipeline } from 'react-pipeline-component';
import { Bubbles } from '#/components/Background/Bubbles';
import { Footer } from '#/components/Footer';
import { Header } from '#/components/Header';
import { ClientProvider, createClient } from '#/contexts/Client';
import { pageView } from '#/utilities/googleServices';
import { repairMainHeight } from '#/utilities/screenControl';

const client = createClient();

export default ({ Component, pageProps }: AppProps) => {
    const router = useRouter();

    useEffect(() => {
        Reflect.set(globalThis, '__QWAROO_CLIENT__', client);

        // Login to the client if ID and token are present
        const id = localStorage.getItem('qwaroo.user_id');
        const token = localStorage.getItem('qwaroo.token');
        if (id && token) {
            client.prepare(id, token);
            void client.login();
        }

        repairMainHeight();
        window.addEventListener('resize', repairMainHeight);
        return () => window.removeEventListener('resize', repairMainHeight);
    }, []);

    useEffect(() => {
        const handleChange = (url: string) => pageView(url);

        router.events.on('routeChangeComplete', handleChange);
        router.events.on('hashChangeComplete', handleChange);

        return () => {
            router.events.off('routeChangeComplete', handleChange);
            router.events.off('hashChangeComplete', handleChange);
        };
    }, [router.events]);

    return <Pipeline
        // prettier-ignore
        components={[
            <ThemeProvider attribute="class" storageKey="qwaroo.theme" enableSystem children={<Pipe />} />,
            <ClientProvider value={client} children={<Pipe />} />,
        ]}
    >
        <qwaroo className="min-h-screen flex flex-col mx-auto bg-neutral-200 dark:bg-neutral-900">
            <Header />

            <main
                className="flex flex-col gap-3 z-10 max-w-8xl w-full mx-auto p-3
                text-black dark:text-white"
            >
                <Component {...pageProps} />
            </main>

            <Footer />

            <div className="hidden md:block motion-reduce:hidden">
                <Bubbles count={20} />
            </div>
        </qwaroo>
    </Pipeline>;
};

declare global {
    namespace JSX {
        interface IntrinsicElements {
            qwaroo: React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement>,
                HTMLElement
            >;
        }
    }
}
