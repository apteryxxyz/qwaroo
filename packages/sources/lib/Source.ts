import type { Game } from '@owenii/types';

export interface Source<
    K extends string | number | symbol,
    O extends {} = Record<K, unknown>,
    F extends Game.Mode = Game.Mode
> {
    for: F;
    slug: string;
    name: string;
    description: string;
    props: Record<K, Source.Prop>;

    prepareOptions(options: Partial<Record<K, unknown>>): O;
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
