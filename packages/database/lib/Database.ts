import { MongoMemoryServer } from 'mongodb-memory-server';
import { type Connection, connect } from 'mongoose';

// TODO: Add support for real MongoDB server

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
        const server = await MongoMemoryServer.create();
        return server.getUri();
    }
}
