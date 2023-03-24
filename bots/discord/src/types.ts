import type { Poster } from '@maclary/lists';
import type { Database } from '@qwaroo/database';
import type { GameManager } from '#/classes/GameManager';

declare module 'maclary' {
    export interface Container {
        database: Database;
        games: GameManager;
        poster: Poster;
    }
}
