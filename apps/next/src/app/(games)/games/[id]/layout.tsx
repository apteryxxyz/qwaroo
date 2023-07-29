import { appRouter } from '@qwaroo/server';
import type { Metadata } from 'next';
import type { LayoutProps, PageProps } from '@/types';
import { makeImageUrl } from '@/utilities/og';
import { absoluteUrl } from '@/utilities/url';

export async function generateMetadata(p: PageProps<['id']>) {
  const caller = appRouter.createCaller({});
  const game = await caller.games.getGame(p.params.id).catch(() => null);

  if (!game) return { title: 'Game not found' };

  const { likeCount, dislikeCount } = game.engagement;
  const likePercentage = (likeCount / (dislikeCount + likeCount)) * 100;
  const imageUrl = makeImageUrl({
    type: 'game',
    title: game.title,
    description: game.shortDescription,
    creator: game.creator.displayName,
    plays: game.score.totalPlays,
    likes: Number.isFinite(likePercentage) ? likePercentage : undefined,
  });

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
      url: absoluteUrl(`/games/${game.id}`),
      images: [
        {
          url: imageUrl.toString(),
          width: 1200,
          height: 630,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: game.title,
      description: game.longDescription,
      images: [imageUrl.toString()],
    },
  } satisfies Metadata;
}

export default function Layout(p: LayoutProps) {
  return p.children;
}
