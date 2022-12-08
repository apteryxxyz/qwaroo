export interface User {
    /** The unique identifier for this user. */
    id: string;
    /** Reset this token to revoke all created tokens. */
    revokeToken: string;
    /** A display name, does not need to be unique. */
    displayName: string;
    /** A URL to the users avatar. */
    avatarUrl: string;
    /** The timestamp when this user joined. */
    joinedTimestamp: number;
    /** The timestamp when this user last logged in. */
    seenTimestamp: number;
}
