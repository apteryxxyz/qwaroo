import type { User } from '#/models/User';

export type APIUser = Omit<User, 'revokeToken'>;

export interface FetchUsersOptions {
    term: string;
    limit?: number;
    skip?: number;
}
