import { CharacterList } from '#/constants/CharacterList';

export function createRegExp(pattern: string, scoped = false, flags = '') {
    const escaped = pattern.replaceAll(/[$()*+./?[\\\]^{|}-]/g, '\\$&');
    return new RegExp(scoped ? `^${escaped}$` : escaped, flags);
}

export function createStringLengthRegExp(
    min: number,
    max?: number,
    charList = CharacterList
) {
    return new RegExp(`^[${charList}]{${min}${max ? `,${max}` : ''}}$`, 'i');
}

export namespace Validate {
    // MongoDB
    export const ObjectId = /^[\da-f]{24}$/;

    // User
    export const DisplayName = createStringLengthRegExp(4, 32);
    export const AvatarURL = /^(http|https):\/\/[^ "]+$/;

    // Game
    export const Slug = createStringLengthRegExp(3, 32, 'a-z0-9-');
    export const Title = createStringLengthRegExp(3, 32);
    export const ShortDescription = createStringLengthRegExp(3, 64);
    export const LongDescription = createStringLengthRegExp(3, 256);
    export const ThumbnailURL = /^(http|https):\/\/[^ "]+$/;
}
