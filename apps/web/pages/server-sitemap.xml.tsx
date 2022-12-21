import type { GetServerSideProps } from 'next';
import { getServerSideSitemap } from 'next-sitemap';
import { useApiUrl, useWebUrl } from '#/hooks/useEnv';

function fetcher(path: string) {
    return fetch(new URL(path, useApiUrl()).toString(), {
        headers: {
            Authorization: process.env['SITEMAP_TOKEN']!,
        },
    }).then(r => r.json());
}

export const getServerSideProps: GetServerSideProps = async context => {
    const userIds = await fetcher('/sitemap/users');
    const userPages = userIds.items.map((id: string) => ({
        loc: new URL(`/users/${id}`, useWebUrl()).toString(),
        lastmod: new Date().toISOString(),
        changefeq: 'always',
        priority: 0.6,
    }));

    const gameIds = await fetcher('/sitemap/games');
    const gamePages = gameIds.items.map((id: string) => ({
        loc: new URL(`/games/${id}`, useWebUrl()).toString(),
        lastmod: new Date().toISOString(),
        changefeq: 'weekly',
        priority: 0.8,
    }));

    return getServerSideSitemap(context, [...userPages, ...gamePages]);
};

export default () => null;
