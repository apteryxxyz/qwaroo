import type { Game } from '@owenii/types';
import sources from './sources';

/** Fetch all the items for a game, then save them to the local file system. */
export async function fetchAndSaveItems<
    S extends keyof typeof sources = keyof typeof sources
>(
    gameSlug: string,
    sourceSlug: S,
    sourceOptions: Record<keyof typeof sources[S]['props'], unknown>,
    debug = false
) {
    const { existsSync, mkdirSync, writeFileSync } = require('node:fs');
    const { dirname, resolve } = require('node:path');

    const path = resolve('data', `${gameSlug}.json`);
    mkdirSync(dirname(path), { recursive: true });
    if (existsSync(path)) return loadItems(gameSlug);

    const source = sources[sourceSlug];
    if (!source) throw new Error(`Source "${sourceSlug}" not found.`);

    const options = source.prepareOptions(sourceOptions);
    // Bypass type checking
    const fetcher = Reflect.get(source, 'fetchItems') as Function;
    const items = await fetcher.bind(source)(options, debug);

    const data = JSON.stringify(items, null, 4);
    writeFileSync(path, data, 'utf8');
    return loadItems(gameSlug);
}

/** Load the items for a game from the local file system. */
export function loadItems<T extends Game.Mode = Game.Mode>(gameSlug: string) {
    const { existsSync, readFileSync } = require('node:fs');
    const { resolve } = require('node:path');

    const path = resolve('data', `${gameSlug}.json`);
    if (!existsSync(path)) return [];

    const data = readFileSync(path, 'utf8');
    const items = JSON.parse(data);
    return items as Game.Item<T>[];
}
