import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Game } from '@owenii/types';
import { useLogger } from '#/hooks/useLogger';
import type { Logger } from '#/hooks/useLogger';

export abstract class Generator<T extends Game.Type> {
    public slug: string;
    public meta: Game.Meta<T> | null = null;
    public items: Game.Item<T>[] | null = null;
    public readonly logger: Logger;

    public constructor(slug: string) {
        this.slug = slug;
        this.logger = useLogger(`[${slug}]`);
    }

    public gameDirectory(basePath: string) {
        const path = resolve(basePath, this.slug);
        void mkdirSync(path, { recursive: true });
        return path;
    }

    public async getMeta(
        basePath: string,
        forceFetch = false,
        debugLog = false
    ): Promise<Game.Meta<T>> {
        const gameDir = this.gameDirectory(basePath);
        const metaPath = resolve(gameDir, 'meta.json');
        if (debugLog) this.logger.info('Fetching meta...');

        if (!forceFetch && existsSync(metaPath)) {
            if (debugLog) this.logger.info('Meta found in cache!');
            return require(metaPath);
        }

        const data = await this.fetchMeta(debugLog);
        if (debugLog) this.logger.info('Meta fetched!');
        return data;
    }

    public async getItems(
        basePath: string,
        forceFetch = false,
        debugLog = false
    ): Promise<Game.Item<T>[]> {
        const gameDir = this.gameDirectory(basePath);
        const itemsPath = resolve(gameDir, 'items.json');
        if (debugLog) this.logger.info('Fetching items...');

        if (!forceFetch && existsSync(itemsPath)) {
            if (debugLog) this.logger.info('Items found in cache!');
            return require(itemsPath);
        }

        const data = await this.fetchItems(debugLog);
        if (debugLog) this.logger.info('Items fetched!');
        return data;
    }

    public abstract fetchMeta(debugLog?: boolean): Promise<Game.Meta<T>>;
    public abstract fetchItems(debugLog?: boolean): Promise<Game.Item<T>[]>;

    public async fetch(basePath: string, forceFetch = false, debugLog = false) {
        this.meta = await this.getMeta(basePath, forceFetch, debugLog);
        this.items = await this.getItems(basePath, forceFetch, debugLog);
    }

    public async save(basePath: string) {
        const gameDir = this.gameDirectory(basePath);
        writeFileSync(
            resolve(gameDir, 'meta.json'),
            JSON.stringify(this.meta, null, 4)
        );
        writeFileSync(
            resolve(gameDir, 'items.json'),
            JSON.stringify(this.items, null, 4)
        );
    }
}
