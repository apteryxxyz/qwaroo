import { appRouter } from '@qwaroo/server';
import type { Metadata } from 'next';
import type { LayoutProps, PageProps } from '@/types';
import { absoluteUrl } from '@/utilities/url';

export async function generateMetadata(p: PageProps<'id'>) {
  const caller = appRouter.createCaller({});
  const game = await caller.games.getGame(p.params.id).catch(() => null);

  if (!game)
    return {
      title: 'Game not found',
      description: 'Game not found',
    };

  return {
    title: game.title,
    description: game.longDescription,
    authors: {
      name: game.creator.displayName,
      url: `/users/${game.creator.id}`,
    },
    creator: game.creator.displayName,
    category: game.category,

    openGraph: {
      type: 'website',
      title: game.title,
      description: game.longDescription,
      siteName: 'Qwaroo',
      locale: 'en',
      url: absoluteUrl(`/games/${game.id}`),
      images: absoluteUrl(`/games/${game.id}/image.png`),
    },

    twitter: {
      card: 'summary_large_image',
      creator: '@apteryxxyz',
      description: game.longDescription,
      title: game.title,
      images: absoluteUrl(`/games/${game.id}/image.png`),
    },
  } satisfies Metadata;
}

/*
export async function generateMetadata(p: PageProps<'id'>) {
  const caller = appRouter.createCaller({});
  const game = await caller.games.getGame(id).catch(() => null);
  if (!game)
    return {
      title: 'Game not found',
      description: 'Game not found',
    };

  return {
    title: game.title,
    description: game.longDescription,
    authors: {
      name: game.creator.displayName,
      url: `/users/${game.creator.id}`,
    },
    creator: game.creator.displayName,
    category: game.category,
  } satisfies Metadata;
}
*/

export default function Layout(p: LayoutProps) {
  return p.children;
}
