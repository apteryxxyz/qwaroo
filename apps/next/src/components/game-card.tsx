import type { Game } from '@qwaroo/shared/types';
import Link from 'next/link';
import { proxifyImageUrl } from '@/utilities/url';
import { Badge } from './ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

export function GameCard(p: { game: Game }) {
  const isNew = p.game.created > Date.now() - 1000 * 60 * 60 * 24 * 7;
  const isUpdated = p.game.updated > Date.now() - 1000 * 60 * 60 * 24 * 7;
  const badge = p.game.badge ?? (isNew ? 'New' : isUpdated ? 'Updated' : null);
  const proxyImageUrl = proxifyImageUrl(p.game.image);

  return (
    <Card
      className="relative h-full w-full aspect-square rounded-md hover:scale-105 duration-200"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.3)),url(${proxyImageUrl.toString()})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/30 flex items-end rounded-md text-white">
        {badge && (
          <Badge className="uppercase absolute top-3 -left-3">{badge}</Badge>
        )}

        <CardHeader className="bg-gradient-to-t from-black/80 via-black/60 to-transparent w-full pt-12 rounded-b-[calc(var(--radius)_-_3px)] p-4">
          <CardTitle>{p.game.title}</CardTitle>
          <CardDescription>{p.game.description}</CardDescription>
        </CardHeader>
      </div>

      <Link
        href={`/games/${p.game.slug}`}
        className="absolute inset-0"
        prefetch={false}
      >
        <span className="sr-only">View Game</span>
      </Link>
    </Card>
  );
}
