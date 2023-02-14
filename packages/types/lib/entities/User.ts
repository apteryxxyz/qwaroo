import type { Base } from './Base';

export namespace User {
    export interface Entity extends Base.Entity {
        /** A display name, does not need to be unique. */
        displayName: string;
        /** A URL to the users avatar. */
        avatarUrl: string;
        /** The flags for this user. */
        flags: number;

        /** Reset this token to revoke all created tokens. */
        revokeToken: string;

        /** The timestamp when this user joined. */
        joinedTimestamp: number;
        /** The timestamp when this user last active. */
        lastSeenTimestamp: number;
    }

    export enum Flags {
        None = 0,
        Developer = 1 << 0,
        Moderator = 1 << 1,
        Verified = 1 << 2,
    }
}
