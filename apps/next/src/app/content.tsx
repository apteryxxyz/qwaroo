'use client';

import { Compressed, decompress } from '@qwaroo/shared/compress';
import type { Game } from '@qwaroo/shared/types';
import { useMemo } from 'react';
import { GameCard } from '@/components/game-card';

export default function Content(p: { compressedGames: Compressed<Game[]> }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const games = useMemo(() => decompress(p.compressedGames), []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {games.map((game) => (
        <GameCard key={game.slug} game={game} />
      ))}
    </div>
  );
}
