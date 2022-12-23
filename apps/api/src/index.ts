import '@owenii/types';
import process from 'node:process';
import { Database } from '@owenii/database';
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
    await (await import('./temp')).default();
}

export { database, server };
