import process from 'node:process';

export function getEnv<T>(
    type: (value?: string) => T,
    key: string,
    defaultValue?: T
): T {
    const value = String(process.env[key] ?? defaultValue);
    if (!value) throw new Error(`Environment variable ${key} not found`);
    return type(value);
}
