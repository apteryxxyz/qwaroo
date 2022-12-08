import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Game } from '@owenii/types';
import allGames from './games/index';
import type { Generator } from './generators/Generator';

const GLOBAL_GAMES: Generator<Game.Type>[] = [...allGames];

export class Games {
    public basePath = resolve('data');

    /** Change the base path for the games cache. */
    public setBasePath(basePath: string) {
        this.basePath = resolve(basePath);
        mkdirSync(this.basePath, { recursive: true });
        return this.basePath;
    }

    /** Refernce to the games list. */
    public getGames() {
        return GLOBAL_GAMES;
    }

    /** Fetch the meta and items for the missing games. */
    public fetchGames(forceFetch = false) {
        return Promise.all(
            GLOBAL_GAMES.map(game => game.fetch(this.basePath, forceFetch))
        );
    }

    /** Save the current games in memory to the disk cache. */
    public saveGames() {
        return Promise.all(GLOBAL_GAMES.map(game => game.save(this.basePath)));
    }

    /** Ensure the games in cache exist. */
    public ensureGames() {
        return this.fetchGames().then(() => this.saveGames());
    }
}
