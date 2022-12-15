import type { Connection } from '#/models/Connection';

export type APIConnection = Omit<Connection, 'refreshToken'>;
