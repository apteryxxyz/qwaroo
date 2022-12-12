import 'dotenv/config';
import 'dotenv-expand/config';
import '@owenii/types';

import process from 'node:process';
import { Database } from '@owenii/database';
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
    // TODO: Get games from database and ensure their local items are up to date
    await import('./temp');
    await server.listen();
}

export { database, server };
