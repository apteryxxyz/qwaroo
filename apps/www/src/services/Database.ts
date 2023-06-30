/* eslint-disable no-inner-declarations */
/* eslint-disable import/no-mutable-exports */

import { Database } from '@qwaroo/database';

type Global = typeof globalThis & {
    _waitForDatabase?: Promise<Database>;
};

const connectionString = process.env.MONGODB_URI!;
const database = new Database();
let waitForDatabase: Promise<Database> = new Promise(resolve => resolve(database));

async function connect() {
    await database.connect(connectionString);
    return database;
}

if (connectionString) {
    const globalWithDatabase = global as Global;

    if (process.env.NODE_ENV === 'development' && !globalWithDatabase._waitForDatabase) {
        globalWithDatabase._waitForDatabase = connect();
        waitForDatabase = globalWithDatabase._waitForDatabase;
    } else {
        waitForDatabase = connect();
    }
}

export { database, waitForDatabase };
