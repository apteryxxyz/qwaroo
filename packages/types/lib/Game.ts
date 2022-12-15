import type { HigherOrLower } from './modes/HigherOrLower';

export * from './modes/HigherOrLower';

export interface Game<T extends Game.Type = Game.Type> {
    /** The unique identifier for this game. */
    id: string;
    /** Short unique slug, intended to be easier to type. */
    slug: string;

    /** ID of the user that created this game. */
    creatorId: string;

    /** ID of the source generator/updater to use. */
    sourceSlug?: string;
    /** Options to pass to the generator. */
    sourceOptions?: Record<string, unknown>;

    /** What type of game this is. */
    type: T;
    /** A title for this game. */
    title: string;
    /** A short description for this game. */
    shortDescription: string;
    /** A long description for this game. */
    longDescription: string;
    /** URL to a thumbnail image. */
    thumbnailUrl: string;
    /** The categories this game would belong to. */
    categories: string[];
    /** Data for the game, such as strings. */
    data: Game.Data<T>;

    /** When this game was created. */
    createdTimestamp: number;
    /** When this game was last updated. */
    updatedTimestamp: number;
}

export namespace Game {
    /** Game type identifier. */
    export enum Type {
        HigherOrLower = 'higher-or-lower',
    }

    /** Game data structure. */
    export type Data<T extends Type = Type> = T extends Type.HigherOrLower
        ? HigherOrLower.Data
        : Record<string, unknown>;

    /** Game item data structure. */
    export type Item<T extends Type = Type> = T extends Type.HigherOrLower
        ? HigherOrLower.Item
        : Record<string, unknown>;

    /** Game save data structure. */
    export type Save<T extends Type = Type> = T extends Type.HigherOrLower
        ? HigherOrLower.Save
        : Record<string, unknown>;
}
