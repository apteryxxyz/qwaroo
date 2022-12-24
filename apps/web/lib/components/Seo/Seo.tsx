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
        <link rel="manifest" href="/manifest.json" />
        <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/branding/180x180.png"
        />
        <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/branding/16x16.png"
        />
        <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/branding/32x32.png"
        />
        <link
            rel="icon"
            type="image/png"
            sizes="64x64"
            href="/branding/64x64.png"
        />

        {children}
    </Head>;
}
