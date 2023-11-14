import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { useGames } from '@qwaroo/sources';
import type { MetadataRoute } from 'next/types';
import { absoluteUrl } from '@/utilities/url';

async function getStaticSitemap(): Promise<MetadataRoute.Sitemap> {
  const manifestPath = join(process.cwd(), '.next', 'routes-manifest.json');
  const manifest = await readFile(manifestPath, 'utf8')
    .then((content) => JSON.parse(content) as RoutesManifest)
    .catch(() => ({ staticRoutes: [] }));

  return manifest.staticRoutes
    .filter((route) => !route.page.split('.')[1])
    .map((route) => ({
      url: absoluteUrl(route.page).toString(),
      lastModified: new Date(),
    }));
}

async function getGameSitemap(): Promise<MetadataRoute.Sitemap> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [games] = await useGames();
  return games.map((game) => ({
    url: absoluteUrl(`games/${game.slug}`).toString(),
    lastModified: new Date(),
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [...(await getStaticSitemap()), ...(await getGameSitemap())];
}

interface RoutesManifest {
  staticRoutes: { page: string }[];
}
