import { URL } from 'node:url';
import { Source } from '#/Source';

export interface ValidateOptions {
    type: Source.Prop.Type | [Source.Prop.Type];
    required: boolean;
    default?: unknown;
}

export type ValidateArgs = [
    prop: string,
    value: unknown,
    options: ValidateOptions
];

function _error(prop: string, type: string, value: unknown = 'empty') {
    if (!value && !type) return new Error(`Missing ${type} for "${prop}"`);
    return new Error(`Invalid ${type} for "${prop}": ${String(value)}`);
}

function _validateValue(
    prop: string,
    value: unknown,
    options: ValidateOptions
) {
    if (!value && options.default) return options.default;
    if (!value && options.required) throw _error(prop, String(options.type));
    return value;
}

export function validateString(...args: ValidateArgs) {
    return String(_validateValue(...args));
}

export function validateNumber(...args: ValidateArgs) {
    const asNum = Number(String(_validateValue(...args)));
    if (Number.isNaN(asNum)) throw _error(args[0], 'number', args[1]);
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
        throw _error(args[0], 'url', args[1]);
    }
}

export function validateArray(...args: ValidateArgs) {
    const asArr = _validateValue(...args);
    if (!Array.isArray(asArr)) throw _error(args[0], 'array', args[1]);
    return asArr;
}

export function validateValue(...args: ValidateArgs): unknown {
    if (Array.isArray(args[2].type)) {
        const array = validateArray(...args);
        const options = {
            type: args[2].type[0],
            required: args[2].required,
            default: args[2].default,
        };
        return array.map((value: unknown) =>
            validateValue(args[0], value, options)
        );
    }

    switch (args[2].type) {
        case Source.Prop.Type.String:
            return validateString(...args);
        case Source.Prop.Type.Number:
            return validateNumber(...args);
        case Source.Prop.Type.Boolean:
            return validateBoolean(...args);
        case Source.Prop.Type.URL:
            return validateUrl(...args);
        default:
            throw new Error(`Unknown type: ${args[2].type}`);
    }
}
