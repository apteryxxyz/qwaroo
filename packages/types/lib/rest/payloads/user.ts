import type { User } from '#/models/User';

export type APIUser = Omit<User, 'revokeToken'>;
