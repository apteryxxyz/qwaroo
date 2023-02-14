import { TransliterationMap } from '#/constants/TransliterationMap';

export class Slug {
    /** Simple method of converting a string into a slug. */
    public static create(value: string) {
        return value
            .toLowerCase()
            .replaceAll(/[^\da-z-]/g, '-')
            .replaceAll(/-+/g, '-')
            .replaceAll(/^-|-$/g, '');
    }

    /** More advanced method of converting a string into a slug. */
    public static createWithTransliteration(value: string) {
        return value
            .toLowerCase()
            .replaceAll(/[^\da-z-]/g, match => {
                for (const [key, value] of Object.entries(TransliterationMap))
                    if (value.includes(match)) return key;
                return '-';
            })
            .replaceAll(/-+/g, '-')
            .replaceAll(/^-|-$/g, '');
    }
}
