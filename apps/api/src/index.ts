import '@owenii/types';
import process from 'node:process';
import { Database, Game } from '@owenii/database';
import { fetchAndSaveItems } from '@owenii/sources';
import dotenv = require('dotenv');
import dotenvExpand = require('dotenv-expand');
import { Server } from './Server';

const env = dotenv.config();
dotenvExpand.expand(env);

let PORT = Number(process.env['PORT']);
if (Number.isNaN(PORT)) {
    console.warn('Missing or invalid PORT, defaulting to 3001');
    PORT = 3_001;
}

const database = new Database();
const server = new Server(PORT);

void main();
async function main() {
    await database.connect();
    await ensureGameItems();
    await server.listen();
}

async function ensureGameItems() {
    const games = await Game.find({ sourceSlug: { $ne: null } });
    await Promise.all(
        games.map(gm =>
            fetchAndSaveItems(gm.slug, gm.sourceSlug!, gm.sourceOptions!)
        )
    );
}

export { database, server };
