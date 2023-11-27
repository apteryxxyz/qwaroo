'use client';

import { decompress, type Compressed } from '@qwaroo/shared/compress';
import type { Game } from '@qwaroo/shared/types';
import { useState } from 'react';
import { GameCard } from '@/components/game-card';
import { Button } from '@/components/ui/button';

export default function HomeContent(p: {
  compressedGames: Compressed<Game[]>;
}) {
  const [games] = useState(decompress(p.compressedGames));
  const categories = games
    .flatMap((g) => g.tags)
    .filter((t, i, a) => a.indexOf(t) === i);
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const toggleCategory = (newCategory: string) =>
    setSelectedCategory(
      newCategory === selectedCategory ? undefined : newCategory,
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Browse Games</h1>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'secondary'}
            className="uppercase"
            onClick={() => toggleCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {games.map(
          (game) =>
            (!selectedCategory || game.tags.includes(selectedCategory)) && (
              <GameCard key={game.slug} game={game} />
            ),
        )}
      </div>
    </div>
  );
}
