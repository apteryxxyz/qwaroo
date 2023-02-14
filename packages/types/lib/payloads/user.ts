import type { FetchPageOptions } from './common';
import type { User } from '#/entities/User';

export type APIUser = Omit<User.Entity, 'revokeToken'>;

export interface FetchUsersOptions extends FetchPageOptions {
    ids?: string[];

    term?: string;
    sort?: 'joinedTimestamp' | 'lastSeenTimestamp';
    order?: 'asc' | 'desc';
}
