'use client';

import type { Activity, Game } from '@qwaroo/database';
import Link from 'next/link';
import { CircleSlashIcon, PlayIcon, Tally5Icon } from 'lucide-react';
import { Alert } from '@/components/alert';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { GameCard } from '@/features/game-card';
import { GameScoreCard } from '@/features/game-score-card';
import { FavouriteButton } from '@/features/reactions/favourite-button';
import { RatingButtonRow } from '@/features/reactions/rating-button-row';

interface ContentProps {
  game: Game.Entity<'creator'>;
  similarGames: Game.Entity<'creator'>[];
  userActivity: Activity.Entity | null;
  gameActivities: Activity.Entity<'user'>[];
}

export function Content(p: ContentProps) {
  const highestScoringActivities = p.gameActivities
    // Activities are already sorted by score
    .slice(0, 3)
    .filter((activity) => activity.score?.highScore ?? 0 > 0);
  const restOfActivities = p.gameActivities.slice(
    highestScoringActivities.length,
  );

  return (
    <>
      <h1 className="pb-6 text-2xl font-bold leading-none tracking-tight">
        {p.game.title}
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-1 h-fit space-y-6 lg:col-span-2">
          <Card>
            <Card.Header>
              <p>{p.game.longDescription}</p>
            </Card.Header>

            <Card.Footer className="flex-wrap justify-end gap-2">
              <RatingButtonRow game={p.game} activity={p.userActivity} />

              <FavouriteButton game={p.game} activity={p.userActivity} />

              <Link href={`/games/${p.game.id}/play`}>
                <Button>
                  <PlayIcon className="mr-1 h-5 w-5" />
                  Play
                </Button>
              </Link>
            </Card.Footer>
          </Card>

          <section className="space-y-6">
            <h2 className="text-lg font-bold leading-none tracking-tight">
              Highest Scores
            </h2>

            {p.gameActivities.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {highestScoringActivities.map((activity, index) => (
                    <GameScoreCard
                      key={activity.id}
                      place={index + 1}
                      user={activity.user}
                      score={activity.score}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {restOfActivities.map((activity) => (
                    <GameScoreCard
                      key={activity.id}
                      user={activity.user}
                      score={activity.score}
                    />
                  ))}
                </div>
              </>
            )}

            {p.gameActivities.length === 0 && (
              <Alert>
                <Tally5Icon className="h-5 w-5" />

                <Alert.Title>No scores yet</Alert.Title>
                <Alert.Description>
                  But you could change that by being the first to play!
                </Alert.Description>
              </Alert>
            )}
          </section>
        </div>

        <section className="col-span-1">
          <h2 className="pb-6 text-lg font-bold leading-none tracking-tight">
            You Might Like
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
            {p.similarGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          {p.similarGames.length === 0 && (
            <Alert>
              <CircleSlashIcon className="h-5 w-5" />

              <Alert.Title>No similar games</Alert.Title>
              <Alert.Description>
                But you could change that by creating more games!
              </Alert.Description>
            </Alert>
          )}
        </section>
      </div>
    </>
  );
}
