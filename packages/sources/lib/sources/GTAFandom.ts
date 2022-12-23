import { Buffer } from 'node:buffer';
import { URL } from 'node:url';
import { Game } from '@owenii/types';
import * as cheerio from 'cheerio';
import Jimp from 'jimp';
import { Source } from '#/Source';
import { prepareOptions } from '#/validators/prepareOptions';

export interface Options {
    fandomUrl: string;
    shouldCheckImages: boolean;
    tableSelector: string;
    displaySelector: string;
    valueSelector: string;
    imageSourceSelector: string;
    captionSelector: string;
}

export const source: Source<keyof Options, Options, Game.Mode.HigherOrLower> = {
    for: Game.Mode.HigherOrLower,
    slug: 'hol.gta-fandom',
    name: 'GTA Fandom',
    isPublic: false,
    description:
        'Scrap data from the GTA Fandom site.\n' +
        `This source will find the first table on the page, then extract
        each of the items URLs from the page. It will then fetch each of
        the items and extract the name, value, image and caption. The
        value will be parsed to a number and used for comparison.
        `.replaceAll(/\s+/g, ' '),

    props: {
        fandomUrl: {
            type: Source.Prop.Type.URL,
            description: 'The URL of the GTA Fandom page with the table.',
            required: true,
        },

        shouldCheckImages: {
            type: Source.Prop.Type.Boolean,
            description:
                'Whether to check if the images are available. This will slow down the process.',
            required: false,
            default: false,
        },

        tableSelector: {
            type: Source.Prop.Type.String,
            description:
                'The CSS selector of the table. This is useful if the table is not the first table on the page.',
            required: false,
            default: '.wikitable td li a',
        },

        displaySelector: {
            type: Source.Prop.Type.String,
            description:
                'The CSS selector of the name. This is the item name that will be displayed to the user.',
            required: false,
            default: '[data-source="name"]',
        },

        valueSelector: {
            type: Source.Prop.Type.String,
            description:
                'The CSS selector of the value. The found value will be parsed to a number and used for comparison.',
            required: false,
            default: '[data-source="price"]',
        },

        imageSourceSelector: {
            type: Source.Prop.Type.String,
            description:
                "The CSS selector of the image source. The found element's 'src' will be used as the items source image.",
            required: false,
            default: '.pi-image-thumbnail',
        },

        captionSelector: {
            type: Source.Prop.Type.String,
            description:
                'The CSS selector of the caption. This is the text that will be displayed below the item name.',
            required: false,
        },
    },

    prepareOptions(options) {
        return prepareOptions(this.props, options);
    },

    async fetchItems(options, debug = false) {
        if (debug)
            console.info(`Fetching all items from "${options.fandomUrl}"...`);

        const $ = await _fetchCheerio(options.fandomUrl);
        const itemsPath = Array.from(
            $(options.tableSelector as '.wikitable td li a')
        ).map(el => el.attribs['href']);

        const items: Game.Item<Game.Mode.HigherOrLower>[] = [];

        for (const path of itemsPath) {
            if (debug) console.log(`Fetching item from "${path}"...`);
            const item = await _fetchItem(path, options);
            if (item) items.push(item);
            else console.warn(`Failed to fetch item from ${path}`);
        }

        return items;
    },
};

async function _fetchItem(
    path: string,
    options: Options
): Promise<Game.Item<Game.Mode.HigherOrLower> | null> {
    const $ = await _fetchCheerio(path);

    // TODO: Add support for captions
    const [display, value, imageSource] = await Promise.all([
        _getDisplay($, options.displaySelector),
        _getValue($, options.valueSelector),
        _getImageSource($, options.imageSourceSelector),
    ]).catch(() => [null, null, null]);
    if (!display || !value || !imageSource) return null;

    let imageFrame: 'fill' | 'fit' = 'fill';
    if (options.shouldCheckImages) {
        // Checks if the image has a transparent background
        // If so, use 'fit' instead of 'fill'
        const imageBlob = await fetch(imageSource).then(res => res.blob());
        const imageBuffer = await imageBlob.arrayBuffer();
        const jimpImage = await Jimp.read(Buffer.from(imageBuffer));
        if (jimpImage.hasAlpha()) imageFrame = 'fit';
    }

    return { display, value, imageSource, imageFrame };
}

async function _fetchCheerio(path: string) {
    const url = new URL(path, 'https://gta.fandom.com');
    const content = await fetch(url.toString()).then(res => res.text());
    return cheerio.load(content);
}

function _getElement($: cheerio.CheerioAPI, selector: string) {
    const element = $(selector);
    if (element.length === 0)
        throw new Error(`No element found for selector: ${selector}`);
    return element;
}

async function _getDisplay($: cheerio.CheerioAPI, selector: string) {
    return _getElement($, selector).text();
}

async function _getValue($: cheerio.CheerioAPI, selector: string) {
    const text = _getElement($, selector).text();
    const numbers = /[\d,.]+/.exec(text);
    if (!numbers || numbers.length === 0)
        throw new Error(`No numbers found in value: ${text}`);
    return Number(numbers[0].replaceAll(',', ''));
}

async function _getImageSource($: cheerio.CheerioAPI, selector: string) {
    return _getElement($, selector).attr('src');
}
