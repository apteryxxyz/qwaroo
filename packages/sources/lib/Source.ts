import { createSlug } from '@qwaroo/common';
import type { Game } from '@qwaroo/types';

/** The strcuture for a data source. */
export interface Source<
    K extends string | number | symbol,
    O extends {} = Record<K, unknown>,
    F extends Game.Mode = Game.Mode
> {
    /** The type of game mode this is for. */
    for: F;
    /** The unique slug identifier for this source. */
    slug: string;
    /** A name for this source/ */
    name: string;
    /** A short description of this source. */
    description: string;
    /** Whether or not this source can be used publicly. */
    isPublic: boolean;

    /** The properties required to fetch items from this source. */
    props: Record<K, Source.Prop>;

    /** Prepare the options for fetching, such as filling defaults. */
    prepareOptions(options: Partial<O>): O;
    /** Fetch the items based on passed options. */
    fetchItems(options: O, verbose: boolean): Promise<Game.Item<F>[]>;
}

export namespace Source {
    export interface Prop<T extends Prop.Type = Prop.Type> {
        type: T | [T];
        name: string;
        description: string;

        prefix?: string;
        suffix?: string;

        required?: ((this: Record<string, unknown>) => boolean) | boolean;
        default?: unknown;
        options?: { label: string; value: unknown }[];
        validate?:
            | ((this: Record<string, unknown>, value: unknown) => boolean)
            | RegExp;
    }

    export namespace Prop {
        export enum Type {
            String = 'string',
            Number = 'number',
            Boolean = 'boolean',
        }
    }

    export function meta(name: string, description: string, isPublic = false) {
        return {
            // NOTE: Do not change name or slug else everything will break
            name,
            description: description.replaceAll(/\s+/g, ' '),
            slug: createSlug(name),
            isPublic,
        };
    }
}
