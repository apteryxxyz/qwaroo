export class Query extends null {
    public static stringify(value: Query.Object): Query.String {
        return Object.entries(value)
            .map(([key, value]) => {
                if (Array.isArray(value))
                    return `${key}=${value.map(encodeURIComponent).join(',')}`;
                return `${key}=${encodeURIComponent(value)}`;
            })
            .join('&');
    }

    public static parse(value: Query.String) {
        const queryPairs = value
            .slice(value.startsWith('?') || value.startsWith('&') ? 1 : 0)
            .split('&')
            .map(pair => pair.split('='));

        const result: Query.Object = {};
        for (const [key, value] of queryPairs) {
            if (key.endsWith('s'))
                result[key] = value.split(',').map(parseValue);
            else result[key] = parseValue(value);
        }

        return result;
    }
}

export namespace Query {
    export type Value = string | number | boolean;
    export interface Object {
        [key: string]: Value | Value[];
    }
    export type String = string;
}

function parseValue(value: string) {
    value = decodeURIComponent(value);
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (!Number.isNaN(Number(value))) return Number(value);
    return value;
}
