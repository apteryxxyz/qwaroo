import { promisify } from 'node:util';
import { Game } from '@owenii/types';
import * as cheerio from 'cheerio';
import { Source } from '#/Source';
import { prepareOptions } from '#/validators/prepareOptions';

// eslint-disable-next-line import/newline-after-import
const _googleSearch = promisify(require('g-i-s'));
const _waitFor = promisify(setTimeout);

export interface Options {
    valueProperty: string;
}

export const source: Source<keyof Options, Options, Game.Mode.HigherOrLower> = {
    for: Game.Mode.HigherOrLower,
    slug: 'hol.worldometer',
    name: 'Worldometer',
    isPublic: false,
    description: 'Scrap data from the Worldometer site.\n',

    props: {
        valueProperty: {
            type: Source.Prop.Type.String,
            description:
                'The property within the country data object to use as the value.',
            required: true,
        },
    },

    prepareOptions(options) {
        return prepareOptions(this.props, options);
    },

    async fetchItems(options) {
        console.info(options);

        const countryData = await _getCountryData();
        const valueProperty = options.valueProperty as keyof Omit<
            typeof countryData[0],
            'name' | 'imageUrl'
        >;

        return countryData.map(country => ({
            display: country.name,
            value: country[valueProperty],
            imageSource: country.imageUrl,
            imageFrame: 'fill',
        }));
    },
};

let _cachedCountryData: ReturnType<typeof _fetchCountryData> | undefined;

function _getCountryData() {
    if (!_cachedCountryData) {
        const newData = _fetchCountryData();
        _cachedCountryData = newData;
    }

    return _cachedCountryData;
}

async function _fetchCountryData() {
    const url =
        'https://www.worldometers.info/world-population/population-by-country';
    const content = await fetch(url).then(res => res.text());
    const $ = cheerio.load(content);

    const getNth = (element: cheerio.Element, nr: number) =>
        $(element).find(`td:nth-of-type(${nr})`).text().trim();

    const countryData = $('tbody tr')
        .map((_, element) => ({
            name: getNth(element, 2),
            population: Number(getNth(element, 3).replaceAll(',', '')),
            density: Number(getNth(element, 6).replaceAll(',', '')),
            landArea: Number(getNth(element, 7).replaceAll(',', '')),
            fertilityRate: Number(getNth(element, 9).replaceAll(',', '')),
            medianAge: Number(getNth(element, 10).replaceAll(',', '')),
            worldShare: Number(getNth(element, 12).replaceAll(',', '')),
            imageUrl: '',
        }))
        .get();

    for (const country of countryData) {
        await _waitFor(1_000);
        const imageUrl = await _getCountryImage(country.name);
        if (imageUrl) country.imageUrl = imageUrl;
    }

    return countryData;
}

async function _getCountryImage(countryName: string) {
    console.info(`Searching for ${countryName}...`);
    const results = await _googleSearch({
        searchTerm: `photograph of ${countryName}`,
        filterOutDomains: ['istockphoto.com', 'dreamstime.com'],
    });
    return results[0]?.url as string | undefined;
}
