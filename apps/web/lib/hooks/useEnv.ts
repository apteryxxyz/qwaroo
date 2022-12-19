function isCI() {
    return process.env['CI'] === 'true';
}

export function useApiUrl() {
    // Environment variables are not available in the CI environment
    // So we use localhost as a default
    const apiUrl =
        process.env['NEXT_PUBLIC_API_URL'] ??
        (isCI() ? 'http://localhost' : '');
    return new URL(apiUrl);
}

export function useWebUrl() {
    const webUrl =
        process.env['NEXT_PUBLIC_WEB_URL'] ??
        (isCI() ? 'http://localhost' : '');
    return new URL(webUrl);
}
