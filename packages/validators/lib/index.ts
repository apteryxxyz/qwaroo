const CharacterList = " \u00C0-\u01FFA-Z0-9'.,/#!$%^&*;:{}=-_`~()-";
const StringWithLength = (
    min: number,
    max?: number,
    charList = CharacterList
) => new RegExp(`^[${charList}]{${min}${max ? `,${max}` : ''}}$`, 'i');

export namespace Validate {
    // Document
    export const ObjectId = /^[\da-f]{24}$/;

    // User
    export const DisplayName = StringWithLength(4, 32);
    export const AvatarUrl = /^(http|https):\/\/[^ "]+$/;

    // Game
    export const Slug = StringWithLength(3, 32, 'a-z0-9-');
}

export function createRegExp(pattern: string, scoped = false, flags = '') {
    const escaped = pattern.replaceAll(/[$()*+./?[\\\]^{|}-]/g, '\\$&');
    return new RegExp(scoped ? `^${escaped}$` : escaped, flags);
}
