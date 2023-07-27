import 'reflect-metadata';
import '@qwaroo/env';
import { Database } from './database';

export * from './database';
export * from './models/connection';
export * from './models/file';
export * from './models/game';
export * from './models/activity';
export * from './models/user';
export * from './models/subdocuments/score';

/** Shorthand for connecting. */
export async function connect() {
  await Database.getInstance().connect();
}
