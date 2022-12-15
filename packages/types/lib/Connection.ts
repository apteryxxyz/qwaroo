/** A connection data structure. */
export interface Connection {
    /** The unique identifier for this connection. */
    id: string;
    /** The ID of the user that this connection belongs to. */
    userId: string;

    // NOTE: Ensure new provider names are added to the providerName type
    /** The name of the provider this connection is for. */
    providerName: 'discord' | 'github';
    /** This connections identifier within the provider. */
    accountId: string;
    /** This connections username within the provider. */
    accountUsername: string;
    /** The refresh token for this connections provider. */
    refreshToken: string;

    /** The timestamp when this connection was linked. */
    linkedTimestamp: number;
}
