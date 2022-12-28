import process from 'node:process';
import { Game, User } from '@qwaroo/database';

export default async () => {
    if (process.env['NODE_ENV'] !== 'development') return;

    const user = await User.create({
        displayName: 'Apteryx',
        avatarUrl: 'https://picsum.photos/300/300?random=1',
    });

    await Game.create({
        creatorId: user.id,
        sourceSlug: 'imdb-search-results',
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
        sourceSlug: 'imdb-search-results',
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
        sourceSlug: 'imdb-search-results',
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
};
