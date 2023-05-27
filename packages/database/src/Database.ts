import mongoose from 'mongoose';

export class Database {
    public connection?: mongoose.Connection;

    public async connect(connectionString: string) {
        if (this.connection)
            throw new Error('Database connection already exists');
        await mongoose.connect(connectionString);
        this.connection = mongoose.connection;
        console.info('Connected to database');
    }

    public async disconnect() {
        if (this.connection) {
            await this.connection.close();
            console.info('Disconnected from database');
            delete this.connection;
        }
    }
}
