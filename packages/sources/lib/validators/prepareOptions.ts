import { validateValue } from './validateValue';
import type { Source } from '#/Source';

/** Prepare an options object for fetching. */
export function prepareOptions<O = Record<string, unknown>>(
    props: Record<keyof O, Source.Prop>,
    options: Partial<O>
): O {
    for (const [_key, prop] of Object.entries<Source.Prop>(props)) {
        const key = _key as keyof O;
        const value = validateValue(options, _key, options[key], prop);
        options[key] = value as O[keyof O];
    }

    return options as unknown as O;
}
