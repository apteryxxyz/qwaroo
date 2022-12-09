import process from 'node:process';
import { Connection, User, type UserDocument } from '@owenii/database';
import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import type { VerifyCallback } from 'passport-oauth2';

export class DiscordPassport {
    public constructor() {
        passport.use(
            new DiscordStrategy(
                {
                    clientID: process.env['DISCORD_APPLICATION_ID']!,
                    clientSecret: process.env['DISCORD_OAUTH2_SECRET']!,
                    callbackURL: process.env['DISCORD_OAUTH2_CALLBACK_URL']!,
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
        profile: DiscordStrategy.Profile,
        done: VerifyCallback
    ) {
        const connection = await Connection.findOne({
            accountId: profile.id,
        }).exec();

        if (connection) {
            const user = await User.findById(connection.userId).exec();
            // TODO: add ability to refresh a connections properties (accountUsername)
            if (user) return done(null, user);

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
            refreshToken,
        });

        await Promise.all([newUser.save(), newConnection.save()]);
        return done(null, newUser);
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

    private _createUserAvatarUrl(profile: DiscordStrategy.Profile) {
        if (profile.avatar === null) {
            const defaultAvatarNumber =
                Number.parseInt(profile.discriminator, 10) % 5;
            return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
        } else {
            const format = profile.avatar.startsWith('a_') ? 'gif' : 'png';
            return `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
        }
    }

    private _createUserTag(profile: DiscordStrategy.Profile) {
        return `${profile.username}#${profile.discriminator}`;
    }
}
