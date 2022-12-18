export function useApiUrl() {
    const apiUrl = String(process.env['NEXT_PUBLIC_API_URL'] ?? '');
    return new URL(apiUrl);
}

export function useWebUrl() {
    const webUrl = String(process.env['NEXT_PUBLIC_WEB_URL'] ?? '');
    return new URL(webUrl);
}
