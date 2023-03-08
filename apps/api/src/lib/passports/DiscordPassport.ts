import { getEnv } from '@qwaroo/server';
import { Strategy } from 'passport-discord';
import { Passport } from './Passport';

const ClientId = getEnv(String, 'DISCORD_APPLICATION_ID');
const ClientSecret = getEnv(String, 'DISCORD_OAUTH2_SECRET');

export class DiscordPassport extends Passport<Strategy.Profile> {
    public constructor() {
        super('discord', Strategy, {
            clientID: ClientId,
            clientSecret: ClientSecret,
            scope: ['identify'],
        });
    }

    public _formatDisplayName(profile: Strategy.Profile) {
        return profile.username;
    }

    public _formatAvatarUrl(profile: Strategy.Profile) {
        if (profile.avatar === null) {
            const defaultAvatarNumber =
                Number.parseInt(profile.discriminator, 10) % 5;
            return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
        } else {
            const format = profile.avatar.startsWith('a_') ? 'gif' : 'png';
            return `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
        }
    }

    public _formatUsername(profile: Strategy.Profile) {
        return `${profile.username}#${profile.discriminator}`;
    }
}
