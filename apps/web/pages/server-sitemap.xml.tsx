import type { GetServerSideProps } from 'next';
import { getServerSideSitemap } from 'next-sitemap';
import { useApiUrl, useWebUrl } from '#/hooks/useEnv';

function fetcher(path: string): Promise<Record<string, unknown>> {
    return fetch(new URL(path, useApiUrl()).toString(), {
        headers: {
            Authorization: process.env['SITEMAP_TOKEN']!,
        },
    }).then(r => r.json());
}

export const getServerSideProps: GetServerSideProps = async context => {
    const userIds = await fetcher('/sitemap/users');
    const userPages = Array.isArray(userIds['items'])
        ? userIds['items'].map((id: string) => ({
              loc: new URL(`/users/${id}`, useWebUrl()).toString(),
              lastmod: new Date().toISOString(),
              changefreq: 'always' as const,
              priority: 0.6,
          }))
        : [];

    const gameIds = await fetcher('/sitemap/games');
    const gamePages = Array.isArray(gameIds['items'])
        ? gameIds['items'].map((id: string) => ({
              loc: new URL(`/games/${id}`, useWebUrl()).toString(),
              lastmod: new Date().toISOString(),
              changefreq: 'weekly' as const,
              priority: 0.8,
          }))
        : [];

    return getServerSideSitemap(context, [...userPages, ...gamePages]);
};

export default () => null;
