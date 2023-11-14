import * as cheerio from 'cheerio';

export async function fetchCheerio(url: string | URL) {
  if (!(url instanceof URL)) url = new URL(url);
  const content = await fetch(url).then((res) => res.text());
  return cheerio.load(content);
}

export function getElement(
  $: cheerio.CheerioAPI,
  selector: string,
  returnText: true,
): string;
export function getElement(
  $: cheerio.CheerioAPI,
  selector: string,
  returnText?: false,
): cheerio.Cheerio<cheerio.AnyNode>;
export function getElement(
  $: cheerio.CheerioAPI,
  selector: string,
  returnText = false,
) {
  const element = $(selector);
  if (element.length === 0) return null;
  return returnText ? element.text() : element;
}

export function parseNumber(text: string) {
  const numbers = /[\d,.]+/.exec(text);
  if (!numbers || numbers.length === 0) return null;
  return Number(numbers[0].replaceAll(',', ''));
}

const imageCache = new Map<string, string>();

/** Use unsplash to get a freeuse image. */
export async function getImageFor(query: string) {
  if (imageCache.has(query)) return imageCache.get(query)!;

  await new Promise((r) => setTimeout(r, 1000));
  const url = `https://unsplash.com/s/photos/${query}?license=free`;
  const $ = await fetchCheerio(url);

  const images = $('img[itemprop="thumbnailUrl"]').toArray();
  const srcs = images.map((e) => $(e).attr('src')).filter(Boolean);
  const result = srcs.slice(0, 5)[Math.floor(Math.random() * 5)]!;
  imageCache.set(query, result);
  return result;
}
