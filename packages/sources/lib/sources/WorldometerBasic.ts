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
    valueProperty:
        | 'population'
        | 'density'
        | 'landArea'
        | 'fertilityRate'
        | 'medianAge'
        | 'worldShare';
}

// META

export const source: Source<keyof Options, Options, Game.Mode.HigherOrLower> = {
    for: Game.Mode.HigherOrLower,
    ...Source.meta('Worldometer Basic', ''),

    props: {
        valueProperty: {
            type: Source.Prop.Type.String,
            name: 'Value Property',
            description: 'The property to use as the value.',
            required: true,
            options: [
                { label: 'Population', value: 'population' },
                { label: 'Density', value: 'density' },
                { label: 'Land Area', value: 'landArea' },
                { label: 'Fertility Rate', value: 'fertilityRate' },
                { label: 'Median Age', value: 'medianAge' },
            ],
        },
    },

    prepareOptions(options) {
        return prepareOptions(this.props, options);
    },

    async fetchItems({ valueProperty }, verbose = false) {
        const instanceId = Math.random().toString(36).slice(2);
        const logger = useLogger(`${this.slug}(${instanceId})`);
        if (verbose) logger.info(`Fetching items...`);

        const countries = await _fetchCountries();
        return Promise.all(
            countries.map(async country => ({
                display: country.name,
                value: country[valueProperty],
                imageSource: (await _getImageUrl(
                    `pretty photo of ${country.name}`,
                    verbose
                ).then(url => {
                    return url;
                })) as string,
                imageFrame: 'fill' as const,
            }))
        ).then(final => {
            if (verbose) logger.info(`Fetched fetching ${final.length} items`);
            return final;
        });
    },
};

// UTILS

async function _fetchCheerio(path = '/world-population/population-by-country') {
    const url = new URL(path, 'https://www.worldometers.info');
    const content = await fetch(url.toString()).then(res => res.text());
    return cheerio.load(content);
}

function _parseNumber(text: string) {
    const numbers = /[\d,.]+/.exec(text);
    if (!numbers || numbers.length === 0) return null;
    return Number(numbers[0].replaceAll(',', ''));
}

async function _fetchCountries() {
    const $ = await _fetchCheerio();

    const getNth = (row: cheerio.Element, index: number) =>
        $(row).find(`td:nth-of-type(${index})`).text().trim();

    return $('tbody tr')
        .map((_, row) => ({
            name: getNth(row, 2),
            population: _parseNumber(getNth(row, 3)) as number,
            density: _parseNumber(getNth(row, 4)) as number,
            landArea: _parseNumber(getNth(row, 5)) as number,
            fertilityRate: _parseNumber(getNth(row, 6)) as number,
            medianAge: _parseNumber(getNth(row, 7)) as number,
            worldShare: _parseNumber(getNth(row, 8)) as number,
        }))
        .get();
}

const _cachedImages = new Map<string, string>();

async function _getImageUrl(query: string, verbose = false) {
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

    if (verbose)
        console.info(`[worldometer-basic(*)] Found image for "${query}"`);
    if (results.length === 0) return null;
    _cachedImages.set(query, results[0].url);
    return results[0].url;
}
