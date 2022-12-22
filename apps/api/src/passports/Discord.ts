import process from 'node:process';
import { Connection, User, type UserDocument } from '@owenii/database';
import passport from 'passport';
import { Strategy } from 'passport-discord';
import type { VerifyCallback } from 'passport-oauth2';
import { Encryption } from '#/handlers/Encryption';

export class DiscordPassport {
    public constructor() {
        passport.use(
            new Strategy(
                {
                    clientID: process.env['DISCORD_APPLICATION_ID']!,
                    clientSecret: process.env['DISCORD_OAUTH2_SECRET']!,
                    callbackURL:
                        process.env['API_URL']! + '/auth/discord/callback',
                    scope: ['identify'],
                },
                this._findOrCreate.bind(this)
            )
        );

        passport.serializeUser(this._serializeUser);
        passport.deserializeUser(this._deserializeUser);
    }

    public login() {
        return passport.authenticate('discord', { session: false });
    }

    public callback() {
        return passport.authenticate('discord', {
            failureRedirect: '/login',
            session: false,
        });
    }

    private async _findOrCreate(
        _accessToken: string,
        refreshToken: string,
        profile: Strategy.Profile,
        done: VerifyCallback
    ) {
        const connection = await Connection.findOne({
            accountId: profile.id,
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
            displayName: profile.username,
            avatarUrl: this._createUserAvatarUrl(profile),
        });

        const newConnection = new Connection({
            userId: newUser.id,
            providerName: 'discord',
            accountId: profile.id,
            accountUsername: this._createUserTag(profile),
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

    private _createUserAvatarUrl(profile: Strategy.Profile) {
        if (profile.avatar === null) {
            const defaultAvatarNumber =
                Number.parseInt(profile.discriminator, 10) % 5;
            return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
        } else {
            const format = profile.avatar.startsWith('a_') ? 'gif' : 'png';
            return `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
        }
    }

    private _createUserTag(profile: Strategy.Profile) {
        return `${profile.username}#${profile.discriminator}`;
    }
}
