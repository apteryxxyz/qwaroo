import { URL } from 'node:url';
import { promisify } from 'node:util';
import { Game } from '@owenii/types';
import * as cheerio from 'cheerio';
import { Source } from '#/Source';
import { prepareOptions } from '#/validators/prepareOptions';

// eslint-disable-next-line import/newline-after-import
const _googleSearch = promisify(require('g-i-s'));
const _waitFor = promisify(setTimeout);

export interface Options {
    wikipediaUrl: string;
    imageSearchQuery: `${string} {} ${string}`;
    skipRows: number;
    tableSelector: string;
    displayColumn: number;
    valueColumn: number;
}

export const source: Source<keyof Options, Options, Game.Mode.HigherOrLower> = {
    for: Game.Mode.HigherOrLower,
    slug: 'hol.wikipedia',
    name: 'Wikipedia Table',
    isPublic: true,
    description: 'Scrap data from a Wikipedia table.\n',

    props: {
        wikipediaUrl: {
            type: Source.Prop.Type.URL,
            description:
                'The URL to the Wikipedia page with the table to scrape.',
            required: true,
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
    },

    prepareOptions(options) {
        return prepareOptions(this.props, options);
    },

    async fetchItems({ displayColumn, valueColumn, ...options }) {
        const $ = await _fetchCheerio(options.wikipediaUrl);

        const getNth = (element: cheerio.Element, index: number) =>
            $(element).find(`td:nth-of-type(${index})`).text().trim();

        const items = $(options.tableSelector)
            .find('tr')
            .toArray()
            .slice(options.skipRows)
            .map(row => ({
                display: getNth(row, displayColumn - 1),
                value: _parseNumber(getNth(row, valueColumn - 1)),
                imageSource: '',
                imageFrame: 'fill' as const,
            }))
            .filter(item => !Number.isNaN(item.value));

        for (const item of items) {
            const baseQuery = options.imageSearchQuery;
            const query = baseQuery.includes('{}')
                ? baseQuery.replace('{}', item.display)
                : `${baseQuery} ${item.display}`;

            const imageSource = await _getGoogleImage(query);
            if (imageSource) item.imageSource = imageSource;
            await _waitFor(500);
        }

        return items;
    },
};

function _parseNumber(text: string) {
    const numbers = /[\d,.]+/.exec(text);
    if (!numbers || numbers.length === 0) return Number.NaN;
    return Number(numbers[0].replaceAll(',', ''));
}

async function _fetchCheerio(path: string) {
    const url = new URL(path, 'https://wikipedia.org');
    const content = await fetch(url.href).then(res => res.text());
    return cheerio.load(content);
}

const _cachedImages = new Map<string, string>();

async function _getGoogleImage(query: string) {
    if (_cachedImages.has(query)) {
        return _cachedImages.get(query);
    }

    console.info(`Searching for "${query}"...`);
    const results = await _googleSearch({
        searchTerm: query,
        filterOutDomains: [
            'istockphoto.com',
            'dreamstime.com',
            'shutterstock.com',
        ],
    });

    if (results.length === 0) return '';
    _cachedImages.set(query, results[0].url);
    return results[0].url;
}
