import { compress } from '@qwaroo/shared/compress';
import { Game } from '@qwaroo/shared/types';
import { useGame, useGameItems, useGames } from '@qwaroo/sources';
import type { Metadata } from 'next/types';
import { generateMetadata as generateMetadata$ } from '@/app/metadata';
import { HigherOrLower } from '@/components/higher-or-lower';
import { PageProps } from '@/types';
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

  return generateMetadata$({
    title: game.seo.title ?? game.title,
    description: game.seo.description ?? game.description,
    keywords: [...game.tags, ...(game.seo.keywords ?? [])],
    openGraph: { url: absoluteUrl(`/games/${game.slug}`) },
  });
}

export default async function Page(p: PageProps<['slug']>) {
  const [game] = await useGame(p.params.slug);
  const [items] = await useGameItems(p.params.slug);

  switch (game.mode) {
    case Game.Mode.HigherOrLower:
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
