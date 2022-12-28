/** A user data structure. */
export interface User {
    /** The unique identifier for this user. */
    id: string;
    /** Reset this token to revoke all created tokens. */
    revokeToken: string;

    /** The flags for this user. */
    publicFlags: number;

    /** A display name, does not need to be unique. */
    displayName: string;
    /** A URL to the users avatar. */
    avatarUrl: string;

    /** The timestamp when this user joined. */
    joinedTimestamp: number;
    /** The timestamp when this user last active. */
    seenTimestamp: number;
}

export namespace User {
    export enum Flags {
        None = 0,
        Developer = 1 << 0,
        Moderator = 1 << 1,
        Verified = 1 << 2,
        Creator = 1 << 3,
        Disabled = 1 << 4,
    }
}
