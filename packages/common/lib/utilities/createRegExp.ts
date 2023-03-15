import { CharacterList } from '#/constants/CharacterList';

/**
 * Convert a regular string into an regex, escaping all of the needed characters.
 */
export function createRegExp(pattern: string, scoped = false, flags = '') {
    const escaped = pattern.replaceAll(/[$()*+./?[\\\]^{|}-]/g, '\\$&');
    return new RegExp(scoped ? `^${escaped}$` : escaped, flags);
}

/** Create  a regex that must match a length. */
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
    export const DisplayName = createStringLengthRegExp(3, 40);
    export const AvatarURL = /^(http|https):\/\/.{1,1024}$/;

    // Game
    export const Slug = createStringLengthRegExp(3, 40, 'a-z0-9-');
    export const Title = createStringLengthRegExp(3, 40);
    export const ShortDescription = createStringLengthRegExp(10, 80);
    export const LongDescription = createStringLengthRegExp(100, 500);
    export const ThumbnailURL = /^(http|https):\/\/.{1,1024}$/;
    export const Category = createStringLengthRegExp(3, 32);
}
