import { Connection, Users } from '@qwaroo/server';
import type { User } from 'discord.js';

export class Handler extends null {
    public static async getUserFromAccountId(accountId: string) {
        const connection = await Connection.Model.findOne({
            providerName: 'discord',
            accountId,
        }).exec();
        if (!connection) return null;
        return connection.getUser();
    }

    public static async findOrCreateUser(user: User) {
        const existing = await this.getUserFromAccountId(user.id);
        if (existing) return existing;

        return Users.ensureUser(
            'discord',
            user.id,
            user.tag,
            user.username,
            user.displayAvatarURL()
        );
    }
}
