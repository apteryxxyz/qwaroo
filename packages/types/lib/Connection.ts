export interface BaseConnection {
    /** The unique identifier for this connection. */
    id: string;
    /** The ID of the user that owns this connection. */
    userId: string;
    /** The name of the provider this connection is for. */
    providerName: string;
    /** This connections identifier within the provider. */
    accountId: string;
    /** This connections username within the provider. */
    accountUsername: string;
    /** The timestamp when this connection was linked. */
    linkedTimestamp: number;
}

export interface DiscordConnection extends BaseConnection {
    providerName: 'discord';
    refreshToken: string;
}

export type Connection = DiscordConnection;
