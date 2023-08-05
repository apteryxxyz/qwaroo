/** @file The database adapter for next-auth to our MongoDB setup. */

import { Connection, User } from '@qwaroo/database';
import type { Adapter } from 'next-auth/adapters';
import {
  toAuthAccountFromDocumentConnection,
  toAuthUserFromDocumentUser,
  toConnectionDocumentFromAuthAccount,
  toDocumentUserFromAuthUser,
  toPartialDocumentUserFromAuthUser,
} from './formatters';

export function AuthAdapter() {
  return {
    async createUser(data) {
      const template = toDocumentUserFromAuthUser(data);
      const user = await User.Model.create(template);
      return toAuthUserFromDocumentUser(user);
    },

    async getUser(id) {
      const user = await User.Model.findById(id);
      return user ? toAuthUserFromDocumentUser(user) : null;
    },

    async getUserByEmail(email) {
      const user = await User.Model.findOne({ emailAddress: email });
      return user ? toAuthUserFromDocumentUser(user) : null;
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const connection = await Connection.Model.findOne({
        providerId: provider,
        accountId: providerAccountId,
      }).populate<{ user: User.Document }>('user');

      if (!connection) return null;
      return toAuthUserFromDocumentUser(connection.user);
    },

    async updateUser(data) {
      const template = toPartialDocumentUserFromAuthUser(data);
      const user = await User.Model.findByIdAndUpdate(data.id, template, {
        returnDocument: 'after',
      });
      return toAuthUserFromDocumentUser(user!);
    },

    async deleteUser(id) {
      await Promise.all([
        Connection.Model.deleteMany({ user: id }),
        User.Model.findByIdAndDelete(id),
      ]);
    },

    async linkAccount(account) {
      const template = toConnectionDocumentFromAuthAccount(account);
      const connection = await Connection.Model.create(template);
      return toAuthAccountFromDocumentConnection(connection);
    },

    async unlinkAccount({ provider, providerAccountId }) {
      const connection = await Connection.Model.findOneAndDelete(
        {
          providerId: provider,
          accountId: providerAccountId,
        },
        { returnDocument: 'after' },
      );
      return connection
        ? toAuthAccountFromDocumentConnection(connection)
        : undefined;
    },

    // * The following methods are required by next-auth but we don't use sessions.

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createSession(data): any {
      void data;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getSessionAndUser(sessionToken): any {
      void sessionToken;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateSession(data): any {
      void data;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deleteSession(sessionToken): any {
      void sessionToken;
    },
  } satisfies Adapter;
}
