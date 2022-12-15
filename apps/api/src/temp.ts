import { Game, User } from '@owenii/database';

export default async () => {
    const user = await User.create({
        displayName: 'Apteryx',
        avatarUrl: 'https://picsum.photos/300/300?random=1',
    });

    await Game.create({
        mode: 'higher-or-lower',
        title: 'GTA Online Weapon Prices',
        shortDescription: 'Which GTA Online Weapon is more expensive?',
        longDescription: 'Which GTA Online Weapon is more expensive?',
        thumbnailUrl:
            'https://www.pcgamesn.com/wp-content/sites/pcgamesn/2019/01/gta-online-lasers.jpg',
        categories: ['Gaming', 'GTA'],
        creatorId: user.id,
        sourceSlug: 'hol.gta-fandom',
        sourceOptions: {
            fandomUrlWithTable:
                'https://gta.fandom.com/wiki/Weapons_in_GTA_Online',
            shouldCheckImages: true,
        },
        data: {
            verb: 'costs',
            noun: 'dollars',
            prefix: '$',
            suffix: '',
            higher: 'More',
            lower: 'Less',
        },
    });

    await Game.create({
        mode: 'higher-or-lower',
        title: 'GTA Online Vehicle Prices',
        shortDescription: 'Which GTA Online Vehicle is more expensive?',
        longDescription: 'Which GTA Online Vehicle is more expensive?',
        thumbnailUrl:
            'https://d.newsweek.com/en/full/907847/gta-online-deluxo.jpg',
        categories: ['Gaming', 'GTA'],
        creatorId: user.id,
        sourceSlug: 'hol.gta-fandom',
        sourceOptions: {
            fandomUrlWithTable:
                'https://gta.fandom.com/wiki/Vehicles_in_GTA_Online',
            shouldCheckImages: false,
        },
        data: {
            verb: 'costs',
            noun: 'dollars',
            prefix: '$',
            suffix: '',
            higher: 'More',
            lower: 'Less',
        },
    });

    await Game.create({
        mode: 'higher-or-lower',
        title: 'DarkViperAU Video Views',
        shortDescription:
            'Which of GTA Speedrunner DarkViperAU videos has more views?',
        longDescription: 'Which DarkViperAU video has more views?',
        thumbnailUrl:
            'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/cd5a5964-649b-424c-b83d-6aff2736807c/dec6qdy-29ca9b08-861c-4337-b085-3dab7d836ffa.png/v1/fill/w_1280,h_1280,q_80,strp/darkviperau_fanart_celebrating_500k_subs_by_doragonroudo_dec6qdy-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2NkNWE1OTY0LTY0OWItNDI0Yy1iODNkLTZhZmYyNzM2ODA3Y1wvZGVjNnFkeS0yOWNhOWIwOC04NjFjLTQzMzctYjA4NS0zZGFiN2Q4MzZmZmEucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.Jr-iHA0_AaomirGEv4Uv2gArcoBGUQM6LvyCR9X4YRM',
        categories: ['Content Creator'],
        creatorId: user.id,
        sourceSlug: 'hol.yt-channel',
        sourceOptions: {
            channelIds: ['UCV6mNrW8CrmWtcxWfQXy11g'],
        },
        data: {
            verb: 'has',
            noun: 'views',
            prefix: '',
            suffix: '',
            higher: 'More',
            lower: 'Less',
        },
    });
};
