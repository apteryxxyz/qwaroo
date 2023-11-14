/** Take a regular image url and pass it through a proxy. */
export function proxifyImageUrl(
  url: string | URL,
  quality?: number,
  width?: number,
) {
  const proxifiedUrl = new URL('https://wsrv.nl');
  proxifiedUrl.searchParams.set('url', url.toString());

  if (quality) {
    proxifiedUrl.searchParams.set('quality', quality.toString());
  }

  if (width) {
    proxifiedUrl.searchParams.set('w', width.toString());
    proxifiedUrl.searchParams.set('h', width.toString());
  }

  return proxifiedUrl;
}

/** Get the absolute URL of a path. */
export function absoluteUrl(url = '/') {
  return new URL(url, process.env['NEXT_PUBLIC_APP_URL']);
}
