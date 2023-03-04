import { Client as Discord } from 'discord.js';
import { Maclary } from 'maclary';

require('dotenv-expand').expand(require('dotenv').config());

const discord = new Discord({
    intents: [],
    partials: [],
});
const maclary = new Maclary({
    guildId: process.env['GUILD_ID']!,
});
Maclary.init(maclary, discord);

void discord.login(process.env['DISCORD_TOKEN']!);
