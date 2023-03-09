import type { Database } from '@qwaroo/database';
import type { GameManager } from '#/managers/GameManager';

declare module 'maclary' {
    export interface Container {
        database: Database;
        games: GameManager;
    }
}
