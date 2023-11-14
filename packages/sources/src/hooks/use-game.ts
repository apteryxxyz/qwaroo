import { readdir as listDirectory } from 'node:fs/promises';
import { join } from 'node:path';
import type { Game } from '@qwaroo/shared/types';
import { sources } from '@/sources';
import { useJsonFile } from './use-file';

/** Read and write a games meta.json file. */
export function useGame(slug: string) {
  const filePath = join(process.cwd(), 'public', 'games', slug, 'meta.json');
  return useJsonFile<Game>(filePath);
}

/** Read and write a games items.json file. */
export function useGameItems(slug: string) {
  const filePath = join(process.cwd(), 'public', 'games', slug, 'items.json');
  return useJsonFile<Game.Item[]>(filePath, { defaultValue: [] });
}

/** Read and write a games source.json file. */
export function useGameSource(slug: string) {
  const filePath = join(process.cwd(), 'public', 'games', slug, 'source.json');
  type Source = { slug: keyof typeof sources } & Record<string, unknown>;
  return useJsonFile<Source>(filePath);
}

/** Read and write the all.json file. */
export function useGames() {
  const filePath = join(process.cwd(), 'public', 'games', 'all.json');
  return useJsonFile<Game[]>(filePath, { defaultValue: [] });
}

/** Read all games meta.json files and combine into an array. */
export async function combineGameMetas() {
  return listDirectory(join(process.cwd(), 'public', 'games')) //
    .then((items) =>
      Promise.all(
        items
          .filter((i) => !i.endsWith('.json'))
          .map((i) => useGame(i).then(([g]) => g)),
      ),
    );
}
