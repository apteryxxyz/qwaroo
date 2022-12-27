export type Logger = Pick<Console, 'log' | 'warn' | 'error'>;

export function useLogger(scope: string) {
    return {
        info: console.info.bind(console, `[${scope}]`),
        warn: console.warn.bind(console, `[${scope}]`),
        error: console.error.bind(console, `[${scope}]`),
    };
}
