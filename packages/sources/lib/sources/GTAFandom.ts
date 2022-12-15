import { Buffer } from 'node:buffer';
import { URL } from 'node:url';
import { Game } from '@owenii/types';
import * as cheerio from 'cheerio';
import Jimp from 'jimp';
import { Source } from '#/Source';
import { prepareOptions } from '#/validators/prepareOptions';

export interface Options {
    fandomUrlWithTable: string;
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
    description:
        'Scrap data from the GTA Fandom page.\n' +
        `This source will find the first table on the page, then extract
        each of the items URLs from the page. It will then fetch each of
        the items and extract the name, value, image and caption. The
        value will be parsed to a number and used for comparison.
        `.replaceAll(/\s+/g, ' '),

    props: {
        fandomUrlWithTable: {
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

    async fetchItems(options) {
        const $ = await _fetchCheerio(options.fandomUrlWithTable);
        const itemsPath = Array.from(
            $(options.tableSelector as '.wikitable td li a')
        ).map(el => el.attribs['href']);

        const items: Game.Item<Game.Mode.HigherOrLower>[] = [];

        for (const path of itemsPath) {
            const item = await _fetchItem(path, options);
            if (item) items.push(item);
        }

        return items;
    },
};

async function _fetchItem(
    path: string,
    options: Options
): Promise<Game.Item<Game.Mode.HigherOrLower> | null> {
    console.log(`Fetching item from ${path}`);
    const $ = await _fetchCheerio(path);

    // eslint-disable-next-line max-statements-per-line
    const [display, value, imageSource] = await Promise.all([
        _getDisplay($, options.displaySelector),
        _getValue($, options.valueSelector),
        _getImageSource($, options.imageSourceSelector),
    ]).catch(() => [null, null, null]);
    if (!display || !value || !imageSource) return null;

    let imageFrame: 'fill' | 'fit' = 'fill';
    if (options.shouldCheckImages) {
        const imageBlob = await fetch(imageSource).then(res => res.blob());
        const imageBuffer = await imageBlob.arrayBuffer();
        const jimpImage = await Jimp.read(Buffer.from(imageBuffer));
        if (jimpImage.hasAlpha()) imageFrame = 'fit';
    }

    return { display, value, imageSource, imageFrame };
}

async function _fetchCheerio(path: string) {
    const url = new URL(path, 'https://gta.fandom.com');
    const content = await fetch(url.href).then(res => res.text());
    return cheerio.load(content);
}

function getElement($: cheerio.CheerioAPI, selector: string) {
    const element = $(selector);
    if (element.length === 0)
        throw new Error(`No element found for selector: ${selector}`);
    return element;
}

async function _getDisplay($: cheerio.CheerioAPI, selector: string) {
    return getElement($, selector).text();
}

async function _getValue($: cheerio.CheerioAPI, selector: string) {
    const text = getElement($, selector).text();
    const numbers = /[\d,.]+/.exec(text);
    if (!numbers || numbers.length === 0)
        throw new Error(`No numbers found in value: ${text}`);
    return Number(numbers[0].replaceAll(',', ''));
}

async function _getImageSource($: cheerio.CheerioAPI, selector: string) {
    const src = getElement($, selector).attr('src');
    return src ? src.split('/revision')[0] : undefined;
}
