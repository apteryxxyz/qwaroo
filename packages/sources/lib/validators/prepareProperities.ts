import { validateValue } from './validateValue';
import type { Source } from '#/structures/Source';

/** Prepare an options object for fetching. */
export function prepareProperities<P = Record<string, unknown>>(
    props: Record<keyof P, Source.Prop>,
    options: Partial<P>
): P {
    for (const [_key, prop] of Object.entries<Source.Prop>(props)) {
        const key = _key as keyof P;
        const value = validateValue(options, _key, options[key], prop);
        options[key] = value as P[keyof P];
    }

    return options as unknown as P;
}
