import { Connection, User } from '@qwaroo/database';
import type { Adapter } from 'next-auth/adapters';
import {
    toAuthAccountFrom,
    toAuthUserFrom,
    toDocumentAccountFrom,
    toDocumentUserFrom,
    toPartialDocumentUserFrom,
} from './formatters';

export function AuthAdapter(database: Promise<unknown>): Adapter {
    return {
        async createUser(data) {
            await database;
            const template = toDocumentUserFrom(data);
            const user = await User.Model.create(template);
            return toAuthUserFrom(user);
        },

        async getUser(id) {
            await database;
            const user = await User.Model.findById(id);
            return user ? toAuthUserFrom(user) : null;
        },

        async getUserByEmail(email) {
            await database;
            const user = await User.Model.findOne({ emailAddress: email });
            return user ? toAuthUserFrom(user) : null;
        },

        async getUserByAccount({ provider, providerAccountId }) {
            await database;
            const connection = await Connection.Model.findOne({
                providerId: provider,
                accountId: providerAccountId,
            })
                .populate('user')
                .exec();

            if (!connection) return null;
            const user = connection.user as User.Document;
            return toAuthUserFrom(user);
        },

        async updateUser(data) {
            if (!data.id) throw new Error('User ID is missing');
            await database;
            const template = toPartialDocumentUserFrom(data);
            const user = await User.Model.findByIdAndUpdate(data.id, template, {
                returnDocument: 'after',
            });
            return toAuthUserFrom(user!);
        },

        async deleteUser(id) {
            await database;
            await Promise.all([
                Connection.Model.deleteMany({ user: id }),
                // Session.Model.deleteMany({ user: id }),
                User.Model.findByIdAndDelete(id),
            ]);
        },

        async linkAccount(account) {
            await database;
            const template = toDocumentAccountFrom(account);
            const connection = await Connection.Model.create(template);
            return toAuthAccountFrom(connection);
        },

        async unlinkAccount({ provider, providerAccountId }) {
            await database;
            const connection = await Connection.Model.findOneAndDelete({
                providerId: provider,
                accountId: providerAccountId,
            });
            return connection ? toAuthAccountFrom(connection) : undefined;
        },

        async createSession(data): Promise<any> {
            void data;
        },

        async getSessionAndUser(sessionToken): Promise<any> {
            void sessionToken;
        },

        async updateSession(data): Promise<any> {
            void data;
        },

        async deleteSession(sessionToken): Promise<any> {
            void sessionToken;
        },
    };
}
