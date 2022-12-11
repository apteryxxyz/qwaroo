import { Buffer } from 'node:buffer';
import { URL } from 'node:url';
import { Game } from '@owenii/types';
import * as cheerio from 'cheerio';
import Jimp from 'jimp';
import { Source } from './Source';

export class GTAFandomHigherOrLower extends Source<
    keyof GTAFandom.Options,
    GTAFandom.Options,
    Game.Item<Game.Type.HigherOrLower>
> {
    public for = Game.Type.HigherOrLower;
    public slug = 'hol_gta-fandom';
    public name = 'GTA Fandom';
    public description =
        'GTA Fandom is a wiki about the Grand Theft Auto series, that anyone can edit.';

    public props = {
        fandomUrlWithTable: {
            type: 'string',
            description: 'The URL of the GTA Fandom page with the table.',
            required: true,
        },

        shouldCheckImages: {
            type: 'boolean',
            description:
                'Whether to check if the images are available. This will slow down the process.',
            required: false,
            default: false,
        },

        tableSelector: {
            type: 'string',
            description:
                'The CSS selector of the table. This is useful if the table is not the first table on the page.',
            required: false,
            default: '.wikitable td li a',
        },

        displaySelector: {
            type: 'string',
            description:
                'The CSS selector of the name. This is the item name that will be displayed to the user.',
            required: false,
            default: '[data-source="name"]',
        },

        valueSelector: {
            type: 'string',
            description:
                'The CSS selector of the value. The found value will be parsed to a number and used for comparison.',
            required: false,
            default: '[data-source="price"]',
        },

        imageSourceSelector: {
            type: 'string',
            description:
                "The CSS selector of the image source. The found element's 'src' will be used as the items source image.",
            required: false,
            default: '.pi-image-thumbnail',
        },

        captionSelector: {
            type: 'string',
            description:
                'The CSS selector of the caption. This is the text that will be displayed below the item name.',
            required: false,
        },
    };

    public async fetchItems() {
        const $ = await this._fetchCheerio(this.options.fandomUrlWithTable);
        const itemsPath = Array.from(
            $(this.options.tableSelector as '.wikitable td li a')
        ).map(el => el.attribs['href']);

        const items: Game.Item<Game.Type.HigherOrLower>[] = [];

        for (const path of itemsPath) {
            const item = await this._fetchItem(path);
            if (item) items.push(item);
        }

        return items;
    }

    private async _fetchCheerio(fandomUrl: string) {
        const url = new URL(fandomUrl, 'https://gta.fandom.com');
        const content = await fetch(url).then(res => res.text());
        return cheerio.load(content);
    }

    private async _fetchItem(fandomUrl: string) {
        console.log('Getting item from', fandomUrl);
        const $ = await this._fetchCheerio(fandomUrl);

        const display = this._getDisplay($);
        const value = this._getValue($);
        const imageSource = this._getImageSource($);
        console.log(display, value, imageSource);
        if (!display || !value || !imageSource) return null;

        let imageFrame: 'fill' | 'fit' = 'fill';
        if (this.options.shouldCheckImages) {
            const imageBlob = await fetch(imageSource).then(res => res.blob());
            const imageBuffer = await imageBlob.arrayBuffer();
            const jimpImage = await Jimp.read(Buffer.from(imageBuffer));
            if (jimpImage.hasAlpha()) imageFrame = 'fit';
        }

        return {
            display,
            value,
            imageSource,
            imageFrame,
        } as Game.Item<Game.Type.HigherOrLower>;
    }

    private _getDisplay($: cheerio.CheerioAPI) {
        return $(this.options.displaySelector).text();
    }

    private _getValue($: cheerio.CheerioAPI) {
        const text = $(this.options.valueSelector).text();
        const prices = /\$[\d,.]+/.exec(text);
        if (!prices || prices.length === 0) return 0;
        return Number(prices[0].replaceAll(/[$,]/g, ''));
    }

    private _getImageSource($: cheerio.CheerioAPI) {
        const src = $(this.options.imageSourceSelector).attr('src');
        return src ? src.split('/revision')[0] : undefined;
    }
}

export namespace GTAFandom {
    export interface Options {
        fandomUrlWithTable: string;
        shouldCheckImages: boolean;
        tableSelector: string;
        displaySelector: string;
        valueSelector: string;
        imageSourceSelector: string;
        captionSelector?: string;
    }
}
