import {
    ActivityType,
    Client as Discord,
    GatewayIntentBits,
    Partials,
} from 'discord.js';
import { container, Maclary } from 'maclary';
import { Database } from '@qwaroo/database';
import { getEnv } from '@qwaroo/server';

require('dotenv-expand').expand(require('dotenv').config());

const database = new Database();
const discord = new Discord({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
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
    guildId: getEnv(String, 'GUILD_ID'),
});

container.database = database;

void main();
async function main() {
    Maclary.init(maclary, discord);
    await discord.login(getEnv(String, 'DISCORD_TOKEN'));
    await database.connect(getEnv(String, 'MONGODB_URI'));
}

export { database, discord, maclary };

declare module 'maclary' {
    export interface Container {
        database: Database;
    }
}
