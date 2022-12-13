import type { HigherOrLower } from './modes/HigherOrLower';

export * from './modes/HigherOrLower';

export interface Game<T extends Game.Type = Game.Type> {
    // Identifers
    /** The unique identifier for this game. */
    id: string;
    /** Short slug, intended to be easier to type. */
    slug: string;

    // Creator
    /** ID of the user that created this game. */
    creatorId: string;

    // Updater
    /** ID of the source generatoer/updater to use. */
    sourceId?: string;
    /** Options to pass to the generator. */
    sourceOptions?: Record<string, unknown>;

    // Information
    /** What type of game this is. */
    type: T;
    /** A title for this game. */
    title: string;
    /** A short description for this game. */
    shortDescription: string;
    /** A long description for this game. */
    longDescription: string;
    /** URL to an image. */
    thumbnailUrl: string;
    /** The categories this game would belong to. */
    categories: string[];
    /** Data for the game, such as strings. */
    data: Game.Data<T>;

    // Timestamps
    /** When this game was created. */
    createdTimestamp: number;
    /** When this game was last updated. */
    updatedTimestamp: number;
}

export namespace Game {
    export enum Type {
        HigherOrLower = 1,
    }

    export type Data<T extends Type = Type> = T extends Type.HigherOrLower
        ? HigherOrLower.Data
        : Record<string, unknown>;

    export type Item<T extends Type = Type> = T extends Type.HigherOrLower
        ? HigherOrLower.Item
        : Record<string, unknown>;

    export type Save<T extends Type = Type> = T extends Type.HigherOrLower
        ? HigherOrLower.Save
        : Record<string, unknown>;
}
