import '#/styles/common.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import { Pipe, Pipeline } from 'react-pipeline-component';
import { Layout } from '#/components/Layout';
import { ClientProvider, createClient } from '#/contexts/Client';
import { resizeMain } from '#/utilities/element';
import { triggerPageView } from '#/utilities/google';

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

        resizeMain();
        window.addEventListener('resize', resizeMain);
        return () => window.removeEventListener('resize', resizeMain);
    }, []);

    useEffect(() => {
        const handleChange = (url: string) => triggerPageView(url);

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
        <Layout {...pageProps}>
            <Component {...pageProps} />
        </Layout>
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
