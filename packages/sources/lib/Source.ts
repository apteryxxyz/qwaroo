import type { Game } from '@owenii/types';

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

    /** The properties required to fetch items from this source. */
    props: Record<K, Source.Prop>;

    /** Prepare the options for fetching, such as filling defaults. */
    prepareOptions(options: Partial<Record<K, unknown>>): O;
    /** Fetch the items based on passed options. */
    fetchItems(options: O): Promise<Game.Item<F>[]>;
}

export namespace Source {
    export interface Prop<T extends Prop.Type = Prop.Type> {
        type: T | [T];
        description: string;
        required: boolean;
        default?: unknown;
    }

    export namespace Prop {
        export enum Type {
            String = 'string',
            Number = 'number',
            Boolean = 'boolean',
            URL = 'url',
        }
    }
}
