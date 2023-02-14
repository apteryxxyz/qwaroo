import type { Base } from './Base';

export namespace Game {
    export interface Entity<M extends Mode = Mode> extends Base.Entity {
        /** Short unique slug, intended to be easier to type. */
        slug: string;
        /** ID of the user that created this game. */
        creatorId: string;

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
        /** Categories this game belongs to. */
        categories: string[];
        /** The flags for this game. */
        flags: number;
        /** Additional data properties. */
        extraData: Extra<M>;

        /** The highest score this game has gotten. */
        highScore: number;
        /** The time it took to get the highest score. */
        highScoreTime: number;
        /** The timestamp when the highest score was achieved. */
        highScorePlayedTimestamp: number;

        /** The total score. */
        totalScore: number;
        /** The total time. */
        totalTime: number;
        /** The total number of plays. */
        totalPlays: number;

        /** The score this game had. */
        lastScore: number;
        /** The time the last game took. */
        lastTime: number;
        /** The timestamp when this game was last played. */
        lastPlayedTimestamp: number;

        /** When this game was created. */
        createdTimestamp: number;
        /** When this game was last updated. */
        updatedTimestamp: number;
    }

    export enum Mode {
        HigherOrLower = 'higher-or-lower',
    }

    export const ModeNames: Record<Mode, string> = {
        [Mode.HigherOrLower]: 'Higher or Lower',
    };

    export enum Flags {
        None = 0,
        Public = 1 << 0,
    }

    export type Extra<M extends Mode = Mode> = M extends Mode.HigherOrLower
        ? HigherOrLower.Extra
        : never;

    export type Item<M extends Mode = Mode> = M extends Mode.HigherOrLower
        ? HigherOrLower.Item
        : never;

    export type Step<M extends Mode = Mode> = M extends Mode.HigherOrLower
        ? HigherOrLower.Step
        : never;

    export namespace HigherOrLower {
        export interface Extra {
            valueVerb: string;
            valueNoun: string;
            valuePrefix: string;
            valueSuffix: string;
            higherText: string;
            lowerText: string;
        }

        export interface Item {
            display: string;
            value: number;
            imageSource: string;
            imageFrame: 'fit' | 'fill';
            caption?: string;
        }

        export type Step = 1 | -1;
    }
}
