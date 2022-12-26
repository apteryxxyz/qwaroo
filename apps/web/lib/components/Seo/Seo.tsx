import Head from 'next/head';

export namespace Seo {
    export interface Props {
        title: string;
        noIndex?: boolean;
        children?: React.ReactNode | React.ReactNode[];
    }
}

export function Seo({ title, noIndex, children }: Seo.Props) {
    if (!title.includes('Qwaroo')) title = `${title} - Qwaroo`;

    return <Head>
        {/* Basic */}
        <title>{title}</title>
        <meta name="theme-color" content="#3884f8" />

        {/* Other */}
        <meta name="darkreader-lock" />
        <meta name="robots" content={noIndex ? 'noindex' : 'index'} />

        {/* Branding */}
        <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
        />
        <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
        />
        <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />

        {children}
    </Head>;
}
