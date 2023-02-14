export type Logger = Pick<Console, 'info' | 'warn' | 'error'>;

export function useLogger(scope: string): Logger {
    return {
        info: console.info.bind(console, `[${scope}]`),
        warn: console.warn.bind(console, `[${scope}]`),
        error: console.error.bind(console, `[${scope}]`),
    };
}
