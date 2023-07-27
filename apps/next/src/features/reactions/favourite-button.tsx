'use client';

import type { Activity, Game } from '@qwaroo/database';
import { useCallback, useEffect, useState } from 'react';
import { HeartIcon } from 'lucide-react';
import { Button } from '@/components/button';
import { Tooltip } from '@/components/tooltip';
import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/services/trpc';

interface FavouriteButtonProps {
  game: Game.Entity<'creator'>;
  activity: Activity.Entity | null;
}

export function FavouriteButton(p: FavouriteButtonProps) {
  const [hasFavourited, setHasFavourited] = //
    useState(p.activity?.reaction.favourited);
  const [favouriteCount, setFavouriteCount] = //
    useState(p.game.engagement.favouriteCount);

  const chooseFavourite = trpc.reactions.chooseFavourite.useMutation();

  const { toast } = useToast();
  const mustBeLoggedIn = useCallback(() => {
    toast({
      variant: 'destructive',
      title: 'You cannot favourite this game yet!',
      description:
        'You must be both logged in and have played this game at least once.',
    });
  }, [toast]);

  useEffect(() => {
    if (p.activity) p.activity.reaction.favourited = hasFavourited ?? false;
    p.game.engagement.favouriteCount = favouriteCount;
  }, [favouriteCount, hasFavourited, p.activity, p.game.engagement]);

  return (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <Button
          className="inline-flex"
          onClick={() => {
            if (!p.activity) return mustBeLoggedIn();
            if (chooseFavourite.isLoading) return;

            setHasFavourited((c) => !c);
            setFavouriteCount((c) => c + (hasFavourited ? -1 : 1));
            void chooseFavourite.mutateAsync({
              gameId: p.game.id,
              favourited: !hasFavourited,
            });
          }}
        >
          <HeartIcon
            className="mr-1 h-5 w-5"
            color={hasFavourited ? 'red' : 'currentColor'}
          />
          <span className="min-w-[10px]">{favouriteCount}</span>
        </Button>
      </Tooltip.Trigger>

      <Tooltip.Content>This is one of my favourites</Tooltip.Content>
    </Tooltip>
  );
}
