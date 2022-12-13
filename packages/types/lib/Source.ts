import type { Game } from './Game';

export interface Source<
    K extends string | number | symbol,
    O extends {} = Record<K, unknown>,
    F extends Game.Type = Game.Type
> {
    for: F;
    slug: string;
    name: string;
    description: string;
    props: Record<K, Source.Prop>;

    prepareOptions(options: Record<K, unknown>): O;
    fetchItems(options: O): Promise<Game.Item<F>[]>;
}

export namespace Source {
    export interface Prop<T extends Prop.Type = Prop.Type> {
        type: T;
        description: string;
        required: boolean;
        default?: T extends Prop.Type.String | Prop.Type.URL
            ? string
            : T extends Prop.Type.Number
            ? number
            : T extends Prop.Type.Boolean
            ? boolean
            : never;
    }

    export namespace Prop {
        export enum Type {
            URL,
            String,
            Number,
            Boolean,
        }
    }
}
