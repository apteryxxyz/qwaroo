import { Database } from '@qwaroo/database';

let database: Database;
// eslint-disable-next-line import/no-mutable-exports
let connectionPromise: ReturnType<Database['connect']> = new Promise(() => {});

const ConnectionString = process.env.MONGODB_URI!;
if (ConnectionString) {
    if (process.env.NODE_ENV === 'development') {
        const globalWithDatabase = global as typeof global & {
            _connectionPromise?: ReturnType<Database['connect']>;
        };

        if (!globalWithDatabase._connectionPromise) {
            database = new Database();
            globalWithDatabase._connectionPromise = database.connect(ConnectionString);
        }

        connectionPromise = globalWithDatabase._connectionPromise;
    } else {
        database = new Database();
        connectionPromise = database.connect(ConnectionString);
    }
}

export default connectionPromise;
