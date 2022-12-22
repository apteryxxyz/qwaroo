/** Block the current thread for the specified number of seconds. */
export function sleepSeconds(seconds: number) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1_000));
}
