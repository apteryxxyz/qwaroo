import { Connection } from '@qwaroo/server';

export class Handler extends null {
    public static async getUserFromAccountId(accountId: string) {
        const connection = await Connection.Model.findOne({
            providerName: 'discord',
            accountId,
        }).exec();
        if (!connection) return null;
        return connection.getUser();
    }
}
