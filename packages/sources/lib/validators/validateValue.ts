import { URL } from 'node:url';
import { Source } from '#/Source';

export interface ValidateOptions {
    type: Source.Prop.Type | [Source.Prop.Type];
    required: ((this: Record<string, unknown>) => boolean) | boolean;
    default?: unknown;
}

export type ValidateArgs = [
    record: Record<string, unknown>,
    prop: string,
    value: unknown,
    options: ValidateOptions
];

function _error(prop: string, type: string, value: unknown = 'empty') {
    if (!value && !type) return new Error(`Missing ${type} for "${prop}"`);
    return new Error(`Invalid ${type} for "${prop}": ${String(value)}`);
}

function _validateValue(
    record: Record<string, unknown>,
    prop: string,
    value: unknown,
    options: ValidateOptions
) {
    const required =
        typeof options.required === 'function'
            ? options.required.call(record)
            : options.required;

    if (!value && options.default !== undefined) return options.default;
    if (!value && required) throw _error(prop, String(options.type));
    return value;
}

export function validateString(...args: ValidateArgs) {
    return String(_validateValue(...args));
}

export function validateNumber(...args: ValidateArgs) {
    const asNum = Number(String(_validateValue(...args)));
    if (Number.isNaN(asNum)) throw _error(args[1], 'number', args[2]);
    return asNum;
}

export function validateBoolean(...args: ValidateArgs) {
    return Boolean(_validateValue(...args));
}

export function validateUrl(...args: ValidateArgs) {
    const asStr = String(_validateValue(...args));
    try {
        return new URL(asStr).toString();
    } catch {
        throw _error(args[1], 'url', args[2]);
    }
}

export function validateUri(...args: ValidateArgs) {
    const asStr = String(_validateValue(...args));
    try {
        const url = new URL(asStr, 'http://localhost');
        return url.toString().replace('http://localhost', '');
    } catch {
        throw _error(args[1], 'uri', args[2]);
    }
}

export function validateArray(...args: ValidateArgs) {
    const asArr = _validateValue(...args);
    if (!Array.isArray(asArr)) throw _error(args[1], 'array', args[2]);
    return asArr;
}

/** Validate that a properties value is valid. */
export function validateValue(...args: ValidateArgs): unknown {
    if (Array.isArray(args[3].type)) {
        const array = validateArray(...args);
        const options = {
            type: args[3].type[0],
            required: args[3].required,
            default: args[3].default,
        };
        return array.map((value: unknown) =>
            validateValue(args[0], args[1], value, options)
        );
    }

    switch (args[3].type) {
        case Source.Prop.Type.String:
            return validateString(...args);
        case Source.Prop.Type.Number:
            return validateNumber(...args);
        case Source.Prop.Type.Boolean:
            return validateBoolean(...args);
        case Source.Prop.Type.URL:
            return validateUrl(...args);
        default:
            throw new Error(`Unknown type: ${args[3].type}`);
    }
}
