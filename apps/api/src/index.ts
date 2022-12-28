import '@qwaroo/types';
import process from 'node:process';
import { Database, Game } from '@qwaroo/database';
import { fetchAndSaveItems } from '@qwaroo/sources';
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
    await server.listen();
    await (await import('./dev')).default();
    await ensureGameItems();
}

export { database, server };

async function ensureGameItems() {
    const verbose = process.env['VERBOSE'] === 'true';
    const games = await Game.find({ sourceSlug: { $ne: null } });

    await Promise.all(
        games.map(async gm => {
            if (!gm.sourceSlug || !gm.sourceOptions) return;
            if (verbose)
                console.info(
                    `Ensuring items for "${gm.title}" using "${gm.sourceSlug}"...`
                );
            await fetchAndSaveItems(
                gm.slug,
                gm.mode,
                gm.sourceSlug,
                gm.sourceOptions,
                verbose
            );
            if (verbose) console.info(`Done ensuring items for "${gm.title}"!`);
        })
    );
}
