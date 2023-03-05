import mongoose from 'mongoose';

/** Database connection. */
export class Database {
    public mongoose!: typeof mongoose;

    public get connection() {
        return this.mongoose.connection;
    }

    /** Connect to the MongoDB server. */
    public async connect(uri: string) {
        this.mongoose = await mongoose.connect(uri);
        console.info('Connected to database');
    }

    /** Disconnect from the MongoDB server. */
    public async disconnect() {
        if (this.mongoose) {
            await this.mongoose.disconnect();
            console.info('Disconnected from database');
        }
    }
}
