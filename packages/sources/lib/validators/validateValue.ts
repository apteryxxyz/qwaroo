import { Source } from '#/Source';

export type ValidateArgs = [
    record: Record<string, unknown>,
    prop: string,
    value: unknown,
    options: Source.Prop
];

function _verifyValue(...args: ValidateArgs) {
    const [record, prop, value, options] = args;

    if (
        value &&
        options.options &&
        !options.options?.find(opt => opt.value === value)
    )
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
    const value = _verifyValue(...args);
    if (value === undefined) return undefined;

    const asStr = String(value);
    if (!asStr)
        throw new Error(`Invalid string for "${args[1]}": ${String(value)}`);
    return asStr;
}

export function validateNumber(...args: ValidateArgs) {
    const value = _verifyValue(...args);
    if (value === undefined) return undefined;

    const asNum = Number(String(value));
    if (Number.isNaN(asNum))
        throw new Error(`Invalid number for "${args[1]}": ${String(value)}`);
    return asNum;
}

export function validateBoolean(...args: ValidateArgs) {
    const value = _verifyValue(...args);
    if (value === undefined) return undefined;

    const asBool = Boolean(value);
    if (typeof asBool !== 'boolean')
        throw new Error(`Invalid boolean for "${args[1]}": ${String(value)}`);
    return asBool;
}

export function validateArray(...args: ValidateArgs) {
    if (!Array.isArray(args[2]))
        throw new Error(`Invalid array for "${args[1]}": ${String(args[2])}`);
    return args[2];
}

export function validateValue(...args: ValidateArgs): unknown {
    if (Array.isArray(args[3].type)) {
        const array = validateArray(...args);
        if (array === undefined) return [] as const;
        return array.map(
            (value: unknown) =>
                validateValue(args[0], args[1], value, {
                    ...args[3],
                    type: args[3].type[0] as Source.Prop.Type,
                }) as unknown
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
            throw new Error(`Invalid type for "${args[1]}": ${args[3].type}`);
    }
}
