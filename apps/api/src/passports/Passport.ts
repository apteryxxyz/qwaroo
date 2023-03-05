import { URL } from 'node:url';
import { Connection, Encryption, User, getEnv, Users } from '@qwaroo/server';
import { APIRoutes } from '@qwaroo/types';
import passport from 'passport';
import type * as oauth2 from 'passport-oauth2';
import refresh from 'passport-oauth2-refresh';

const APIUrl = getEnv(String, 'API_URL');

export abstract class Passport<Profile extends Omit<passport.Profile, 'name'>> {
    public readonly providerName: string;

    public constructor(
        providerName: string,
        Strategy: typeof oauth2.Strategy,
        options: Record<string, unknown>
    ) {
        this.providerName = providerName;

        const strategy = new Strategy(
            {
                callbackURL: new URL(
                    APIRoutes.authCallback(providerName),
                    APIUrl
                ).toString(),
                ...options,
            } as unknown as oauth2.StrategyOptions,
            async (
                _: string,
                refreshToken: string,
                profile: Profile,
                done: oauth2.VerifyCallback
            ) => {
                const user = await this.findOrCreateUser(refreshToken, profile);
                if (user) done(null, user);
            }
        );

        passport.use(strategy);
        refresh.use(strategy);

        passport.serializeUser((user, done) => done(null, user.id));
        passport.deserializeUser((id, done) => User.Model.findById(id, done));
    }

    public async findOrCreateUser(refreshToken: string, profile: Profile) {
        return Users.ensureUser(
            this.providerName,
            profile.id,
            this._formatUsername(profile),
            this._formatDisplayName(profile),
            this._formatAvatarUrl(profile),
            Encryption.encryptString(refreshToken)
        );
    }

    public abstract _formatDisplayName(profile: Profile): string;
    public abstract _formatAvatarUrl(profile: Profile): string;
    public abstract _formatUsername(profile: Profile): string;

    public async fetchConnectionToken(connection: Connection.Document) {
        if (!connection.refreshToken) throw new Error('No refresh token found');

        // TODO: Cache these access tokens
        return new Promise<string>((resolve, reject) =>
            refresh.requestNewAccessToken(
                this.providerName,
                Encryption.decryptString(connection.refreshToken!),
                (err, accessToken) => {
                    if (err) reject(err);
                    else resolve(accessToken);
                }
            )
        );
    }

    public async fetchProfile(accessToken: string) {
        return new Promise<Profile>((resolve, reject) => {
            passport.authenticate(this.providerName, (err, profile) => {
                if (err) reject(err);
                else resolve(profile);
            })({} as unknown, {} as unknown, () => void 0, {
                query: { access_token: accessToken },
            });
        });
    }
}
