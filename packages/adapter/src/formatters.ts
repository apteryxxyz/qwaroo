/** @file Formatters for converting between the database models and the next-auth models. */

import { Connection, User } from '@qwaroo/database';
import { Types } from 'mongoose';
import type { AdapterAccount, AdapterUser } from 'next-auth/adapters';
import type { ProviderType } from 'next-auth/providers';

/** USER */

export function toAuthUserFromDocumentUser(document: User.Document) {
  return {
    id: document.id as string,
    name: document.displayName,
    email: document.emailAddress,
    emailVerified: document.emailVerifiedAt ?? null,
    image: document.avatarUrl,
  };
}

export function toDocumentUserFromAuthUser(data: Omit<AdapterUser, 'id'>) {
  const user = new User();
  user.displayName = data.name ?? 'Default';
  user.emailAddress = data.email;
  user.emailVerifiedAt = data.emailVerified ?? undefined;
  user.avatarUrl = data.image ?? undefined;
  return user;
}

export function toPartialDocumentUserFromAuthUser(
  data: Partial<Omit<AdapterUser, 'id'>>,
) {
  const user = new User();
  if (data.name) user.displayName = data.name;
  if (data.email) user.emailAddress = data.email;
  if (data.emailVerified) user.emailVerifiedAt = data.emailVerified;
  if (data.image) user.avatarUrl = data.image;
  return user;
}

/** ACCOUNT */

export function toAuthAccountFromDocumentConnection(
  document: Connection.Document,
): AdapterAccount {
  return {
    userId: document.user.id as string,
    type: document.providerType as ProviderType,
    provider: document.providerType,
    providerAccountId: document.accountId,
  };
}

export function toConnectionDocumentFromAuthAccount(data: AdapterAccount) {
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
    expiresAt: data.expires_at,
    scope: data.scope,
  };

  return connection;
}
