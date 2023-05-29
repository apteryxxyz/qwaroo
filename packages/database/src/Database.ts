import mongoose from 'mongoose';

/**
 * Database "wrapper" for mongoose.
 */
export class Database {
    /**
     * The existing connection to the database.
     */
    public connection?: mongoose.Connection;

    /**
     * Connect to the database.
     * @param connectionString The connection string to use.
     */
    public async connect(connectionString: string) {
        if (this.connection)
            throw new Error('Database connection already exists');
        await mongoose.connect(connectionString);
        this.connection = mongoose.connection;
        console.info('Connected to database');
    }

    /**
     * Disconnect from the database.
     */
    public async disconnect() {
        if (this.connection) {
            await this.connection.close();
            console.info('Disconnected from database');
            delete this.connection;
        }
    }
}
