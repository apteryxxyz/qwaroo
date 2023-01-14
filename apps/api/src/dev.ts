import process from 'node:process';
import { Connection, Game, User } from '@qwaroo/database';
import { fetchAndSaveItems } from '@qwaroo/sources';

export default async () => {
    if (process.env['NODE_ENV'] === 'production') return;

    const user = await User.create({
        publicFlags: (1 << 0) | (1 << 1) | (1 << 2) | (1 << 3),
        displayName: 'Apteryx',
        avatarUrl: 'https://picsum.photos/300/300?random=1',
    });

    await Connection.create({
        userId: user.id,
        providerName: 'discord',
        accountId: '548150274414608399',
        accountUsername: 'Apteryx#3459',
        refreshToken: '123',
    });

    await Game.create({
        creatorId: user.id,
        sourceSlug: 'gta-base',
        sourceOptions: {
            jsonPath: '/media/com_jamegafilter/en_gb/1.json',
            gameFilter: 'gta-online',
            ctForValue: 'ct13',
        },
        publicFlags: 1,
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
        sourceSlug: 'gta-base',
        sourceOptions: {
            jsonPath: '/media/com_jamegafilter/en_gb/6.json',
            gameFilter: 'gta-online',
            ctForValue: 'ct13',
            imageFrame: 'fit',
        },
        publicFlags: 1,
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
        sourceSlug: 'gta-base',
        sourceOptions: {
            jsonPath: '/media/com_jamegafilter/en_gb/1.json',
            gameFilter: 'gta-online',
            ctForValue: 'ct132',
        },
        publicFlags: 1,
        mode: 'higher-or-lower',
        title: 'GTA Online Vehicle Top Speeds',
        shortDescription: 'Which GTA Online vehicle is faster?',
        longDescription:
            'Can you guess which GTA Online vehicle is faster? Find out in this edition of the classic Higher or Lower guessing game!',
        thumbnailUrl:
            'https://www.theloadout.com/wp-content/uploads/2021/05/fastest-cars-gta-5-br8.jpeg',
        categories: ['Gaming'],
        data: {
            verb: 'goes',
            noun: 'MPH',
            higher: 'Faster',
            lower: 'Slower',
        },
    });

    await Game.create({
        creatorId: user.id,
        sourceSlug: 'gta-base',
        sourceOptions: {
            jsonPath: '/media/com_jamegafilter/en_gb/3.json',
            ctForValue: 'ct13',
        },
        publicFlags: 1,
        mode: 'higher-or-lower',
        title: 'GTA Online Property Prices',
        shortDescription: 'Which GTA Online property is more expensive?',
        longDescription:
            'Can you guess which GTA Online property is is more expensive? Find out in this edition of the classic Higher or Lower guessing game!',
        thumbnailUrl:
            'https://www.gtabase.com/images/jch-optimize/ng/images_gta-5_properties_apartment_full_eclipse-towers.webp',
        categories: ['Gaming'],
        data: {
            verb: 'costs',
            prefix: '$',
            noun: 'dollars',
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
        publicFlags: 1,
        mode: 'higher-or-lower',
        title: 'DarkViperAU Video Views',
        shortDescription:
            'Which of GTA speedrunner DarkViperAUs videos has more views?',
        longDescription:
            'Can you guess which of GTA speedrunner DarkViperAUs videos has more views? Find out in this edition of the classic Higher or Lower guessing game!',
        thumbnailUrl:
            'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/cd5a5964-649b-424c-b83d-6aff2736807c/dec6qdy-29ca9b08-861c-4337-b085-3dab7d836ffa.png/v1/fill/w_1280,h_1280,q_80,strp/darkviperau_fanart_celebrating_500k_subs_by_doragonroudo_dec6qdy-fullview.jpg',
        categories: ['Content Creators'],
        data: {
            verb: 'has',
            noun: 'views',
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
        publicFlags: 1,
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
        publicFlags: 1,
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
