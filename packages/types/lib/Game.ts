import type { HigherOrLower } from './modes/HigherOrLower';

export namespace Game {
    export enum Type {
        HigherOrLower = 1,
    }

    export interface Meta<T extends Type> {
        /** The unique identifier for this game. */
        slug: string;
        /** What type of game this is. */
        type: T;
        /** A title for this game. */
        title: string;
        /** A description for this game. */
        description: string;
        /** URL to an image. */
        imageUrl: string;
        /** The categories this game would belong to. */
        categories: string[];

        /** SEO information for this game. */
        seo: Seo;
        /** Data for the game, such as strings. */
        data: Data<T>;

        /** When this game was created. */
        createdTimestamp: number;
        /** When this game was last updated. */
        updatedTimestamp: number;
    }

    export interface Seo {
        /** The title of the page. */
        title?: string;
        /** The description of the page. */
        description?: string;
        /** The image of the page. */
        banner?: {
            /** The URL to the image. */
            url: string;
            /** The width of the image. */
            width: number;
            /** The height of the image. */
            height: number;
        };
        /** The keywords of the page. */
        keywords?: string[];
    }

    export type Data<T extends Type> = T extends Type.HigherOrLower
        ? HigherOrLower.Data
        : Record<string, unknown>;

    export type Item<T extends Type> = T extends Type.HigherOrLower
        ? HigherOrLower.Item
        : Record<string, unknown>;

    export type Save<T extends Type> = T extends Type.HigherOrLower
        ? HigherOrLower.Save
        : Record<string, unknown>;
}
