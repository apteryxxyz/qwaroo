'use client';

import type { Game } from '@qwaroo/shared/types';
import ms from 'enhanced-ms';
import Link from 'next/link';
import { useMemo } from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { StatisticsState } from '@/hooks/use-statistics';
import { findAward } from '@/utilities/awards';
import { proxifyImageUrl } from '@/utilities/url';
import { AwardImage } from './award-image';

export function HighScoreCard(p: { game: Game; statistics: StatisticsState }) {
  const earnedAward = findAward(p.statistics.highScore);

  const formattedPlayCount = useMemo(() => {
    switch (p.statistics.playCount) {
      case 1:
        return 'once';
      case 2:
        return 'twice';
      default:
        return `${p.statistics.playCount} times`;
    }
  }, [p.statistics.playCount]);
  const formattedTimePlayed = useMemo(
    () => ms(p.statistics.timePlayedInMs, { shortFormat: true })!,
    [p.statistics.timePlayedInMs],
  );

  return (
    <Card className="flex relative">
      <picture>
        <img
          src={proxifyImageUrl(p.game.image).toString()}
          alt={p.game.title}
          className="hidden md:block w-32 h-32 object-cover rounded-l-md"
        />
      </picture>

      <CardHeader className="justify-center h-full">
        <CardTitle>
          {p.game.title}{' '}
          <AwardImage award={earnedAward} className="inline w-4" />
        </CardTitle>
        <CardTitle>Highscore of {p.statistics.highScore}</CardTitle>
        <CardDescription>
          You played {formattedPlayCount} over {formattedTimePlayed}, your total
          score is {p.statistics.totalScore}.
        </CardDescription>
      </CardHeader>

      <Link
        href={`/games/${p.game.slug}`}
        className="absolute inset-0"
        prefetch={false}
      >
        <span className="sr-only">Play {p.game.title}</span>
      </Link>
    </Card>
  );
}
