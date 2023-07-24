import type { Score } from '@qwaroo/database';
import { Card } from '@/components/card';
import { Skeleton } from '@/components/skeleton';
import { cn } from '@/utilities/styling';

interface GameScoreCardProps {
  place?: number;
  score: Score.Entity<'user'>;
}

export function GameScoreCard(p: GameScoreCardProps) {
  const playCount =
    p.score.totalPlays === 1
      ? 'once'
      : p.score.totalPlays === 2
      ? 'twice'
      : `${p.score.totalPlays} times`;

  return (
    <Card
      className={cn(
        p.place && 'border-2',
        p.place === 1 && 'border-amber-500',
        p.place === 2 && 'border-slate-400',
        p.place === 3 && 'border-amber-800',
      )}
    >
      <Card.Header>
        <Card.Title>
          <span
            className={cn(
              p.place === 1 && 'text-amber-500',
              p.place === 2 && 'text-slate-400',
              p.place === 3 && 'text-amber-800',
            )}
          >
            {p.score.user.displayName}
          </span>{' '}
          scored {(p.score.highScore ?? 0) || 'no'} points
        </Card.Title>

        <Card.Description>
          They played {playCount}, their total score is {p.score.totalScore}.
        </Card.Description>
      </Card.Header>
    </Card>
  );
}

export function SkeletonGameScoreCard() {
  return (
    <Card>
      <Card.Header>
        <Skeleton className="h-5" />

        <div className="flex space-x-2">
          <Skeleton className="h-4 w-[30%]" />
          <Skeleton className="h-4 w-[30%]" />
        </div>
      </Card.Header>
    </Card>
  );
}
