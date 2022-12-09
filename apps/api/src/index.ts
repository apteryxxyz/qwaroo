import 'dotenv/config';
import 'dotenv-expand/config';
import '@owenii/types';

import { Database } from '@owenii/database';
import { Games } from '@owenii/games';
import { Server } from './Server';

const games = new Games();
const database = new Database();
const server = new Server(3_000);

void main();
async function main() {
    games.setBasePath('data');
    await games.ensureGames();
    await database.connect();
    await server.listen();
}

export { games, database, server };
