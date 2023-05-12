import { Source } from '#/structures/Source';

type ValidateParameters = [
    record: Record<string, unknown>,
    prop: string,
    value: unknown,
    options: Source.Prop
];

function verifyValue(...parameters: ValidateParameters) {
    const [, prop, value, options] = parameters;

    if (
        value &&
        options.options &&
        !options.options?.find(opt => opt.value === value)
    )
        throw new Error(`Invalid option for "${prop}": ${String(value)}`);

    if (
        value &&
        options.validate instanceof RegExp &&
        !options.validate.test(String(value))
    )
        throw new Error(`Invalid value for "${prop}": ${String(value)}`);

    if (!value && options.default !== undefined) return options.default;

    if (!value && options.required)
        throw new Error(`Missing required value for "${prop}"`);

    return value;
}

function validateString(...parameters: ValidateParameters) {
    const [, prop, , options] = parameters;
    const value = verifyValue(...parameters);
    const string = String(value ?? '').trim();

    if (!string)
        throw new Error(`Invalid string for "${prop}": ${String(value)}`);

    if (options.minLength && string.length < options.minLength)
        throw new Error(`String for "${prop}" is too short: ${String(value)}`);

    if (options.maxLength && string.length > options.maxLength)
        throw new Error(`String for "${prop}" is too long: ${String(value)}`);

    return string;
}

function validateNumber(...parameters: ValidateParameters) {
    const [, prop, , options] = parameters;
    const value = verifyValue(...parameters);
    const number = Number(String(value ?? ''));

    if (Number.isNaN(number))
        throw new Error(`Invalid number for "${prop}": ${String(value)}`);

    if (options.minValue && number < options.minValue)
        throw new Error(`Number for "${prop}" is too small: ${String(value)}`);

    if (options.maxValue && number > options.maxValue)
        throw new Error(`Number for "${prop}" is too large: ${String(value)}`);

    return number;
}

function validateBoolean(...parameters: ValidateParameters) {
    const [, prop] = parameters;
    const value = verifyValue(...parameters);

    const isTrue = value === true || value === 'true';
    const isFalse = value === false || value === 'false';

    if (value && !isTrue && !isFalse)
        throw new Error(`Invalid boolean for "${prop}": ${String(value)}`);

    return isTrue;
}

function validateArray(...parameters: ValidateParameters) {
    const [, prop, value, options] = parameters;

    if (!Array.isArray(value))
        throw new Error(`Invalid array for "${prop}": ${String(value)}`);

    if (options.minLength && value.length < options.minLength)
        throw new Error(`Array for "${prop}" is too short: ${String(value)}`);

    if (options.maxLength && value.length > options.maxLength)
        throw new Error(`Array for "${prop}" is too long: ${String(value)}`);

    return value;
}

export function validateValue(...parameters: ValidateParameters): unknown {
    const [, prop, , options] = parameters;

    if (Array.isArray(options.type)) {
        return validateArray(...parameters).map(value =>
            validateValue(parameters[0], parameters[1], value, {
                ...options,
                type: options.type[0] as Source.Prop.Type,
            })
        );
    }

    switch (options.type) {
        case Source.Prop.Type.String:
            return validateString(...parameters);
        case Source.Prop.Type.Number:
            return validateNumber(...parameters);
        case Source.Prop.Type.Boolean:
            return validateBoolean(...parameters);
        default:
            throw new Error(`Invalid type for "${prop}": ${options.type}`);
    }
}
