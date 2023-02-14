import { getWebUrl } from './getEnv';

/** Resolve a path to a full URL. */
export function resolveHref(path: string, baseUrl = getWebUrl()) {
    return path.startsWith('http') ? path : new URL(path, baseUrl).toString();
}

/** Convert a games banner url to use a proxy. */
export function resolveThumbnailUrl(url: string | URL) {
    const bannerUrl = new URL('https://wsrv.nl');
    bannerUrl.searchParams.set('url', url.toString());
    bannerUrl.searchParams.set('w', '900');
    bannerUrl.searchParams.set('h', '900');
    return bannerUrl.toString();
}
