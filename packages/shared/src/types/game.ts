export namespace Game {
  export enum Mode {
    HigherOrLower = 'higher-or-lower',
  }

  interface Base {
    /** The slug/unique identifer for the game, used in URL */
    slug: string;
    /** The title of the game */
    title: string;
    /** The description of the game */
    description: string;
    /** The image URL for the game */
    image: string;
    /** A badge that will appear on the game's card */
    badge?: string;
    /** The timestamp at which the game was created */
    created: number;
    /** The timestamp at which the game was last updated */
    updated: number;
    /** List of tags to sort the game */
    tags: string[];
    /** Game SEO stuff */
    seo: {
      title?: string;
      description?: string;
      keywords?: string[];
    };
  }

  export type Item<T extends Mode = Mode> = T extends Mode.HigherOrLower
    ? HigherOrLower.Item
    : never;

  // ==================== HigherOrLower ====================

  export interface HigherOrLower extends Base {
    /** The mode of the game */
    mode: Mode.HigherOrLower;
    /** Strings that will appear in-game */
    strings: {
      verb?: string;
      higher: string;
      lower: string;
      noun?: string;
      prefix?: string;
      suffix?: string;
    };
  }

  export namespace HigherOrLower {
    export interface Item {
      /** The name of the item */
      name: string;
      /** The value of the item */
      value: number;
      /** Display appears instead of the value */
      display?: string;
      /** The image URL for the item */
      image: string;
      /** The default cropping for the image */
      frame?: 'fill' | 'fit';
      /** Appears below the item name, as a sort of extra information */
      caption?: string;
    }
  }
}

export type Game = Game.HigherOrLower;
