function log(method: keyof typeof console, prefix: string) {
    return (...args: unknown[]) =>
        Reflect.get(console as {}, method)(prefix, ...args);
}

export function useLogger(prefix: string) {
    return {
        info: (...message: string[]) => log('info', prefix)(...message),
        warn: (...message: string[]) => log('warn', prefix)(...message),
        error: (...message: string[]) => log('error', prefix)(...message),
    } as Logger;
}

export interface Logger {
    info(...message: string[]): void;
    warn(...message: string[]): void;
    error(...message: string[]): void;
}
