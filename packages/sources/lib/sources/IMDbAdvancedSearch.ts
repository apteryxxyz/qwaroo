import { URL, URLSearchParams } from 'node:url';
import { Game } from '@qwaroo/types';
import * as cheerio from 'cheerio';
import ms from 'enhanced-ms';
import { useLogger } from '#/Logger';
import { Source } from '#/Source';
import { prepareOptions } from '#/validators/prepareOptions';

// TYPES

export interface Options {
    titleType:
        | 'feature'
        | 'tv_series'
        | 'tv_episode'
        | 'tv_special'
        | 'video'
        | 'video_game';
    sortParameter:
        | 'moviemeter'
        | 'user_rating'
        | 'num_votes'
        | 'release_date'
        | 'alpha';
    sortDirection: 'asc' | 'desc';
    valueProperty: 'rating' | 'votes' | 'duration' | 'releaseYear';
}

// META

export const source: Source<keyof Options, Options, Game.Mode.HigherOrLower> = {
    for: Game.Mode.HigherOrLower,
    ...Source.meta('IMDb Advanced Search', ''),

    props: {
        titleType: {
            type: Source.Prop.Type.String,
            name: 'Title Type',
            description: 'The type of search to use.',
            required: true,
            options: [
                { label: 'Feature', value: 'feature' },
                { label: 'TV Series', value: 'tv_series' },
                { label: 'TV Episode', value: 'tv_episode' },
                { label: 'TV Special', value: 'tv_special' },
                { label: 'Video', value: 'video' },
                { label: 'Video Game', value: 'video_game' },
            ],
        },

        sortParameter: {
            type: Source.Prop.Type.String,
            name: 'Sort Parameter',
            description: 'The sort parameter to use.',
            required: true,
            options: [
                { label: 'Popularity', value: 'moviemeter' },
                { label: 'User Rating', value: 'user_rating' },
                { label: 'Number of Votes', value: 'num_votes' },
                { label: 'Release Date', value: 'release_date' },
                { label: 'Alphabetical', value: 'alpha' },
            ],
        },

        sortDirection: {
            type: Source.Prop.Type.String,
            name: 'Sort Direction',
            description: 'The sort direction to use.',
            required: true,
            options: [
                { label: 'Ascending', value: 'asc' },
                { label: 'Descending', value: 'desc' },
            ],
        },

        valueProperty: {
            type: Source.Prop.Type.String,
            name: 'Value Property',
            description: 'The property to use as the value.',
            required: true,
            options: [
                { label: 'Rating', value: 'rating' },
                { label: 'Votes', value: 'votes' },
                { label: 'Runtime', value: 'duration' },
                { label: 'Release Year', value: 'releaseYear' },
            ],
        },
    },

    prepareOptions(options) {
        return prepareOptions(this.props, options);
    },

    async fetchItems(
        { titleType, sortParameter, sortDirection, valueProperty },
        verbose = false
    ) {
        const instanceId = Math.random().toString(36).slice(2);
        const logger = useLogger(`${this.slug}(${instanceId})`);
        if (verbose) logger.info(`Fetching ${titleType} items...`);

        const url = new URL('https://www.imdb.com/search/title/');
        url.search = new URLSearchParams({
            title_type: titleType,
            sort: `${sortParameter},${sortDirection}`,
            view: 'advanced',
            count: '250',
        }).toString();

        const $ = await _fetchCheerio(url.toString());

        const rawDesc = _getElement($, '.desc', true);
        if (!rawDesc) throw new Error('Could not find total titles.');

        const totalMatch = /of (\d+,?\d*) titles/.exec(rawDesc) ?? [''];
        const totalTitles =
            _parseNumber(totalMatch[1].replaceAll(',', '')) ?? 0;
        const totalPages = Math.min(Math.ceil(totalTitles / 50), 5);
        if (verbose) logger.info(`Found ${totalTitles} items.`);

        const items: Game.Item<Game.Mode.HigherOrLower>[] = [];

        for (let i = 0; i < totalPages; i++) {
            url.searchParams.append('start', (i * 50).toString());
            const $page = await _fetchCheerio(url.toString());

            const preItems = _parseLister($page);

            if (preItems.length === 0) continue;
            if (valueProperty === 'duration' && preItems[0].duration === null)
                throw new Error('Duration is not available for this search.');

            const theseItems = preItems.map(item => ({
                display: item.title,
                value: item[valueProperty] as number,
                imageSource: item.imageUrl,
                imageFrame: 'fill' as const,
            }));

            items.push(...theseItems);
            if (verbose) logger.info(`Added ${theseItems.length} items`);
        }

        if (verbose) logger.info(`Finished fetching ${items.length} videos`);
        return items;
    },
};

// UTILS

async function _fetchCheerio(path: string) {
    const url = new URL(path, 'https://www.imdb.com/search/title/');
    const content = await fetch(url.toString()).then(res => res.text());
    return cheerio.load(content);
}

function _getElement(
    $: cheerio.CheerioAPI,
    selector: string,
    text?: true
): string;
function _getElement(
    $: cheerio.CheerioAPI,
    selector: string,
    text?: false
): cheerio.Cheerio<cheerio.AnyNode>;
function _getElement($: cheerio.CheerioAPI, selector: string, text = false) {
    const element = $(selector);
    if (element.length === 0) return null;
    return text ? element.text() : element;
}

function _parseNumber(text: string) {
    const numbers = /[\d,.]+/.exec(text);
    if (!numbers || numbers.length === 0) return null;
    return Number(numbers[0].replaceAll(',', ''));
}

function _formatImageUrl(url: string) {
    return `${url.split('V1')[0]}V1_.jpg`;
}

function _parseLister($: cheerio.CheerioAPI) {
    return Array.from($('.lister-item')).reduce<
        ReturnType<typeof _parseItem>[]
    >((acc, item) => {
        try {
            return [...acc, _parseItem(cheerio.load(item))];
        } catch {
            return acc;
        }
    }, []);
}

function _parseItem($: cheerio.CheerioAPI) {
    const title = _getElement($, '.lister-item-header > a', true);
    const rawReleaseYear = _getElement($, '.lister-item-year', true);
    const releaseYear = _parseNumber(rawReleaseYear ?? '');

    const certificate = _getElement($, '.certificate', true);
    const rawDuration = _getElement($, '.runtime', true);
    const duration = ms(rawDuration ?? '') as number | null;

    const rawGenres = _getElement($, '.genre', true);
    const genres = rawGenres?.split(',').map(s => s.trim());

    const rawRating = _getElement($, '.ratings-imdb-rating', true);
    const rating = _parseNumber(rawRating ?? '');

    const descriptionSelector = '.lister-item-content > p:nth-child(2)';
    const rawDescription = _getElement($, descriptionSelector, true);
    const description = rawDescription?.trim();

    const votesSelector = '.sort-num_votes-visible > span:nth-child(2)';
    const rawVotes = _getElement($, votesSelector, true);
    const votes = _parseNumber(rawVotes ?? '');

    const rawImageUrl = _getElement($, '.lister-item-image > a > img', false);
    const imageUrl = _formatImageUrl(rawImageUrl?.attr('loadlate') ?? '');

    if (!releaseYear || !genres || !rating || !votes || !imageUrl)
        throw new Error('Invalid lister item');

    return {
        title,
        releaseYear,
        certificate,
        duration,
        genres,
        rating,
        description,
        votes,
        imageUrl,
    } as const;
}
