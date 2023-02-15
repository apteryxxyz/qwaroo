import { URL } from 'node:url';
import { ServerError as Error } from '@qwaroo/common';
import type { APISubmitScoreOptions } from '@qwaroo/types';
import { shuffle } from 'shuffle-seed';
import { getEnv } from '#/utilities/getEnv';
import type { Game } from '#/utilities/structures';

const ItemsCache = new Map<`${string}.${string}`, Record<string, unknown>[]>();

export class Items extends null {
    public static async getItemsVersions(game: Game.Document) {
        const data = await this._fetchCdn(`list?items/${game.id}`);
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

    private static async _fetchItems(gameId: string, version: string) {
        const cached = ItemsCache.get(`${gameId}.${version}`);
        if (cached) return cached;

        const _ = `read?items/${gameId}/${version}.json`;
        const data = await this._fetchCdn(_);
        if (typeof data === 'number') {
            if (data === 404) throw new Error(404, 'Game items not found');
            else throw new Error(500, 'Failed to get game items');
        }

        const allItems = JSON.parse(data) as Record<string, unknown>[];
        ItemsCache.set(`${gameId}.${version}`, allItems);
        return allItems;
    }

    private static async _fetchCdn(uri: string | URL) {
        const url = new URL(String(uri), getEnv(String, 'CDN_URL'));
        const headers = new Headers();
        headers.set('Authorisation', getEnv(String, 'INTERNAL_TOKEN'));

        const response = await fetch(url.toString(), { headers });
        if (!response.ok) return response.status;
        return response.text();
    }
}
