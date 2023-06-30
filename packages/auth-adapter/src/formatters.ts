import { Connection, User } from '@qwaroo/database';
import { Types } from 'mongoose';
import type { AdapterAccount, AdapterUser } from 'next-auth/adapters';
import type { ProviderType } from 'next-auth/providers';

/** USER */

export function toAuthUserFrom(document: User.Document): AdapterUser {
    return {
        id: document.id,
        name: document.displayName,
        email: document.emailAddress,
        emailVerified: document.emailVerifiedTimestamp
            ? new Date(document.emailVerifiedTimestamp)
            : null,
        image: document.avatarUrl,
    };
}

export function toDocumentUserFrom(data: Omit<AdapterUser, 'id'>) {
    const user = new User();
    user.displayName = data.name ?? 'Default';
    user.emailAddress = data.email;
    user.emailVerifiedTimestamp = data.emailVerified?.getTime();
    user.avatarUrl = data.image ?? undefined;
    return user;
}

export function toPartialDocumentUserFrom(
    data: Partial<Omit<AdapterUser, 'id'>>
) {
    const user = new User();
    if (data.name) user.displayName = data.name;
    if (data.email) user.emailAddress = data.email;
    if (data.emailVerified)
        user.emailVerifiedTimestamp = data.emailVerified.getTime();
    if (data.image) user.avatarUrl = data.image;
    return user;
}

/** ACCOUNT */

export function toAuthAccountFrom(
    document: Connection.Document
): AdapterAccount {
    return {
        userId: document.user.id,
        type: document.providerType as ProviderType,
        provider: document.providerType,
        providerAccountId: document.accountId,
    };
}

export function toDocumentAccountFrom(data: AdapterAccount) {
    const connection = new Connection();
    connection.providerId = data.provider;
    connection.providerType = data.type;
    connection.accountId = data.providerAccountId;
    connection.user = new Types.ObjectId(data.userId);

    connection.tokenData = {
        accessToken: data.access_token,
        tokenType: data.token_type,
        refreshToken: data.refresh_token,
        idToken: data.id_token,
        expiresAt: data.expires_at ? new Date(data.expires_at) : undefined,
        scope: data.scope,
    };

    return connection;
}
