import 'dotenv/config';
import 'dotenv-expand/config';
import '@owenii/types';

import process from 'node:process';
import { Database, Game } from '@owenii/database';
import { saveAndFetchItems } from '@owenii/sources';
import { Server } from './Server';

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
    await import('./temp').then(md => md.default());
    await ensureGameItems();
    await server.listen();
}

async function ensureGameItems() {
    const games = await Game.find({ sourceId: { $ne: null } });
    await Promise.all(
        games.map(gm =>
            saveAndFetchItems(gm.slug, gm.sourceId!, gm.sourceOptions!)
        )
    );
}

export { database, server };
