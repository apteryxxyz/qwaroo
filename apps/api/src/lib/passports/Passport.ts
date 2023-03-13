import { URL } from 'node:url';
import { Encryption, User, Users, getEnv } from '@qwaroo/server';
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

        passport.use(this.providerName, strategy);
        refresh.use(this.providerName, strategy);

        passport.serializeUser((user, done) => done(null, user.id));
        passport.deserializeUser((id, done) => User.Model.findById(id, done));
    }

    public async findOrCreateUser(refreshToken: string, profile: Profile) {
        return Users.ensureAndRefreshUser(
            this.providerName,
            profile.id,
            this.formatUsername(profile),
            this.formatDisplayName(profile),
            this.formatAvatarUrl(profile),
            Encryption.encryptString(refreshToken)
        );
    }

    public abstract formatDisplayName(profile: Profile): string;
    public abstract formatAvatarUrl(profile: Profile): string;
    public abstract formatUsername(profile: Profile): string;
}
