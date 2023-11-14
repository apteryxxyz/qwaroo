import { compress } from '@qwaroo/shared/compress';
import { useGame, useGameItems, useGames } from '@qwaroo/sources';
import type { Metadata } from 'next/types';
import { HigherOrLower } from '@/components/higher-or-lower';
import type { PageProps } from '@/types';
import { absoluteUrl } from '@/utilities/url';

export async function generateStaticParams() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [games] = await useGames();
  return games.map(({ slug }) => ({ slug }));
}

export async function generateMetadata(
  p: PageProps<['slug']>,
): Promise<Metadata> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [game] = await useGame(p.params.slug);
  return {
    title: game.title,
    description: game.seo.description ?? game.description,
    keywords: game.seo.keywords ?? game.tags,

    openGraph: {
      type: 'website',
      title: game.seo.title ?? game.title,
      description: game.seo.description ?? game.description,
      url: absoluteUrl(`/games/${game.slug}`),
    },

    twitter: {
      card: 'summary',
      title: game.seo.title ?? game.title,
      description: game.seo.description ?? game.description,
      creator: '@apteryxxyz',
    },
  };
}

export default async function Page(p: PageProps<['slug']>) {
  const [game] = await useGame(p.params.slug);
  const [items] = await useGameItems(p.params.slug);

  switch (game.mode) {
    case 'higher-or-lower':
      return (
        <HigherOrLower
          compressedGame={compress(game)}
          compressedItems={compress(items)}
        />
      );
    default:
      throw new Error('Missing page component for game type');
  }
}
