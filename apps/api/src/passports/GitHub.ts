import process from 'node:process';
import { URL } from 'node:url';
import { Connection, User, type UserDocument } from '@qwaroo/database';
import { Routes } from '@qwaroo/types';
import passport from 'passport';
import type { VerifyCallback } from 'passport-oauth2';
import { Encryption } from '#/handlers/Encryption';
// No types
const { Strategy } = require('passport-github2');

export class GitHubPassport {
    public constructor() {
        passport.use(
            new Strategy(
                {
                    clientID: process.env['GITHUB_APPLICATION_ID']!,
                    clientSecret: process.env['GITHUB_OAUTH2_SECRET']!,
                    callbackURL: new URL(
                        Routes.authCallback('github'),
                        process.env['API_URL']!
                    ).toString(),
                },
                this._findOrCreate.bind(this)
            )
        );

        passport.serializeUser(this._serializeUser);
        passport.deserializeUser(this._deserializeUser);
    }

    private async _findOrCreate(
        _accessToken: string,
        refreshToken: string,
        profile: Record<string, unknown>,
        done: VerifyCallback
    ) {
        profile = profile['_json'] as Record<string, unknown>;

        const connection = await Connection.findOne({
            accountId: String(profile['id']),
        }).exec();

        if (connection) {
            const user = await User.findById(connection.userId).exec();
            // TODO: Add ability to refresh a connections properties (accountUsername)
            if (user) {
                done(null, user);
                return;
            }

            await connection.remove();
        }

        const newUser = new User({
            displayName: profile['name'] ?? profile['login'],
            avatarUrl: profile['avatar_url'],
        });

        const newConnection = new Connection({
            userId: newUser.id,
            providerName: 'github',
            accountId: String(profile['id']),
            accountUsername: profile['login'],
            refreshToken: Encryption.encryptString(refreshToken),
        });

        await Promise.all([newUser.save(), newConnection.save()]);
        done(null, newUser);
    }

    private _serializeUser(
        user: UserDocument,
        done: (err: Error | null, id?: string) => void
    ) {
        done(null, user.id);
    }

    private _deserializeUser(
        id: string,
        done: (err: Error | null, user?: UserDocument) => void
    ) {
        void User.findById(id, done);
    }
}
