import type { Connection } from 'mongoose';
import mongoose from 'mongoose';

/** Database connection manager, singleton. */
export class Database {
  private static _instance: Database;
  private _connection: Connection;

  private constructor() {
    if (Database._instance) throw new Error('Database is a singleton');
    mongoose.set('debug', process.env.NODE_ENV === 'development');
    this._connection = mongoose.connection;
  }

  /** Grab the instance of this singleton class. */
  public static getInstance() {
    if (!Database._instance) Database._instance = new Database();
    return Database._instance;
  }

  /** Attempt to connect to MongoDB. */
  public async connect() {
    console.info('[Database] Connecting to MongoDB Atlas');

    switch (this._connection.readyState) {
      case mongoose.STATES.disconnected: {
        console.info('[Database] Attempting to connect to MongoDB Atlas');
        await mongoose.connect(process.env.MONGODB_ATLAS_URL, {});
        return this._connection;
      }

      case mongoose.STATES.connecting: {
        await this._waitForDatabase();
        return this._connection;
      }

      case mongoose.STATES.connected: {
        return this._connection;
      }

      default:
        throw new Error('Unknown mongoose connection state');
    }
  }

  private async _waitForDatabase(): Promise<void> {
    while (this._connection.readyState !== mongoose.STATES.connected)
      await new Promise((resolve) => setTimeout(resolve, 100));
  }
}
