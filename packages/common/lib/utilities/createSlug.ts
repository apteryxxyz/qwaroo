import { TransliterationMap } from '#/constants/TransliterationMap';

/** Simple method of converting a string into a slug. */
export function createSlug(input: string) {
    return input
        .toLowerCase()
        .replaceAll(/[^\da-z-]/g, '-')
        .replaceAll(/-+/g, '-')
        .replaceAll(/^-|-$/g, '');
}

/** More advanced method of converting a string into a slug. */
export function createSlugWithTransliteration(input: string) {
    return input
        .toLowerCase()
        .replaceAll(/[^\da-z-]/g, match => {
            for (const [key, value] of Object.entries(TransliterationMap))
                if (value.includes(match)) return key;
            return '-';
        })
        .replaceAll(/-+/g, '-')
        .replaceAll(/^-|-$/g, '');
}
