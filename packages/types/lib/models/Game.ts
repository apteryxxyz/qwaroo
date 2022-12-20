import type { HigherOrLower } from './modes/HigherOrLower';

/** A game data structure. */
export interface Game<M extends Game.Mode = Game.Mode> {
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

    /** What mode this game is. */
    mode: M;
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
    data: Game.Data<M>;

    /** The total score. */
    totalScore: number;
    /** The total time. */
    totalTime: number;
    /** The total number of plays. */
    totalPlays: number;

    /** When this game was created. */
    createdTimestamp: number;
    /** When this game was last updated. */
    updatedTimestamp: number;
    /** The timestamp when this game was last played. */
    lastPlayedTimestamp: number;
}

export namespace Game {
    export enum Mode {
        HigherOrLower = 'higher-or-lower',
    }

    /** Game data structure. */
    export type Data<M extends Mode = Mode> = M extends Mode.HigherOrLower
        ? HigherOrLower.Data
        : Record<string, unknown>;

    /** Game item data structure. */
    export type Item<M extends Mode = Mode> = M extends Mode.HigherOrLower
        ? HigherOrLower.Item
        : Record<string, unknown>;

    /** Game step data structure. */
    export type Step<M extends Mode = Mode> = M extends Mode.HigherOrLower
        ? HigherOrLower.Step
        : Record<string, unknown>;
}

export * from './modes/HigherOrLower';
