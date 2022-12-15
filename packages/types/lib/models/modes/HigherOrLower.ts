export namespace HigherOrLower {
    /** Higher or lower game data structure. */
    export interface Data {
        /** The verb, for example "costs". */
        verb: string;
        /** The noun, for example "dollars". */
        noun: string;
        /** String that appears before the value. */
        prefix: string;
        /** String that appears after the value. */
        suffix: string;
        /** String used to represent "Higher". */
        higher: string;
        /** String used to represent "Lower". */
        lower: string;
    }

    /** Higher or lower game item data structure. */
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
        imageFrame?: 'fit' | 'fill';
    }

    /** Higher or lower. */
    export type Step = 1 | -1;
}
