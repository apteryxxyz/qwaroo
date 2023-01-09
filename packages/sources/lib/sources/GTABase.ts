import { URL } from 'node:url';
import { Game } from '@qwaroo/types';
import { useLogger } from '#/Logger';
import { Source } from '#/Source';
import { prepareOptions } from '#/validators/prepareOptions';

// TYPES

export interface Options {
    jsonPath: string;
    gameFilter?: string;
    ctForValue: `ct${number}`;
    ctForCaption?: `ct${number}`;
    captionTemplate?: string;
    imageFrame?: 'fill' | 'fit';
}

// META

export const source: Source<keyof Options, Options, Game.Mode.HigherOrLower> = {
    for: Game.Mode.HigherOrLower,
    ...Source.meta('GTA Base', ''),

    props: {
        jsonPath: {
            type: Source.Prop.Type.String,
            name: 'GTA Base Path',
            description: 'The path to the GTA Base json file.',
            required: true,
            validate: /^\/media\/com_jamegafilter\/en_gb\/.+$/,
        },

        gameFilter: {
            type: Source.Prop.Type.String,
            name: 'CT5 Filter',
            description: 'The filter to use for the CT5.',
            required: false,
        },

        ctForValue: {
            type: Source.Prop.Type.String,
            name: 'Value Column',
            description: 'The column to use for the value.',
            required: true,
        },

        ctForCaption: {
            type: Source.Prop.Type.String,
            name: 'Caption Column',
            description: 'The column to use for the caption.',
            required: false,
        },

        captionTemplate: {
            type: Source.Prop.Type.String,
            name: 'Caption Template',
            description:
                'The template to use for the caption, used {} to insert the value from Caption Column.',
            required: false,
        },

        imageFrame: {
            type: Source.Prop.Type.String,
            name: 'Default Image Frame',
            description: 'The default image frame to use.',
            required: false,
            validate: /^(fill|fit)$/,
            options: [
                { label: 'Fill', value: 'fill' },
                { label: 'Fit', value: 'fit' },
            ],
        },
    },

    prepareOptions(options) {
        return prepareOptions(this.props, options);
    },

    async fetchItems(
        {
            jsonPath,
            gameFilter,
            ctForValue,
            ctForCaption,
            captionTemplate = '{}',
            imageFrame = 'fill',
        },
        verbose = false
    ) {
        const instanceId = Math.random().toString(36).slice(2);
        const logger = useLogger(`${this.slug}(${instanceId})`);
        if (verbose) logger.info(`Fetching items for ${jsonPath}...`);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const initJson = Object.values<any>(await _fetchJson(jsonPath));
        const filteredJson = initJson.filter(obj => {
            if (gameFilter) return obj.attr['ct5']?.value.includes(gameFilter);
            return obj;
        });

        return filteredJson
            .map(item => ({
                display: item.name,
                value: _parseNumber(item.attr[ctForValue]?.value ?? '0')!,
                caption: ctForCaption
                    ? captionTemplate.replace(
                          '{}',
                          String(item.attr[ctForCaption]?.value)
                      )
                    : undefined,
                imageSource: _formatImageUrl(item.thumbnail),
                imageFrame,
            }))
            .filter(item => item.value > 1);
    },
};

// HELPERS

function _fetchJson(path: string) {
    const url = new URL(path, 'https://www.gtabase.com');
    return fetch(url.toString()).then(res => res.json());
}

function _parseNumber(text: string) {
    const numbers = /[\d,.]+/.exec(text);
    if (!numbers || numbers.length === 0) return null;
    return Number(numbers[0].replaceAll(',', ''));
}

function _formatImageUrl(path: string) {
    const url = new URL(path, 'https://gtabase.com');
    url.pathname = url.pathname
        .replace(/\/resized/, '')
        .replaceAll(/_\d+x\d+/g, '');
    return url.toString();
}
