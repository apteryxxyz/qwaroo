import { URL } from 'node:url';
import { ServerError as Error } from '@qwaroo/common';
import { Sources } from '@qwaroo/sources';
import type { APISubmitScoreOptions } from '@qwaroo/types';
import { shuffle } from 'shuffle-seed';
import { getEnv } from '#/utilities/getEnv';
import type { Game, User } from '#/utilities/structures';

const ItemsCache = new Map<`${string}.${string}`, Record<string, unknown>[]>();

export class Items extends null {
    public static async getItemsVersions(game: Game.Document) {
        const data = await this._fetchCdn('GET', `list?items/${game.id}`);
        if (typeof data === 'number') {
            if (data === 404)
                throw new Error(404, 'Game items versions not found');
            else throw new Error(500, 'Failed to get game items versions');
        }

        return data
            .split('\n')
            .filter(Boolean)
            .map(version => version.split('.')[0]);
    }

    public static async getItems(
        game: Game.Document,
        options: Omit<APISubmitScoreOptions, 'steps' | 'time'> & {
            seed: string;
            version: string;
            limit: number;
            skip: number;
        }
    ) {
        const limit = Math.max(options.limit ?? 5, 0);
        if (typeof limit !== 'number')
            throw new Error(422, 'Limit must be a number');
        const skip = Math.max(options.skip ?? 0, 0);
        if (typeof skip !== 'number')
            throw new Error(422, 'Skip must be a number');

        const version = String(options.version ?? '').trim();
        if (!version) throw new Error(422, 'Version must be a string');
        const seed = String(options.seed).trim();
        if (!seed) throw new Error(422, 'Seed must be a string');

        const allItems = await this._fetchItems(game.id, version);
        const shuffledItems = shuffle(allItems, seed);
        const total = shuffledItems.length;
        const items = shuffledItems.slice(skip, skip + limit);

        return [{ total, seed, version, limit, skip }, items] as const;
    }

    public static async updateItems(game: Game.Document, user: User.Document) {
        if (game.creatorId !== user.id)
            throw new Error(403, 'You are not the game creator');

        // @ts-expect-error Ignore maps strict keys
        const source = Sources.get(game.sourceSlug!);
        if (!source) throw new Error(400, 'Invalid or missing source');

        const properties = await Promise.resolve(
            source.prepareProperties(game.sourceProperties!)
        ).catch(error => {
            throw new Error(
                400,
                'Invalid or missing source properties',
                error.message
            );
        });

        // @ts-expect-error More stuff idk
        const items = await source.fetchItems(properties).catch(() => {
            throw new Error(
                500,
                'Failed to fetch game items, double check your source properties'
            );
        });

        if (items.length < 100)
            throw new Error(
                400,
                'Fetched games items must have at least 100 items'
            );

        const version = Date.now().toString();
        await Promise.all([
            this._writeItems(
                game.id,
                version,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                items as any
            ),
            game.updateOne({ updatedTimestamp: Date.now() }),
        ]);
        return version;
    }

    private static async _fetchItems(gameId: string, version: string) {
        const cached = ItemsCache.get(`${gameId}.${version}`);
        if (cached) return cached;

        const _ = `read?items/${gameId}/${version}.json`;
        const data = await this._fetchCdn('GET', _);
        if (typeof data === 'number') {
            if (data === 404) throw new Error(404, 'Game items not found');
            else throw new Error(500, 'Failed to get game items');
        }

        const allItems = JSON.parse(data) as Record<string, unknown>[];
        ItemsCache.set(`${gameId}.${version}`, allItems);
        return allItems;
    }

    private static async _writeItems(
        gameId: string,
        version: string,
        items: Record<string, unknown>[]
    ) {
        const _ = `write?items/${gameId}/${version}.json`;
        const data = await this._fetchCdn('POST', _, JSON.stringify(items));
        if (typeof data === 'number')
            throw new Error(500, 'Failed to update game items');

        ItemsCache.set(`${gameId}.${version}`, items);
        return items;
    }

    private static async _fetchCdn(
        method: string,
        uri: string | URL,
        body?: string
    ) {
        const url = new URL(String(uri), getEnv(String, 'CDN_URL'));
        const headers = new Headers();
        headers.set('Authorisation', getEnv(String, 'INTERNAL_TOKEN'));

        const response = await fetch(url.toString(), {
            method,
            headers,
            body,
        });
        if (!response.ok) return response.status;
        return response.text();
    }
}
