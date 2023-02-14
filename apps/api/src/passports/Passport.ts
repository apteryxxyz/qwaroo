import { URL } from 'node:url';
import { Connection, Encryption, User, getEnv } from '@qwaroo/server';
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
                const connection = await this.findOrCreateConnection(
                    refreshToken,
                    profile
                );
                const user = await connection.getUser();
                if (user) done(null, user);
            }
        );

        passport.use(strategy);
        refresh.use(strategy);

        passport.serializeUser((user, done) => done(null, user.id));
        passport.deserializeUser((id, done) => User.Model.findById(id, done));
    }

    public async findOrCreateConnection(
        refreshToken: string,
        profile: Profile,
        user?: User.Document
    ) {
        const connection = await Connection.Model.findOne({
            providerName: this.providerName,
            accountId: profile.id,
        }).exec();

        if (connection) {
            const user = await connection.getUser();
            if (user) return connection;
            await connection.remove();
        }

        const newUser =
            user ??
            new User.Model({
                displayName: this._formatDisplayName(profile),
                avatarUrl: this._formatAvatarUrl(profile),
            });

        const newConnection = new Connection.Model({
            userId: newUser.id,
            providerName: this.providerName,
            accountId: profile.id,
            accountUsername: this._formatUsername(profile),
            refreshToken: Encryption.encryptString(refreshToken),
        });

        await Promise.all([newUser.save(), newConnection.save()]);
        return newConnection;
    }

    public abstract _formatDisplayName(profile: Profile): string;
    public abstract _formatAvatarUrl(profile: Profile): string;
    public abstract _formatUsername(profile: Profile): string;

    public async fetchConnectionToken(connection: Connection.Document) {
        // TODO: Cache these access tokens
        return new Promise<string>((resolve, reject) => {
            refresh.requestNewAccessToken(
                this.providerName,
                Encryption.decryptString(connection.refreshToken),
                (err, accessToken) => {
                    if (err) reject(err);
                    else resolve(accessToken);
                }
            );
        });
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

/*
GET /auth/[provider]/login - Redirect to providers login page
GET /auth/[provider]/callback - Find or create user

PATCH /users/[id]/connections/[id] - Refresh a connections properties
DELETE /users/[id]/connections/[id] - Delete a connection from a user
*/
