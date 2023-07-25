import { appRouter } from '@qwaroo/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CircleSlashIcon, Tally5Icon } from 'lucide-react';
import { Alert } from '@/components/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';
// import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { GameCard } from '@/features/game-card';
import { GameScoreCard } from '@/features/game-score-card';
import type { PageProps } from '@/types';

export default async function Page(p: PageProps<'id'>) {
  const id = p.params.id;
  const caller = appRouter.createCaller({});
  const game = await caller.games.getGame(id).catch(() => notFound());
  const recommended = await caller.games.getSimilarGames(id);

  const scores = await caller.scores.getGameScores(id);
  const highestScores = scores
    .slice(0, 3)
    .filter((score) => score.highScore ?? 0 > 0);
  const restOfScores = scores.slice(highestScores.length);

  return (
    <>
      <h1 className="pb-6 text-2xl font-bold leading-none tracking-tight">
        {game.title}
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-1 h-fit space-y-6 lg:col-span-2">
          <Card>
            <Card.Header className="flex-row">
              <div className="row flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={game.thumbnailUrl} />
                  <AvatarFallback>{game.title.slice(0, 2)}</AvatarFallback>
                </Avatar>

                <div>
                  <Card.Title>{game.title}</Card.Title>
                  <Card.Description>
                    Created by {game.creator.displayName}
                  </Card.Description>
                </div>
              </div>

              <div className="ml-auto">
                <Link href={`/games/${game.id}/play`}>
                  <Button>Play</Button>
                </Link>
              </div>
            </Card.Header>

            <Card.Content>
              <p>{game.longDescription}</p>

              {/* // TODO: Find a better spot for these */}
              {/* <div className="flex flex-wrap gap-2">
              <Badge>{game.category}</Badge>
              <Badge>{game.totalPlays} Plays</Badge>
            </div> */}
            </Card.Content>
          </Card>

          <section className="space-y-6">
            <h2 className="text-lg font-bold leading-none tracking-tight">
              Highest Scores
            </h2>

            {scores.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {highestScores.map((score, index) => (
                    <GameScoreCard
                      key={score.id}
                      place={index + 1}
                      score={score}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {restOfScores.map((score) => (
                    <GameScoreCard key={score.id} score={score} />
                  ))}
                </div>
              </>
            )}

            {
              <Alert>
                <Tally5Icon className="h-5 w-5" />

                <Alert.Title>No scores yet</Alert.Title>
                <Alert.Description>
                  But you could change that by being the first to play!
                </Alert.Description>
              </Alert>
            }
          </section>
        </div>

        <section className="col-span-1">
          <h2 className="pb-6 text-lg font-bold leading-none tracking-tight">
            You Might Like
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
            {recommended.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          {
            <Alert>
              <CircleSlashIcon className="h-5 w-5" />

              <Alert.Title>No similar games</Alert.Title>
              <Alert.Description>
                But you could change that by playing and creating more games!
              </Alert.Description>
            </Alert>
          }
        </section>
      </div>
    </>
  );
}
