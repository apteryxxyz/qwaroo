import { Connection, Database, Game, Score, User } from '@qwaroo/database';

export function convertGame(raw: any) {
    return {
        _id: raw._id['$oid'],
        slug: raw.slug,
        creatorId: raw.creatorId,

        mode: raw.mode,
        title: raw.title,
        shortDescription: raw.shortDescription,
        longDescription: raw.longDescription,
        thumbnailUrl: raw.thumbnailUrl,
        categories: raw.categories,
        flags: raw.publicFlags,
        extraData: {
            valueVerb: raw.data.verb ?? '',
            valueNoun: raw.data.noun ?? '',
            valuePrefix: raw.data.prefix ?? '',
            valueSuffix: raw.data.suffix ?? '',
            higherText: raw.data.higher ?? '',
            lowerText: raw.data.lower ?? '',
        },

        highScore: raw.highScore ?? 0,
        highScoreTime: raw.highScoreTime ?? 0,
        highScorePlayedTimestamp: raw.highScoreTimestamp ?? 0,

        totalScore: raw.totalScore ?? 0,
        totalTime: raw.totalTime ?? 0,
        totalPlays: raw.totalPlays ?? 0,

        lastScore: raw.lastScore ?? 0,
        lastTime: raw.lastTime ?? 0,
        lastPlayedTimestamp: raw.lastPlayedTimestamp ?? 0,

        createdTimestamp: raw.createdTimestamp,
        updatedTimestamp: raw.updatedTimestamp ?? Date.now(),
    };
}

export function convertScore(raw: any) {
    return {
        _id: raw._id['$oid'],
        gameId: raw.gameId,
        userId: raw.userId,

        highScore: raw.highScore ?? 0,
        highScoreTime: raw.highScoreTime ?? 0,
        highScorePlayedTimestamp: raw.highScoreTimestamp ?? 0,

        totalScore: raw.totalScore ?? 0,
        totalTime: raw.totalTime ?? 0,
        totalPlays: raw.totalPlays ?? 0,

        lastScore: raw.lastScore ?? 0,
        lastTime: raw.lastTime ?? 0,
        lastPlayedTimestamp: raw.lastPlayedTimestamp ?? 0,

        firstPlayedTimestamp: raw.firstPlayedTimestamp ?? 0,
    };
}

export function convertConnection(raw: any) {
    return {
        _id: raw._id['$oid'],
        userId: raw.userId,
        providerName: raw.providerName,
        accountId: raw.accountId,
        accountUsername: raw.accountUsername,
        refreshToken: raw.refreshToken,
        linkedTimestamp: raw.linkedTimestamp,
    };
}

export function convertUser(raw: any) {
    return {
        _id: raw._id['$oid'],
        displayName: raw.displayName,
        avatarUrl: raw.avatarUrl,
        flags: raw.publicFlags,
        revokeToken: raw.revokeToken,
        joinedTimestamp: raw.joinedTimestamp,
        lastSeenTimestamp: raw.lastSeenTimestamp,
    };
}

export async function migrate() {
    const db = new Database();
    await db.connect(process.env['MONGODB_URI']!);

    const rawGames = require('./games.json');
    const rawScores = require('./scores.json');
    const rawConnections = require('./connections.json');
    const rawUsers = require('./users.json');

    const games = rawGames.map(convertGame);
    const scores = rawScores.map(convertScore);
    const connections = rawConnections.map(convertConnection);
    const users = rawUsers.map(convertUser);

    await Game.Model.insertMany(games);
    await Score.Model.insertMany(scores);
    await Connection.Model.insertMany(connections);
    await User.Model.insertMany(users);

    await db.disconnect();
}
