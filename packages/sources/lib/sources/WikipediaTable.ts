import { URL } from 'node:url';
import { promisify } from 'node:util';
import { Game } from '@qwaroo/types';
import * as cheerio from 'cheerio';
import { useLogger } from '#/Logger';
import { Source } from '#/Source';
import { prepareOptions } from '#/validators/prepareOptions';

// eslint-disable-next-line import/newline-after-import
const _googleSearch = promisify(require('g-i-s'));
const _waitFor = promisify(setTimeout);

// TYPES

export interface Options {
    pagePath: string;
    imageSearchTemplate: string;
    skipRows: number;
    tableSelector: string;
    displayColumn: number;
    valueColumn: number;
    captionColumn?: number;
}

// META

export const source: Source<keyof Options, Options, Game.Mode.HigherOrLower> = {
    for: Game.Mode.HigherOrLower,
    ...Source.meta('Wikipedia Table', ''),

    props: {
        pagePath: {
            type: Source.Prop.Type.String,
            name: 'Wikipedia Path',
            description:
                'The path to the Wikipedia page with the table to scrape.',
            prefix: 'https://en.wikipedia.org',
            required: true,
            validate: /^\/wiki\/.+$/,
        },

        imageSearchTemplate: {
            type: Source.Prop.Type.String,
            name: 'Image Search Template',
            description:
                'The query to use when searching for images. Use {} to insert the item name.',
            required: true,
            default: 'image of {}',
        },

        tableSelector: {
            type: Source.Prop.Type.String,
            name: 'Table CSS Selector',
            description: 'The CSS selector to use to find the table to scrape.',
            required: true,
            default: 'table.wikitable',
        },

        skipRows: {
            type: Source.Prop.Type.Number,
            name: 'Skip Rows',
            description:
                'The number of rows to skip at the start of the table.',
            required: true,
            default: 1,
        },

        displayColumn: {
            type: Source.Prop.Type.Number,
            name: 'Display Column',
            description: 'The column index to use for the display value.',
            required: true,
        },

        valueColumn: {
            type: Source.Prop.Type.Number,
            name: 'Value Column',
            description: 'The column index to use for the value.',
            required: true,
        },

        captionColumn: {
            type: Source.Prop.Type.Number,
            name: 'Caption Column',
            description: 'The column index to use for the caption.',
        },
    },

    prepareOptions(options) {
        return prepareOptions(this.props, options);
    },

    async fetchItems(
        { pagePath, displayColumn, valueColumn, captionColumn, ...options },
        verbose = false
    ) {
        const instanceId = Math.random().toString(36).slice(2);
        const logger = useLogger(`${this.slug}(${instanceId})`);
        if (verbose) logger.info(`Fetching items for ${pagePath}...`);

        const $ = await _fetchCheerio(pagePath);
        const table = $(options.tableSelector);
        if (!table) {
            if (verbose) logger.error('No table found');
            return [];
        }

        const getNth = (element: cheerio.Element, index: number) =>
            $(element).find(`td:nth-of-type(${index})`).text().trim();

        const items = table
            .find('tr')
            .toArray()
            .slice(options.skipRows)
            .map(row => ({
                display: getNth(row, displayColumn - 1),
                value: _parseNumber(getNth(row, valueColumn - 1)) as number,
                caption: captionColumn
                    ? getNth(row, captionColumn - 1)
                    : undefined,
                imageSource: '',
                imageFrame: 'fill' as const,
            }))
            .filter(item => item.value);

        for (const item of items) {
            const baseQuery = options.imageSearchTemplate;
            const query = baseQuery.includes('{}')
                ? baseQuery.replace('{}', item.display)
                : `${baseQuery} ${item.display}`;

            const imageSource = await _getImageUrl(query);
            if (imageSource) item.imageSource = imageSource;
            if (verbose) logger.info(`Found image for "${item.display}"`);
        }

        if (verbose) logger.info(`Finished fetching ${items.length} items`);
        return items;
    },
};

// UTILS

async function _fetchCheerio(path: string) {
    const url = new URL(path, 'https://wikipedia.org/wiki/');
    const content = await fetch(url.toString()).then(res => res.text());
    return cheerio.load(content);
}

function _parseNumber(text: string) {
    const numbers = /[\d,.]+/.exec(text);
    if (!numbers || numbers.length === 0) return null;
    return Number(numbers[0].replaceAll(',', ''));
}

const _cachedImages = new Map<string, string>();

async function _getImageUrl(query: string) {
    if (_cachedImages.has(query)) return _cachedImages.get(query);

    await _waitFor(500);
    const results = await _googleSearch({
        searchTerm: query,
        queryStringAddition: '&tbs=itp:photo',
        filterOutDomains: [
            'istockphoto.com',
            'dreamstime.com',
            'shutterstock.com',
        ],
    });

    _cachedImages.set(query, results[0].url);
    if (results.length === 0) return null;
    return results[0].url;
}
