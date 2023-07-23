import { appRouter } from '@qwaroo/server';
import type { Metadata } from 'next';
import type { LayoutProps, PageProps } from '@/types';

export async function generateMetadata(p: PageProps<'id'>) {
  const id = p.params.id;
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

export default function Layout(p: LayoutProps) {
  return p.children;
}
