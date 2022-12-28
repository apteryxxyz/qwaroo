import { Buffer } from 'node:buffer';
import { URL } from 'node:url';
import { Game } from '@qwaroo/types';
import * as cheerio from 'cheerio';
import Jimp from 'jimp';
import { useLogger } from '#/Logger';
import { Source } from '#/Source';
import { prepareOptions } from '#/validators/prepareOptions';

// TYPES

export interface Options {
    pagePath: string;
    shouldCheckImages: boolean;
    tableSelector: string;
    displaySelector: string;
    valueSelector: string;
    imageSelector: string;
    captionSelector?: string;
}

// META

export const source: Source<keyof Options, Options, Game.Mode.HigherOrLower> = {
    for: Game.Mode.HigherOrLower,
    ...Source.meta('GTA Fandom Table', ''),

    props: {
        pagePath: {
            type: Source.Prop.Type.String,
            name: 'GTA Fandom Path',
            description:
                'The path to the GTA Fandom page with the table to scrape.',
            prefix: 'https://gta.fandom.com',
            required: true,
            validate: /^\/wiki\/.+$/,
        },

        shouldCheckImages: {
            type: Source.Prop.Type.Boolean,
            name: 'Check Images',
            description:
                'Whether to check if the images are available. This will slow down the process.',
            required: true,
            default: false,
        },

        tableSelector: {
            type: Source.Prop.Type.String,
            name: 'Table CSS Selector',
            description: 'The CSS selector to use to find the table to scrape.',
            required: true,
            default: '.wikitable td li a',
        },

        displaySelector: {
            type: Source.Prop.Type.String,
            name: 'Display CSS Selector',
            description: 'The CSS selector to use to find the display name.',
            required: true,
            default: '[data-source="name"]',
        },

        valueSelector: {
            type: Source.Prop.Type.String,
            name: 'Value CSS Selector',
            description: 'The CSS selector to use to find the value.',
            required: true,
            default: '[data-source="price"]',
        },

        imageSelector: {
            type: Source.Prop.Type.String,
            name: 'Image CSS Selector',
            description: 'The CSS selector to use to find the image.',
            required: true,
            default: '.pi-image-thumbnail',
        },

        captionSelector: {
            type: Source.Prop.Type.String,
            name: 'Caption CSS Selector',
            description: 'The CSS selector to use to find the caption.',
            required: false,
            default: '.pi-item.pi-data.pi-item-spacing.pi-border-color',
        },
    },

    prepareOptions(options) {
        return prepareOptions(this.props, options);
    },

    async fetchItems(
        { displaySelector, valueSelector, imageSelector, ...options },
        verbose = false
    ) {
        const instanceId = Math.random().toString(36).slice(2);
        const logger = useLogger(`${this.slug}(${instanceId})`);
        if (verbose) logger.info(`Fetching items for ${options.pagePath}...`);

        const $ = await _fetchCheerio(options.pagePath);
        const table = _getElement($, options.tableSelector);
        if (!table) {
            if (verbose) logger.error('No table found');
            return [];
        }

        const itemPaths = table.toArray().map(el => $(el).attr('href')!);
        const items: Game.Item<Game.Mode.HigherOrLower>[] = [];

        for (const itemPath of itemPaths) {
            const $item = await _fetchCheerio(itemPath);

            const display = _getElement($item, displaySelector)?.text();
            const valueElement = _getElement($item, valueSelector);
            const value = _parseNumber(valueElement?.text() ?? '0');
            const image = _getElement($item, imageSelector)?.attr('src');
            const caption = options.captionSelector
                ? _getElement($item, options.captionSelector)?.text()
                : undefined;

            if (!display || !value || !image) {
                const name = display ?? options.pagePath;
                if (verbose) logger.warn(`Item "${name}" is missing data`);
                continue;
            }

            let imageFrame: 'fill' | 'fit' = 'fill';
            if (options.shouldCheckImages) {
                // Checks if the image has a transparent background
                // If so, use 'fit' instead of 'fill'
                const imageBlob = await fetch(image).then(res => res.blob());
                const imageBuffer = await imageBlob.arrayBuffer();
                const jimpImage = await Jimp.read(Buffer.from(imageBuffer));
                if (jimpImage.hasAlpha()) imageFrame = 'fit';
            }

            items.push({
                display,
                value,
                imageSource: image,
                imageFrame,
                caption,
            });
            if (verbose) logger.info(`Added item "${display}"`);
        }

        if (verbose) logger.info(`Finished fetching ${items.length} items`);
        return items;
    },
};

// UTILS

async function _fetchCheerio(path: string) {
    const url = new URL(path, 'https://gta.fandom.com/wiki/');
    const content = await fetch(url.toString()).then(res => res.text());
    return cheerio.load(content);
}

function _getElement($: cheerio.CheerioAPI, selector: string) {
    const element = $(selector);
    if (element.length === 0) return null;
    return element;
}

function _parseNumber(text: string) {
    const numbers = /[\d,.]+/.exec(text);
    if (!numbers || numbers.length === 0) return null;
    return Number(numbers[0].replaceAll(',', ''));
}
