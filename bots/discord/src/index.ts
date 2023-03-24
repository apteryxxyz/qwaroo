import { Lists, Poster } from '@maclary/lists';
import { Database } from '@qwaroo/database';
import { getEnv } from '@qwaroo/server';
import { ActivityType, Client, GatewayIntentBits, Partials } from 'discord.js';
import { Maclary, container } from 'maclary';
import { GameManager } from '#/classes/GameManager';
import './types';

require('dotenv-expand').expand(require('dotenv').config());

const isDevelopment = getEnv(String, 'NODE_ENV') === 'development';

const database = new Database();
container.database = database;
const games = new GameManager();
container.games = games;

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
    partials: [Partials.Channel],
    presence: {
        activities: [
            {
                type: ActivityType.Watching,
                name: 'qwaroo.com',
            },
        ],
    },
});
const maclary = new Maclary({
    defaultPrefix: '!',
    guildId:
        getEnv(String, 'NODE_ENV') === 'development'
            ? getEnv(String, 'GUILD_ID')
            : undefined,
});

const clientId = getEnv(String, 'DISCORD_APPLICATION_ID');

const lists = [
    new Lists.TopGG(clientId, getEnv(String, 'TOP_GG_KEY')),
    new Lists.DiscordBots(clientId, getEnv(String, 'DISCORD_BOTS_KEY')),
    // TODO: Add Botlist.me
    new Lists.DiscordsCom(clientId, getEnv(String, 'DISCORDS_COM_KEY')),
    new Lists.DiscordBotList(clientId, getEnv(String, 'DISCORD_BOT_LIST_KEY')),
    new Lists.DiscordList(clientId, getEnv(String, 'DISCORD_LIST_KEY')),
    new Lists.UniverseList(clientId, getEnv(String, 'UNIVERSE_LIST_KEY')),
];
const poster = new Poster(isDevelopment ? [] : lists, {
    shardCount: () => client.shard?.count ?? 1,
    guildCount: () => 11,
    userCount: () => client.guilds.cache.reduce((a, b) => a + b.memberCount, 0),
    voiceConnectionCount: () => 0,
});
container.poster = poster;

void main();
async function main() {
    Maclary.init(maclary, client);
    await database.connect(getEnv(String, 'MONGODB_URI'));
    await client.login(getEnv(String, 'DISCORD_TOKEN'));
    poster.startAutoPost();
}

export { database, client, maclary };
