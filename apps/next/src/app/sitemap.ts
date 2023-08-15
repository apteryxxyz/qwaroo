import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Game } from '@qwaroo/database';
import type { MetadataRoute } from 'next/types';
import { allPolicies, allPosts } from 'contentlayer/generated';
import { absoluteUrl } from '@/utilities/url';

async function loadStaticPaths() {
  const manifestPath = join(process.cwd(), '.next', 'routes-manifest.json');
  const manifestContent = await readFile(manifestPath, 'utf8');
  const manifest = JSON.parse(manifestContent) as RoutesManifest;

  return manifest.staticRoutes
    .map((route) => route.page)
    .filter((page) => !page.split('.')[1])
    .map((page) => ({
      url: absoluteUrl(page),
      lastModified: new Date(),
    })) satisfies MetadataRoute.Sitemap;
}

async function loadDynamicPaths() {
  const games = await Game.Model.find({}).exec();

  return [
    ...allPolicies.map((policy) => ({
      url: absoluteUrl(`/policies/${policy.slug}`),
      lastModified: policy.updatedAt,
    })),
    ...allPosts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.publishedAt,
    })),
    ...games.flatMap((game) => [
      {
        url: absoluteUrl(`/games/${game.id}`),
        lastModified: game.updatedAt,
      },
      {
        url: absoluteUrl(`/games/${game.id}/play`),
        lastModified: game.updatedAt,
      },
    ]),
  ] satisfies MetadataRoute.Sitemap;
}

export default async function sitemap() {
  return [
    ...(await loadStaticPaths().catch(() => [])),
    ...(await loadDynamicPaths().catch(() => [])),
  ] satisfies MetadataRoute.Sitemap;
}

export interface RoutesManifest {
  version: number;
  pages404: boolean;
  caseSensitive: boolean;
  basePath: string;
  redirects: {
    source: string;
    destination: string;
    internal: boolean;
    statusCode: number;
    regex: string;
  }[];
  headers: unknown[];
  dynamicRoutes: {
    page: string;
    regex: string;
    routeKeys: Record<string, string>;
    namedRegex: string;
  }[];
  staticRoutes: {
    page: string;
    regex: string;
    routeKeys: Record<string, string>;
    namedRegex: string;
  }[];
  dataRoutes: unknown[];
  rsc: {
    header: string;
    varyHeader: string;
    contentTypeHeader: string;
  };
  rewrites: {
    source: string;
    destination: string;
    regex: string;
  }[];
}
