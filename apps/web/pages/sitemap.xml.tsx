import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { GetServerSideProps } from 'next';
import { type ISitemapField, getServerSideSitemap } from 'next-sitemap';
import { useApiUrl, useWebUrl } from '#/hooks/useEnv';

function loadStaticPaths() {
    const manifestPath = join(process.cwd(), '.next', 'build-manifest.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

    return Object.keys(manifest.pages)
        .filter(path => !/^\/(_|\d{3}|.+xml|.+\[.+])/g.test(path))
        .map(page => ({
            loc: new URL(page, useWebUrl()).toString(),
            lastmod: new Date().toISOString(),
            changefreq: 'daily' as const,
            priority: 0.7,
        }));
}

async function loadServerPaths() {
    const sitemapJson = await fetch(
        new URL('/internal/sitemap', useApiUrl()).toString(),
        { headers: { Authorization: String(process.env['INTERNAL_TOKEN']!) } }
    ).then(r => r.json());

    return sitemapJson.items as ISitemapField[];
}

export const getServerSideProps: GetServerSideProps = async context => {
    const staticPaths = loadStaticPaths();
    const serverPaths = await loadServerPaths();

    return getServerSideSitemap(context, [...staticPaths, ...serverPaths]);
};

export default () => null;
