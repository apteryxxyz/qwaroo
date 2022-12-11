import type { Game } from '@owenii/types';

export abstract class Source<
    K extends string | number | symbol,
    O = Record<K, unknown>,
    I = unknown
> {
    public abstract for: Game.Type;
    public abstract slug: string;
    public abstract name: string;
    public abstract description: string;
    public abstract props: Record<K, Source.Prop>;

    public options: O;
    public constructor(options: O) {
        this.options = options;
    }

    public abstract fetchItems(): Promise<I[]>;
}

export namespace Source {
    export interface Prop {
        type: string;
        description: string;
        required: boolean;
        default?: unknown;
    }
}
