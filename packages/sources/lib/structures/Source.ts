import { Slug } from '@qwaroo/common';
import type { Game } from '@qwaroo/types';
import { prepareProperities } from '#/validators/prepareProperities';

export abstract class Source<
    M extends Game.Mode = Game.Mode,
    K extends string = string,
    P extends {} = Record<K, unknown>
> {
    public readonly mode: M;
    public readonly name: string;
    public readonly slug: string;
    public readonly description: string;
    public readonly iconUrl: string;
    public readonly isPublic: boolean;
    public readonly properties: Record<keyof P, Source.Prop>;

    public constructor(options: Source.Options<M, K, P>) {
        this.mode = options.mode;
        this.name = options.name;
        this.slug = Slug.create(this.name);
        this.description = options.description;
        this.iconUrl = options.iconUrl;
        this.isPublic = options.isPublic;
        this.properties = options.properties;
    }

    public prepareProperties(properties: Partial<P>) {
        return prepareProperities(this.properties, properties);
    }

    public abstract fetchItems(properties: P): Promise<Game.Item<M>[]>;
}

export namespace Source {
    export interface Options<
        M extends Game.Mode = Game.Mode,
        K extends string = string,
        P extends {} = Record<K, unknown>
    > {
        mode: M;
        name: string;
        description: string;
        iconUrl: string;
        isPublic: boolean;
        properties: Record<keyof P, Prop>;
    }

    export interface Prop<T extends Prop.Type = Prop.Type> {
        type: T | [T];
        name: string;
        description: string;

        required?: boolean;
        default?: unknown;
        options?: { label: string; value: unknown }[];
        validate?: RegExp;
    }

    export namespace Prop {
        export enum Type {
            String = 'string',
            Number = 'number',
            Boolean = 'boolean',
        }
    }
}
