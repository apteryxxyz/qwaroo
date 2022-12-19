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
        // When in production, we use the MongoDB Atlas database
        // Otherwise we use an in-memory database for testing
        if (process.env['NODE_ENV'] === 'production') {
            console.info('Using production database');
            return process.env['MONGODB_URI'] as string;
        } else {
            // IDEA: It might be better to just use a different database name for testing
            console.info('Using in-memory database');
            const server = await MongoMemoryServer.create();
            return server.getUri();
        }
    }
}
