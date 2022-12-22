import { useClient } from '#/contexts/ClientContext';
import { useGoogleAnalyticsId } from '#/hooks/useEnv';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
/** Trigger a page view event. */
export function pageView(url: string) {
    window.gtag('config', useGoogleAnalyticsId(), {
        page_path: url,
    });
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
/** Trigger a custom event. */
export function emitEvent(name: string, params: { [key: string]: unknown }) {
    const client = useClient();

    window.gtag('event', name, {
        user_id: client.me?.id ?? 'anonymous',
        user_name: client.me?.displayName ?? 'anonymous',
        ...params,
    });
}
