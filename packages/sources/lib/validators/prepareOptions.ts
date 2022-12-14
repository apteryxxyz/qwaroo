import { validateValue } from './validateValue';
import type { Source } from '#/Source';

export function prepareOptions<O = Record<symbol | string, unknown>>(
    props: Record<keyof O, Source.Prop>,
    options: Record<keyof O, unknown>
): O {
    for (const [_key, prop] of Object.entries<Source.Prop>(props)) {
        const key = _key as keyof O;
        options[key] = validateValue(_key, options[key], prop);
    }

    return options as unknown as O;
}
