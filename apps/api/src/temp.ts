import { Game, User } from '@owenii/database';

const user = new User({
    displayName: 'Apteryx',
    avatarUrl: 'https://picsum.photos/300/300?random=1',
});

const game = new Game({
    slug: 'test-game',
    type: 1,
    title: 'Test Game',
    shortDescription: 'This is a test game.',
    longDescription: 'This is a test game.',
    thumbnailUrl: 'https://picsum.photos/300/300?random=1',
    categories: ['Test'],
    creatorId: user.id,
    sourceId: 'test',
    sourceOptions: {},
    data: {},
});

void user.save();
void game.save();
