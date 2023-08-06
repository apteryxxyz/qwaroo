/** Proxy an image through WSRV. */
export function proxyImageUrl(
  url: string | URL,
  quality = 80,
  width?: number,
  height = width,
) {
  const proxifiedUrl = new URL('https://wsrv.nl');

  proxifiedUrl.searchParams.set('url', url.toString());
  proxifiedUrl.searchParams.set('quality', quality.toString());

  if (width) proxifiedUrl.searchParams.set('w', width.toString());
  if (height) proxifiedUrl.searchParams.set('h', height.toString());

  return proxifiedUrl.toString();
}

/** Get the absolute URL of a path. */
export function absoluteUrl(url = '/') {
  return new URL(url, process.env.NEXT_PUBLIC_APP_URL).toString();
}
