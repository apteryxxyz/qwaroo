import 'dotenv/config';
import 'dotenv-expand/config';
import '@owenii/types';

import process from 'node:process';
import { Database } from '@owenii/database';
import { Games } from '@owenii/games';
import { Server } from './Server';

let PORT = Number(process.env['PORT']);
if (Number.isNaN(PORT)) {
    console.warn('Missing or invalid PORT, defaulting to 3001');
    PORT = 3_001;
}

const games = new Games();
const database = new Database();
const server = new Server(PORT);

void main();
async function main() {
    games.setBasePath('data');
    await games.ensureGames();
    await database.connect();
    await server.listen();
}

export { games, database, server };
