import { User } from '@owenii/database';
import { Encryption } from './Encryption';
import { APIError } from '#/utilities/APIError';

export class Authentication extends null {
    /** Create a new unique auth token for a user. */
    public static createToken(userId: string, revokeToken: string) {
        return Encryption.encryptString(
            JSON.stringify({
                uid: userId,
                // Revoke token is used to invalidate all created tokens
                rvt: revokeToken,
                iat: Date.now(),
                exp: Date.now() + 1_000 * 60 * 60 * 24 * 7,
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
        if (!data) throw new APIError(401, 'Authorisation token is invalid');

        const isExpired = data.exp < Date.now();
        if (isExpired)
            throw new APIError(401, 'Authorisation token is expired');

        const user = await User.findById(data.uid).exec();
        if (!user)
            throw new APIError(401, 'Authorisation token user does not exist');

        const isRevoked = user.revokeToken !== data.rvt;
        if (isRevoked)
            throw new APIError(401, 'Authorisation token has been revoked');

        user.seenTimestamp = Date.now();
        return user.save();
    }
}
