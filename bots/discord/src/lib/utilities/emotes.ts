import type { APIMessageComponentEmoji, Snowflake } from 'discord.js';

export const Emotes = {
    qwaroo: '1083290116920975431',

    developer: '1083591454003298414',
    moderator: '1083591452224917504',
    verified: '1083591448861085716',

    check: '1083618759798951986',
    cross: '1083618756670005309',
} as const;

export const UnicodeEmotes = {
    joy: '😂',
} as const;

export function getEmoji<T extends keyof typeof Emotes>(
    name: T
): `<:${T}:${Snowflake}>`;
export function getEmoji(name: keyof typeof UnicodeEmotes): string;
export function getEmoji<T extends string>(name: T): `:${T}:`;
export function getEmoji(name: string) {
    if (name in Emotes) {
        const value = Reflect.get(Emotes, name);
        return `<:${name}:${value}>`;
    } else if (name in UnicodeEmotes) {
        return Reflect.get(UnicodeEmotes, name);
    } else return `:${name}:`;
}

export function getApiEmoji(
    name: keyof typeof Emotes | keyof typeof UnicodeEmotes
): APIMessageComponentEmoji {
    if (name in Emotes) {
        const value = Reflect.get(Emotes, name);
        return { id: value, name };
    } else if (name in UnicodeEmotes) {
        const value = Reflect.get(UnicodeEmotes, name);
        return { name: value };
    }

    return { name };
}
