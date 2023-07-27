'use client';

import type { Activity, Game } from '@qwaroo/database';
import { useCallback, useEffect, useState } from 'react';
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/services/trpc';

interface RatingButtonRowProps {
  game: Game.Entity<'creator'>;
  activity: Activity.Entity | null;
}

export function RatingButtonRow(p: RatingButtonRowProps) {
  const [currentRating, setCurrentRating] = //
    useState(p.activity?.reaction.rating);
  const [likeCount, setLikeCount] = useState(p.game.engagement.likeCount);
  const [dislikeCount, setDislikeCount] = //
    useState(p.game.engagement.dislikeCount);

  const chooseRating = trpc.reactions.chooseRating.useMutation();

  const { toast } = useToast();
  const mustBeLoggedIn = useCallback(() => {
    toast({
      variant: 'destructive',
      title: 'You cannot rate this game yet!',
      description:
        'You must be both logged in and have played this game at least once.',
    });
  }, [toast]);

  useEffect(() => {
    if (p.activity) p.activity.reaction.rating = currentRating ?? 0;
    p.game.engagement.likeCount = likeCount;
    p.game.engagement.dislikeCount = dislikeCount;
  }, [currentRating, likeCount, dislikeCount, p.activity, p.game.engagement]);

  return (
    <div className="inline-flex">
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button
            className="rounded-r-none"
            onClick={() => {
              if (!p.activity) return mustBeLoggedIn();
              if (chooseRating.isLoading) return;

              if (currentRating === 1) {
                setCurrentRating(0);
                setLikeCount((c) => c - 1);
                void chooseRating.mutateAsync({
                  gameId: p.game.id,
                  direction: 0,
                });
              } else {
                setCurrentRating(1);
                setLikeCount((c) => c + 1);
                if (currentRating === -1) setDislikeCount((c) => c - 1);
                void chooseRating.mutateAsync({
                  gameId: p.game.id,
                  direction: 1,
                });
              }
            }}
          >
            <ThumbsUpIcon
              className="mr-1 h-5 w-5"
              color={currentRating === 1 ? 'blue' : 'currentColor'}
            />
            <span className="min-w-[10px]">{likeCount}</span>
          </Button>
        </Tooltip.Trigger>

        <Tooltip.Content>I like this</Tooltip.Content>
      </Tooltip>

      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button
            className="rounded-l-none"
            onClick={() => {
              if (!p.activity) return mustBeLoggedIn();
              if (chooseRating.isLoading) return;

              if (currentRating === -1) {
                setCurrentRating(0);
                setDislikeCount((c) => c - 1);
                void chooseRating.mutateAsync({
                  gameId: p.game.id,
                  direction: 0,
                });
              } else {
                setCurrentRating(-1);
                setDislikeCount((c) => c + 1);
                if (currentRating === 1) setLikeCount((c) => c - 1);
                void chooseRating.mutateAsync({
                  gameId: p.game.id,
                  direction: -1,
                });
              }
            }}
          >
            <ThumbsDownIcon
              className="mr-1 h-5 w-5"
              color={currentRating === -1 ? 'blue' : 'currentColor'}
            />
            <span className="min-w-[10px]">{dislikeCount}</span>
          </Button>
        </Tooltip.Trigger>

        <Tooltip.Content>I dislike this</Tooltip.Content>
      </Tooltip>
    </div>
  );
}
