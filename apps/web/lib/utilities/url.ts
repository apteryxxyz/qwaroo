import { getWebUrl } from './env';

/** Resolve a path to a full URL. */
export function resolveHref(path: string, baseUrl = getWebUrl()) {
    return path.startsWith('http') ? path : new URL(path, baseUrl).toString();
}

/** Take a regular image url and pass it through a proxy. */
export function proxifyImageUrl(
    url: string | URL,
    quality = 80,
    width?: number
) {
    const proxifiedUrl = new URL('https://wsrv.nl');

    proxifiedUrl.searchParams.set('url', url.toString());
    proxifiedUrl.searchParams.set('quality', quality.toString());

    if (width) {
        proxifiedUrl.searchParams.set('w', width.toString());
        proxifiedUrl.searchParams.set('h', width.toString());
    }

    return proxifiedUrl.toString();
}
