import mongoose from 'mongoose';

/** Database connection. */
export class Database {
    public connection!: typeof mongoose;

    /** Connect to the MongoDB server. */
    public async connect(uri: string) {
        this.connection = await mongoose.connect(uri);
        console.info('Connected to database');
    }

    /** Disconnect from the MongoDB server. */
    public async disconnect() {
        if (this.connection) {
            await this.connection.disconnect();
            console.info('Disconnected from database');
        }
    }
}
