'use client';

import { decompress, type Compressed } from '@qwaroo/shared/compress';
import type { Game } from '@qwaroo/shared/types';
import ms from 'enhanced-ms';
import { HighScoreCard } from '@/components/highscore-card';
import { StatisticCard } from '@/components/statistic-card';
import { useAllStatistics } from '@/hooks/use-statistics';
import { findAward } from '@/utilities/awards';

export default function ProfileContent(p: {
  compressedGames: Compressed<Game[]>;
}) {
  const games = decompress(p.compressedGames);
  const statistics = useAllStatistics(games.map(({ slug }) => slug));

  const awardsCount = statistics.list.reduce(
    (acc, item) => (findAward(item.highScore) ? acc + 1 : acc),
    0,
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your Profile</h1>

      <section>
        <h2 className="text-xl font-semibold pb-4">Statistics Summary</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatisticCard
            imageUrl="/images/profile/game-controller.png"
            value={statistics.combined.playCount}
            description="Total Times Played"
          />

          <StatisticCard
            imageUrl="/images/profile/trophy.png"
            value={awardsCount}
            description="Awards Earned"
          />

          <StatisticCard
            imageUrl="/images/profile/business-credit-score.png"
            value={statistics.combined.totalScore}
            description="Total Score"
          />

          <StatisticCard
            imageUrl="/images/profile/score.png"
            value={statistics.combined.averageScore}
            description="Average Score"
          />

          <StatisticCard
            imageUrl="/images/profile/wall-clock.png"
            value={statistics.combined.timePlayedInMs}
            valueFormatter={(value) =>
              ms(Number(value), { shortFormat: true }) ?? '0s'
            }
            description="Total Play Time"
          />

          <StatisticCard
            imageUrl="/images/profile/alarm-clock.png"
            value={statistics.combined.averageTimePlayedInMs}
            valueFormatter={(value) =>
              ms(Number(value), { shortFormat: true }) ?? '0s'
            }
            description="Average Play Time"
          />
        </div>
      </section>

      {statistics.list.filter((item) => item.totalScore > 0).length > 0 && (
        <section>
          <h2 className="text-xl font-semibold pb-4">
            Individual Game Statistics
          </h2>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {statistics.list
              .filter((item) => item.highScore > 0)
              .sort((a, b) => b.highScore - a.highScore)
              .map((item) => (
                <HighScoreCard
                  key={item.slug}
                  game={games.find(({ slug }) => slug === item.slug)!}
                  statistics={item}
                />
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
