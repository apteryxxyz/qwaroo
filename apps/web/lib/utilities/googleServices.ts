import { useGoogleAnalyticsId } from '#/hooks/useEnv';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export function pageView(url: string) {
    window.gtag('config', useGoogleAnalyticsId(), {
        page_path: url,
    });
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export function event(name: string, params: { [key: string]: unknown }) {
    window.gtag('event', name, params);
}
