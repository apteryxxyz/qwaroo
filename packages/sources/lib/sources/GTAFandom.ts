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

export const source: Source<keyof Options, Game.Type.HigherOrLower> = {
    for: Game.Type.HigherOrLower,
    slug: 'hol.gta-fandom',
    name: 'GTA Fandom',
    description:
        'GTA Fandom is a wiki about the Grand Theft Auto series, that anyone can edit.',
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

    async fetchItems(_options) {
        const options = prepareOptions<Options>(this.props, _options);

        const $ = await _fetchCheerio(options.fandomUrlWithTable);
        const itemsPath = Array.from(
            $(options.tableSelector as '.wikitable td li a')
        ).map(el => el.attribs['href']);

        const items: Game.Item<Game.Type.HigherOrLower>[] = [];

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
): Promise<Game.Item<Game.Type.HigherOrLower> | null> {
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
