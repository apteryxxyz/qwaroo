import type { Base } from './Base';

export namespace Connection {
    export interface Entity extends Base.Entity {
        /** The ID of the user that this connection belongs to. */
        userId: string;

        /** The name of the provider this connection is for. */
        providerName: ProviderName;
        /** This connections identifier within the provider. */
        accountId: string;
        /** This connections username within the provider. */
        accountUsername: string;

        /** The refresh token for this connections provider. */
        refreshToken?: string;

        /** The timestamp when this connection was linked. */
        linkedTimestamp: number;
    }

    export type ProviderName = 'discord' | 'reddit';
}
