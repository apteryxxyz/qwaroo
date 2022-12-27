import { Source } from '#/Source';

export interface ValidateOptions {
    type: Source.Prop.Type | [Source.Prop.Type];
    required: ((this: Record<string, unknown>) => boolean) | boolean;
    default?: unknown;
    options?: unknown[];
    validate?:
        | ((this: Record<string, unknown>, value: unknown) => boolean)
        | RegExp;
}

export type ValidateArgs = [
    record: Record<string, unknown>,
    prop: string,
    value: unknown,
    options: ValidateOptions
];

function _error(prop: string, type: string, value: unknown = 'empty') {
    return new Error(`Invalid ${type} for "${prop}": ${String(value)}`);
}

function _validateValue(
    record: Record<string, unknown>,
    prop: string,
    value: unknown,
    options: ValidateOptions
) {
    if (value && !options.options?.includes(value))
        throw new Error(`Invalid option for "${prop}": ${String(value)}`);

    if (value && options.validate) {
        const err = new Error(`Invalid value for "${prop}": ${String(value)}`);
        if (options.validate instanceof RegExp) {
            if (!options.validate.test(String(value))) throw err;
        } else if (!options.validate.call(record, value)) throw err;
    }

    if (!value && options.default !== undefined) return options.default;

    if (!value && options.required) {
        const err = new Error(`Missing required value for "${prop}"`);
        if (typeof options.required === 'function') {
            if (options.required.call(record)) throw err;
        } else throw err;
    }

    return value;
}

export function validateString(...args: ValidateArgs) {
    const value = _validateValue(...args);
    if (value === undefined) return undefined;

    const asStr = String(value);
    if (!asStr) throw _error(args[1], 'string', args[2]);
    return asStr;
}

export function validateNumber(...args: ValidateArgs) {
    const value = _validateValue(...args);
    if (value === undefined) return undefined;

    const asNum = Number(String(value));
    if (Number.isNaN(asNum)) throw _error(args[1], 'number', args[2]);
    return asNum;
}

export function validateBoolean(...args: ValidateArgs) {
    const value = _validateValue(...args);
    if (value === undefined) return undefined;

    const asBool = String(value).toLowerCase() === 'true';
    if (typeof asBool !== 'boolean') throw _error(args[1], 'boolean', args[2]);
    return asBool;
}

export function validateArray(...args: ValidateArgs) {
    const asArr = _validateValue(...args);
    if (asArr === undefined) return undefined;

    if (!Array.isArray(asArr)) throw _error(args[1], 'array', args[2]);
    return asArr;
}

/** Validate that a properties value is valid. */
export function validateValue(...args: ValidateArgs): unknown {
    if (Array.isArray(args[3].type)) {
        const array = validateArray(...args);
        if (array === undefined) return [];

        const options = {
            type: args[3].type[0],
            required: args[3].required,
            default: args[3].default,
        };
        return array?.map((value: unknown) =>
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
        default:
            throw new Error(`Unknown type: ${args[3].type}`);
    }
}
