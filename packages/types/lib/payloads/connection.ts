import type { Connection } from '#/entities/Connection';

export type APIConnection = Omit<Connection.Entity, 'refreshToken'>;
