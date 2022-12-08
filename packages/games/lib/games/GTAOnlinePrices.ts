import { Game } from '@owenii/types';
import type * as cheerio from 'cheerio';
import { FandomGenerator } from '../generators/Fandom';

const vehicles = {
    caption: 'body_style',
    type: 'Vehicle',
    imageUrl:
        'https://storiesmedia.sportskeeda.com/wp-content/uploads/2021/06/22072319/sk-5-vehicles-every-beginner-should-own-in-GTA-Online-640x640.png',
    fandomUrl: 'https://gta.fandom.com/wiki/Vehicles_in_GTA_Online',
    keywords: ['vehicles', 'cars', 'motorcycles', 'planes', 'boats', 'bikes'],
};

const weapons = {
    caption: 'type',
    type: 'Weapon',
    imageUrl:
        'https://img.gta5-mods.com/q95/images/better-police-weapons-icons/2ba205-Untitled.jpg',
    fandomUrl: 'https://gta.fandom.com/wiki/Weapons_in_GTA_Online',
    keywords: ['weapons', 'guns', 'melee', 'explosives', 'thrown'],
};

const modes: FandomGenerator<Game.Type.HigherOrLower>[] = [];

for (const meta of [vehicles, weapons]) {
    const mode = new FandomGenerator<Game.Type.HigherOrLower>(
        {
            slug: `gta-online-${meta.type.toLowerCase()}-prices`,
            type: Game.Type.HigherOrLower,
            title: `GTA Online ${meta.type} Prices`,
            description: `Which Grand Theft Auto Online ${meta.type.toLowerCase()} is the most expensive?`,
            imageUrl: meta.imageUrl,
            categories: ['Gaming', 'GTA'],
            seo: {
                title: `Higher or Lower: GTA Online ${meta.type} Prices`,
                description:
                    `Can you guess which Grand Theft Auto Online ${meta.type.toLowerCase()} is the most expensive? ` +
                    'Find out in the guessing game More or Less, the next generation Higher or Less!',
                keywords: [
                    'grand theft auto',
                    'gta',
                    'grand theft auto online',
                    'gta online',
                    'gta online prices',
                    ...meta.keywords,
                ],
            },
            data: {
                aboveValue: 'costs',
                belowValue: 'GTA dollars',
                aboveActions: 'is',
                belowActions: 'expensive',
                higher: 'More',
                lower: 'Less',
            },
            createdTimestamp: new Date(1_670_408_782_797).getTime(),
            updatedTimestamp: Date.now(),
        },
        {
            fandomUrl: meta.fandomUrl,
            shouldCheckImage: meta.type === 'weapon',

            getItemUrls: ($: cheerio.CheerioAPI) =>
                Array.from($('.wikitable td li a')) //
                    .map(el => el.attribs['href']),
            getDisplay: ($: cheerio.CheerioAPI) =>
                $(`[data-source="name"]`).text(),
            getValue: ($: cheerio.CheerioAPI) =>
                $('[data-source="price"]').text(),
            getImageSource: ($: cheerio.CheerioAPI) => {
                const url = $('.pi-image-thumbnail').attr('src') ?? '';
                return url ? url.split('.png/')[0] + '.png' : '';
            },
            getCaption: ($: cheerio.CheerioAPI) =>
                $(`[data-source="${meta.caption}"] div`)
                    .text()
                    .trim()
                    .split('\n')[0],
        }
    );

    modes.push(mode);
}

export default modes;
