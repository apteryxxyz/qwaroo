import process from 'node:process';
import { URL } from 'node:url';
import { Connection, User, type UserDocument } from '@qwaroo/database';
import { Routes } from '@qwaroo/types';
import passport from 'passport';
import type { VerifyCallback } from 'passport-oauth2';
import { Encryption } from '#/handlers/Encryption';
// No types
const { Strategy } = require('passport-reddit');

export class RedditPassport {
    public constructor() {
        passport.use(
            new Strategy(
                {
                    clientID: process.env['REDDIT_APPLICATION_ID']!,
                    clientSecret: process.env['REDDIT_OAUTH2_SECRET']!,
                    callbackURL: new URL(
                        Routes.authCallback('reddit'),
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
        const connection = await Connection.findOne({
            accountId: String(profile['id']),
        }).exec();

        if (connection) {
            const user = await User.findById(connection.userId).exec();

            if (user) {
                done(null, user);
                return;
            }

            await connection.remove();
        }

        const newUser = new User({
            displayName: profile['name'],
            avatarUrl: (
                Reflect.get(profile['_json'] as {}, 'icon_img') ??
                'https://www.redditstatic.com/avatars/avatar_default_02_24A0ED.png'
            )?.split('?')[0],
        });

        const newConnection = new Connection({
            providerName: 'reddit',
            userId: newUser.id,
            accountId: String(profile['id']),
            accountUsername: profile['name'],
            refreshToken: Encryption.encryptString(refreshToken),
        });

        await newUser.save();
        await newConnection.save();
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
