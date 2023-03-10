import { Database } from '@qwaroo/database';
import { getEnv } from '@qwaroo/server';
import { ActivityType, Client, GatewayIntentBits, Partials } from 'discord.js';
import { Maclary, container } from 'maclary';
import { GameManager } from '#/classes/GameManager';
import './types';

require('dotenv-expand').expand(require('dotenv').config());

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
                name: 'qwaroo.com | bot is in alpha',
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

void main();
async function main() {
    Maclary.init(maclary, client);
    await database.connect(getEnv(String, 'MONGODB_URI'));
    await client.login(getEnv(String, 'DISCORD_TOKEN'));
}

export { database, client, maclary };
