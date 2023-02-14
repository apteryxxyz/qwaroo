import { getEnv } from '@qwaroo/server';
import { Passport } from './Passport';
// No types
const { Strategy } = require('passport-reddit');

const ClientId = getEnv(String, 'REDDIT_APPLICATION_ID');
const ClientSecret = getEnv(String, 'REDDIT_OAUTH2_SECRET');

interface Profile {
    provider: string;
    id: string;
    name: string;
    displayName: string;
    _json: {
        icon_img: string;
    };
}

export class RedditPassport extends Passport<Profile> {
    public constructor() {
        super('reddit', Strategy, {
            clientID: ClientId,
            clientSecret: ClientSecret,
        });
    }

    public _formatDisplayName(profile: Profile) {
        return profile.name;
    }

    public _formatAvatarUrl(profile: Profile) {
        return (
            profile._json.icon_img?.split('?')[0] ??
            'https://www.redditstatic.com/avatars/avatar_default_02_24A0ED.png'
        );
    }

    public _formatUsername(profile: Profile) {
        return profile.name;
    }
}
