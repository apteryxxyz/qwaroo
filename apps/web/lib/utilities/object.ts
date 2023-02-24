export function removeUndefined<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}
