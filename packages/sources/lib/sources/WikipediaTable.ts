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
    wikipediaPath: string;
    imageSearchQuery: `${string} {} ${string}`;
    skipRows: number;
    tableSelector: string;
    displayColumn: number;
    valueColumn: number;
    captionColumn?: number;
}

// META

export const source: Source<keyof Options, Options, Game.Mode.HigherOrLower> = {
    for: Game.Mode.HigherOrLower,
    slug: 'wikipedia_table',
    name: 'Wikipedia Table',
    isPublic: false,
    description:
        `This will scrap the data from a Wikipedia table. The table must be
        in the standard format with the first row being the column headers.
        `.replaceAll(/\s+/g, ' '),

    props: {
        wikipediaPath: {
            type: Source.Prop.Type.String,
            description:
                'The URI to the Wikipedia page with the table to scrape.',
            prefix: 'https://en.wikipedia.org',
            required: true,
            validate: /^\/wiki\/.+$/,
        },

        imageSearchQuery: {
            type: Source.Prop.Type.String,
            description:
                'The query to use when searching for images. Use {} to insert the item name.',
            required: true,
            default: 'image of {}',
        },

        tableSelector: {
            type: Source.Prop.Type.String,
            description: 'The CSS selector to use to find the table to scrape.',
            required: true,
            default: 'table.wikitable',
        },

        skipRows: {
            type: Source.Prop.Type.Number,
            description:
                'The number of rows to skip at the start of the table.',
            required: true,
            default: 1,
        },

        displayColumn: {
            type: Source.Prop.Type.Number,
            description: 'The column index to use for the display value.',
            required: true,
        },

        valueColumn: {
            type: Source.Prop.Type.Number,
            description: 'The column index to use for the value.',
            required: true,
        },

        captionColumn: {
            type: Source.Prop.Type.Number,
            description: 'The column index to use for the caption.',
            required: false,
        },
    },

    prepareOptions(options) {
        return prepareOptions(this.props, options);
    },

    async fetchItems(
        {
            wikipediaPath,
            displayColumn,
            valueColumn,
            captionColumn,
            ...options
        },
        verbose = false
    ) {
        const instanceId = Math.random().toString(36).slice(2);
        const logger = useLogger(`${this.slug}(${instanceId})`);
        if (verbose) logger.info(`Fetching items for ${wikipediaPath}...`);

        const $ = await _fetchCheerio(wikipediaPath);
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
            const baseQuery = options.imageSearchQuery;
            const query = baseQuery.includes('{}')
                ? baseQuery.replace('{}', item.display)
                : `${baseQuery} ${item.display}`;

            await _waitFor(500);
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
