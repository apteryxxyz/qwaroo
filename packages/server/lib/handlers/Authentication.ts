import { ServerError as Error } from '@qwaroo/common';
import { Encryption } from './Encryption';
import { User } from '#/utilities/structures';

export class Authentication extends null {
    /** Create a new unique auth token, which can be used to login to the system. */
    public static createToken(userId: string, revokeToken: string) {
        return Encryption.encryptString(
            JSON.stringify({
                uid: userId,
                // Revoke token is used to invalidate all created tokens
                rvt: revokeToken,
                iat: Date.now(),
                exp: Date.now() + 1_000 * 60 * 60 * 24 * 365,
            })
        );
    }

    /** Attempt to decrypt and parse an auth token. */
    public static parseToken(token: string) {
        try {
            const data = Encryption.decryptString(token);
            return JSON.parse(data);
        } catch {
            return null;
        }
    }

    /** Login to the system with an auth token. */
    public static async loginWithToken(token: string) {
        const data = this.parseToken(token);
        if (!data || data.exp < Date.now())
            throw new Error(401, 'Authorisation token is not valid');

        const user = await User.Model.findById(data.uid).exec();
        if (!user || user.revokeToken !== data.rvt)
            throw new Error(401, 'Authorisation token is not valid');

        user.lastSeenTimestamp = Date.now();
        return user.save();
    }
}
