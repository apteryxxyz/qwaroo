'use client';

import { decompress, type Compressed } from '@qwaroo/shared/compress';
import type { Game } from '@qwaroo/shared/types';
import { useMemo } from 'react';
import { GameCard } from '@/components/game-card';

export default function HomeContent(p: {
  compressedGames: Compressed<Game[]>;
}) {
  const games = useMemo(
    () => decompress(p.compressedGames),
    [p.compressedGames],
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Browse Games</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {games.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </div>
    </div>
  );
}
