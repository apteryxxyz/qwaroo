export function getEnv<Type>(
    type: (value?: string) => Type,
    envValue?: unknown,
    defaultValue?: Type
): Type {
    const value = String(envValue ?? defaultValue);
    if (!value) throw new Error('A environment variable was not found');
    return type(value);
}

export function isCI() {
    return getEnv(Boolean, process.env['CI'], false);
}

export function getApiUrl() {
    return getEnv(
        String,
        process.env['NEXT_PUBLIC_API_URL'],
        isCI() ? 'http://localhost' : ''
    );
}

export function getCdnUrl() {
    return getEnv(
        String,
        process.env['NEXT_PUBLIC_CDN_URL'],
        isCI() ? 'http://localhost' : ''
    );
}

export function getWebUrl() {
    return getEnv(
        String,
        process.env['NEXT_PUBLIC_WEB_URL'],
        isCI() ? 'http://localhost' : ''
    );
}

export function getGoogleTagManagerId() {
    return getEnv(String, process.env['NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID']);
}

export function getGoogleAnalyticsId() {
    return getEnv(String, process.env['NEXT_PUBLIC_GOOGLE_ANALYTICS_ID']);
}

export function getGoogleAdSenseClient() {
    return getEnv(String, process.env['NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT']);
}
