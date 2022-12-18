import process from 'node:process';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { type Connection, connect } from 'mongoose';

/** Database connection. */
export class Database {
    public connection!: Connection;

    /** Connect to the MongoDB server. */
    public async connect() {
        const uri = await this.generateDatabaseUri();
        this.connection = (await connect(uri)) as unknown as Connection;
        console.info('Connected to database');
    }

    /** Disconnect from the MongoDB server. */
    public async disconnect() {
        if (this.connection) {
            await this.connection.close();
            console.info('Disconnected from database');
        }
    }

    /** Get the connection URI for the MongoDB server. */
    public async generateDatabaseUri() {
        if (process.env['APP_ENV'] === 'production') {
            console.info('Using production database');
            return process.env['MONGODB_URI'] as string;
        } else {
            console.info('Using in-memory database');
            const server = await MongoMemoryServer.create();
            return server.getUri();
        }
    }
}
