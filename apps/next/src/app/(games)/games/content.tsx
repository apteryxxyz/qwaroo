'use client';

import type { Game } from '@qwaroo/database';
import { useCallback, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon, SearchIcon, SearchXIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert } from '@/components/alert';
import { Button } from '@/components/button';
import { Form } from '@/components/form';
import { Input } from '@/components/input';
import { GameCard, SkeletonGameCard } from '@/features/game-card';
import { trpc } from '@/services/trpc';

interface ContentProps {
  total: number;
  games: Game.Entity<'creator'>[];
}

const searchValidator = z.object({ search: z.string().optional() });

export default function Content(p: ContentProps) {
  const context = trpc.useContext();
  const [isSearching, setSearching] = useState(false);
  const [total, setTotal] = useState(p.total);
  const [games, setGames] = useState(p.games);

  const searchForm = useForm<z.infer<typeof searchValidator>>({
    resolver: zodResolver(searchValidator),
    defaultValues: { search: '' },
  });

  const fetchMore = useCallback(
    async (isInitial = false) => {
      if (isSearching) return;

      if (isInitial && games.length > 0) setGames([]);
      const gameCount = isInitial ? 0 : games.length;
      if (!isInitial && gameCount >= total) return;

      setSearching(true);
      const data = await context.games.getGames.fetch(searchForm.getValues());

      setTotal(data.total);
      setGames((prev) => {
        if (isInitial) return data.games;
        else return [...prev, ...data.games];
      });
      setSearching(false);
    },
    [isSearching, games.length, total, context.games.getGames, searchForm],
  );

  return (
    <>
      <h1 className="pb-6 text-2xl font-bold leading-none tracking-tight">
        Games
      </h1>

      <Form {...searchForm}>
        <form
          onSubmit={searchForm.handleSubmit(() => fetchMore(true))}
          className="flex space-x-6 pb-6"
        >
          <Form.Field
            control={searchForm.control}
            name="search"
            render={({ field }) => (
              <Form.Item>
                <div className="inline-flex flex-grow space-x-6">
                  <Form.Control>
                    <Input placeholder="Search games..." {...field} />
                  </Form.Control>
                  <Button type="submit" disabled={isSearching}>
                    {isSearching ? (
                      <Loader2Icon className="mr-1 h-4 w-4 animate-spin" />
                    ) : (
                      <SearchIcon className="mr-1 h-4 w-4" />
                    )}
                    Search
                  </Button>
                </div>
                <Form.Message />
              </Form.Item>
            )}
          />
        </form>
      </Form>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}

        {isSearching &&
          Array.from({ length: 6 }).map((_, i) => <SkeletonGameCard key={i} />)}
      </div>

      {!isSearching && total === 0 && (
        <Alert>
          <SearchXIcon className="h-4 w-4" />

          <Alert.Title>Hmm, no games were found</Alert.Title>
          <Alert.Description>
            Check back later, or try a different search query.
          </Alert.Description>
        </Alert>
      )}

      {games.length < total && (
        <div className="flex justify-center py-6">
          <Button onClick={() => fetchMore()} disabled={isSearching}>
            {isSearching && (
              <Loader2Icon className="mr-1 h-4 w-4 animate-spin" />
            )}
            Load More
          </Button>
        </div>
      )}
    </>
  );
}
