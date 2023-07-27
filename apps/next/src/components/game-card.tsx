'use client';

import type { Game } from '@qwaroo/database';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface GameCardProps {
  game: Game.Entity<'creator'>;
}

export function GameCard(p: GameCardProps) {
  const { likeCount, dislikeCount } = p.game.engagement;
  const likePercentage = (likeCount / (dislikeCount + likeCount)) * 100;

  return (
    <Link href={`/games/${p.game.id}`} className="h-full">
      <Card className="grid h-full grid-cols-4">
        <Image
          src={p.game.thumbnailUrl}
          className="aspect-square h-full rounded-l-md border-r-2 object-cover"
          width={1_000}
          height={1_000}
          alt="image"
        />

        <div className="col-span-3 flex flex-col justify-center gap-2">
          <Card.Header className="text-sm">
            <Card.Title>{p.game.title}</Card.Title>
            <span>Created by {p.game.creator.displayName}</span>

            <div className="space-x-2">
              <Badge>{p.game.category}</Badge>
              <Badge>{p.game.score.totalPlays} Plays</Badge>
              {!Number.isNaN(likePercentage) && (
                <Badge>Liked {Math.round(likePercentage)}%</Badge>
              )}
            </div>

            <p>{p.game.shortDescription}</p>
          </Card.Header>
        </div>
      </Card>
    </Link>
  );
}

export function SkeletonGameCard() {
  return (
    <Card className="grid h-full grid-cols-4">
      <Skeleton className="h-full rounded-l-md border-r-2 object-cover" />

      <div className="col-span-3 flex flex-col justify-center gap-2">
        <Card.Header>
          <Skeleton className="h-5" />

          <Skeleton className="h-3 w-[70%]" />

          <div className="flex space-x-2">
            <Skeleton className="h-4 w-[30%]" />
            <Skeleton className="h-4 w-[30%]" />
          </div>

          <Skeleton className="h-3" />
          <Skeleton className="h-3 w-[70%]" />
        </Card.Header>
      </div>
    </Card>
  );
}
