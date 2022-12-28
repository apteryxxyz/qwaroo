import process from 'node:process';
import { Game, User } from '@qwaroo/database';
import { fetchAndSaveItems } from '@qwaroo/sources';

export default async () => {
    if (process.env['NODE_ENV'] === 'production') return;

    const user = await User.create({
        publicFlags: (1 << 0) | (1 << 1) | (1 << 2) | (1 << 3),
        displayName: 'Apteryx',
        avatarUrl: 'https://picsum.photos/300/300?random=1',
    });

    await Game.create({
        creatorId: user.id,
        sourceSlug: 'imdb-advanced-search',
        sourceOptions: {
            titleType: 'feature',
            sortParameter: 'moviemeter',
            sortDirection: 'asc',
            valueProperty: 'rating',
        },
        mode: 'higher-or-lower',
        title: 'IMDb Movie Ratings',
        shortDescription: 'Which popular movie on IMDb has a higher rating?',
        longDescription:
            'Can you guess which popular movie on IMDb has a higher rating? Find out in this edition of the classic Higher or Lower guessing game!',
        thumbnailUrl: 'https://wallpaperaccess.com/full/3658919.jpg',
        categories: ['Movies'],
        data: {
            verb: 'has a rating of',
            noun: 'out of 10',
            higher: 'Better',
            lower: 'Worse',
        },
    });

    await Game.create({
        creatorId: user.id,
        sourceSlug: 'imdb-advanced-search',
        sourceOptions: {
            titleType: 'video_game',
            sortParameter: 'moviemeter',
            sortDirection: 'asc',
            valueProperty: 'rating',
        },

        mode: 'higher-or-lower',
        title: 'IMDb Video Game Ratings',
        shortDescription:
            'Which popular video game on IMDb has a higher rating?',
        longDescription:
            'Can you guess which popular video game on IMDb has a higher rating? Find out in this edition of the classic Higher or Lower guessing game!',
        thumbnailUrl:
            'https://cdn.vox-cdn.com/uploads/chorus_image/image/68510166/jbareham_201201_ecl1050_goty_2020_top_50_02.0.jpg',
        categories: ['Gaming'],
        data: {
            verb: 'has a rating of',
            noun: 'out of 10',
            higher: 'Better',
            lower: 'Worse',
        },
    });

    await Game.create({
        creatorId: user.id,
        sourceSlug: 'imdb-advanced-search',
        sourceOptions: {
            titleType: 'tv_series',
            sortParameter: 'moviemeter',
            sortDirection: 'asc',
            valueProperty: 'rating',
        },

        mode: 'higher-or-lower',
        title: 'IMDb TV Series Ratings',
        shortDescription:
            'Which popular TV series on IMDb has a higher rating?',
        longDescription:
            'Can you guess which popular TV series on IMDb has a higher rating? Find out in this edition of the classic Higher or Lower guessing game!',
        thumbnailUrl:
            'https://miro.medium.com/max/992/1*jRuU1_OQ1P98SRjniHx1Jg.jpeg',
        categories: ['TV'],
        data: {
            verb: 'has a rating of',
            noun: 'out of 10',
            higher: 'Better',
            lower: 'Worse',
        },
    });

    await Game.create({
        creatorId: user.id,
        sourceSlug: 'worldometer-basic',
        sourceOptions: {
            valueProperty: 'population',
        },

        mode: 'higher-or-lower',
        title: 'Countries by Population',
        shortDescription: 'Which country has a higher population?',
        longDescription:
            'Can you guess which country has a higher population? Find out in this edition of the classic Higher or Lower guessing game!',
        thumbnailUrl:
            'https://blog.ons.gov.uk/wp-content/uploads/sites/6/2021/04/shutterstock_604150523-630x470.jpg',
        categories: ['Geography'],
        data: {
            verb: 'has',
            noun: 'people',
            higher: 'More',
            lower: 'Less',
        },
    });

    await Game.create({
        creatorId: user.id,
        sourceSlug: 'worldometer-basic',
        sourceOptions: {
            valueProperty: 'landArea',
        },

        mode: 'higher-or-lower',
        title: 'Countries by Land Area',
        shortDescription: 'Which country has a larger land area?',
        longDescription:
            'Can you guess which country has a larger land area? Find out in this edition of the classic Higher or Lower guessing game!',
        thumbnailUrl:
            'https://www.geospatialworld.net/wp-content/uploads/2020/04/Population-data-768x513.jpg',
        categories: ['Geography'],
        data: {
            verb: 'has',
            noun: 'in land area',
            suffix: 'km²',
            higher: 'More',
            lower: 'Less',
        },
    });

    await Game.create({
        creatorId: user.id,
        sourceSlug: 'worldometer-basic',
        sourceOptions: {
            valueProperty: 'density',
        },

        mode: 'higher-or-lower',
        title: 'Countries by Population Density',
        shortDescription: 'Which country has a higher population density?',
        longDescription:
            'Can you guess which country has a higher population density? Find out in this edition of the classic Higher or Lower guessing game!',
        thumbnailUrl:
            'https://images.theconversation.com/files/286614/original/file-20190801-169696-2nvbgb.jpg',
        categories: ['Geography'],
        data: {
            verb: 'has',
            noun: 'in population density',
            suffix: 'ppl/km²',
            higher: 'More',
            lower: 'Less',
        },
    });

    await Game.create({
        creatorId: user.id,
        sourceSlug: 'gta-fandom-table',
        sourceOptions: {
            pagePath: '/wiki/Weapons_in_GTA_Online',
            shouldCheckImages: true,
        },

        mode: 'higher-or-lower',
        title: 'GTA Online Weapon Prices',
        shortDescription: 'Which GTA Online weapon is more expensive?',
        longDescription:
            'Can you guess which GTA Online weapon is more expensive? Find out in this edition of the classic Higher or Lower guessing game!',
        thumbnailUrl:
            'https://www.pcgamesn.com/wp-content/sites/pcgamesn/2019/01/gta-online-lasers.jpg',
        categories: ['Gaming'],
        data: {
            verb: 'costs',
            noun: 'dollars',
            prefix: '$',
            higher: 'More',
            lower: 'Less',
        },
    });

    await Game.create({
        creatorId: user.id,
        sourceSlug: 'gta-fandom-table',
        sourceOptions: {
            pagePath: '/wiki/Vehicles_in_GTA_Online',
            shouldCheckImages: true,
        },

        mode: 'higher-or-lower',
        title: 'GTA Online Vehicle Prices',
        shortDescription: 'Which GTA Online vehicle is more expensive?',
        longDescription:
            'Can you guess which GTA Online vehicle is more expensive? Find out in this edition of the classic Higher or Lower guessing game!',
        thumbnailUrl:
            'https://d.newsweek.com/en/full/907847/gta-online-deluxo.jpg',
        categories: ['Gaming'],
        data: {
            verb: 'costs',
            noun: 'dollars',
            prefix: '$',
            higher: 'More',
            lower: 'Less',
        },
    });

    await Game.create({
        creatorId: user.id,
        sourceSlug: 'youtube-channel-video-views',
        sourceOptions: {
            channelIds: ['UCV6mNrW8CrmWtcxWfQXy11g'],
        },

        mode: 'higher-or-lower',
        title: 'DarkViperAU Video Views',
        shortDescription:
            'Which of GTA speedrunner DarkViperAUs videos has more views?',
        longDescription:
            'Can you guess which of GTA speedrunner DarkViperAUs videos has more views? Find out in this edition of the classic Higher or Lower guessing game!',
        thumbnailUrl:
            'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/cd5a5964-649b-424c-b83d-6aff2736807c/dec6qdy-29ca9b08-861c-4337-b085-3dab7d836ffa.png/v1/fill/w_1280,h_1280,q_80,strp/darkviperau_fanart_celebrating_500k_subs_by_doragonroudo_dec6qdy-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2NkNWE1OTY0LTY0OWItNDI0Yy1iODNkLTZhZmYyNzM2ODA3Y1wvZGVjNnFkeS0yOWNhOWIwOC04NjFjLTQzMzctYjA4NS0zZGFiN2Q4MzZmZmEucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.Jr-iHA0_AaomirGEv4Uv2gArcoBGUQM6LvyCR9X4YRM',
        categories: ['Content Creators'],
        data: {
            verb: 'has',
            noun: 'views',
            higher: 'More',
            lower: 'Less',
        },
    });

    await ensureGameItems();
};

async function ensureGameItems() {
    const verbose = process.env['VERBOSE'] === 'true';

    const promises = [];
    for (const game of await Game.find({ sourceSlug: { $ne: null } })) {
        if (!game.sourceSlug || !game.sourceOptions) continue;

        promises.push(
            fetchAndSaveItems(
                game.slug,
                game.mode,
                game.sourceSlug,
                game.sourceOptions,
                verbose
            )
        );
    }

    await Promise.all(promises);
}
