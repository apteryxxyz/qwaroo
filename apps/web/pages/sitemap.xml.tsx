import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { APIRoutes } from '@qwaroo/types';
import type { GetServerSideProps } from 'next';
import { type ISitemapField, getServerSideSitemap } from 'next-sitemap';
import { getApiUrl, getEnv, getWebUrl } from '#/utilities/env';

async function loadStaticPaths() {
    const manifestPath = join(process.cwd(), '.next', 'build-manifest.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

    return Object.keys(manifest.pages)
        .filter(path => !/^\/(_|\d{3}|.+xml|.+\[.+])/g.test(path))
        .map(page => ({
            loc: new URL(page, getWebUrl()).toString(),
            lastmod: new Date().toISOString(),
            changefreq: 'daily' as const,
            priority: 0.7,
        }));
}

async function loadServerPaths() {
    const token = getEnv(String, process.env['INTERNAL_TOKEN']);
    const data = await fetch(
        new URL(APIRoutes.internalSitemap(), getApiUrl()).toString(),
        { headers: { authorisation: token } }
    ).then(res => res.json());

    return (data.items ?? []) as ISitemapField[];
}

export const getServerSideProps: GetServerSideProps = async context => {
    const [staticPaths, serverPaths] = await Promise.all([
        loadStaticPaths(),
        loadServerPaths(),
    ]);

    return getServerSideSitemap(context, [...staticPaths, ...serverPaths]);
};

export default () => null;
