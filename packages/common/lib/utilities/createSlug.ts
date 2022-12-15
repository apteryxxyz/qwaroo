import { TransliterationMap } from '#/constants/TransliterationMap';

export function createSlug(input: string) {
    return input
        .toLowerCase()
        .replaceAll(/[^\da-z-]/g, '-')
        .replaceAll(/-+/g, '-')
        .replaceAll(/^-|-$/g, '');
}

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
