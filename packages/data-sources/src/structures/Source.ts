/* eslint-disable @typescript-eslint/no-explicit-any */

interface SourceOptions {
    name: string;
    description: string;
    iconUrl: string;
    isPublic: boolean;
}

export abstract class Source<O extends Record<string, unknown>>
    implements SourceOptions
{
    public abstract readonly slug: string;
    public abstract readonly name: string;
    public abstract readonly description: string;
    public abstract readonly iconUrl: string;
    public abstract readonly isPublic: boolean;
    public abstract readonly properties: Record<keyof O, Source.Prop>;

    public abstract validateOptions(options: Partial<O>): Promise<string>;
}

export namespace Source {
    export type Entity<S extends Source<any> = Source<any>> = Pick<
        S,
        {
            [K in keyof S]: S[K] extends Function ? never : K;
        }[keyof S]
    >;

    interface BaseProp {
        type: PropType;
        name: string;
        description: string;
        required?: true;
    }

    export interface StringProp extends BaseProp {
        type: PropType.String;
        minimum?: number;
        maximum?: number;
        options?: { label: string; value: string }[];
        default?: string;
    }

    export interface NumberProp extends BaseProp {
        type: PropType.Number;
        minimum?: number;
        maximum?: number;
        options?: { label: string; value: number }[];
        default?: number;
    }

    export interface BooleanProp extends BaseProp {
        type: PropType.Boolean;
        default?: boolean;
    }

    export type Prop = BaseProp & (BooleanProp | NumberProp | StringProp);

    export enum PropType {
        String = 'string',
        Number = 'number',
        Boolean = 'boolean',
    }

    export type RealType<T extends PropType> = T extends 'string'
        ? string
        : T extends 'number'
        ? number
        : boolean;

    export interface Item {
        display: string;
        value: number;
        imageUrl: string;
        imageFrame: 'fill' | 'fit';
        caption?: string;
    }
}
