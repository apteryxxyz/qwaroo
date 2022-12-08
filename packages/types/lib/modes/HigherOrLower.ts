export namespace HigherOrLower {
    export const version = 0;

    export interface Data {
        /** Text to appear on the left above the item value. */
        aboveValue: string;
        /** Text to appear on the left below the item value. */
        belowValue: string;
        /** Text to appear on the right above the action buttons. */
        aboveActions: string;
        /** Text to appear on the right below the action buttons. */
        belowActions: string;
        /** String for the Lower action button. */
        lower: string;
        /** String for the Higher action button. */
        higher: string;
    }

    export interface Item {
        /** This items display name. */
        display: string;
        /** Extra item information. */
        caption?: string;
        /** The value of this item. */
        value: number;
        /** Item image URL. */
        imageSource?: string;
        /** How to image should fit the page. */
        imageFrame?: ImageFrame;
    }

    export interface Save {
        /** The slug for the game. */
        slug: string;
        /** Unique seed used to shuffle the items. */
        seed: string;
        /** The steps that were made during the game. */
        steps: Decision[];
    }

    export type ImageFrame = 'fit' | 'fill';

    export type Decision = 1 | -1;
}
