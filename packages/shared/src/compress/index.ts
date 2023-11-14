// pako needed for support in browser
import pako from 'pako';

export type Compressed<T> = string & { as: T };

/** Compress any JSON stringifiable data into a base64 string. */
export function compress<T>(data: T): Compressed<T> {
  const u8 = pako.deflate(JSON.stringify(data));
  return btoa(String.fromCharCode(...u8)) as Compressed<T>;
}

/** Decompress a base64 string into the original data. */
export function decompress<T>(compressed: Compressed<T>): T {
  const u8 = Uint8Array.from(atob(compressed), (c) => c.charCodeAt(0));
  return JSON.parse(pako.inflate(u8, { to: 'string' })) as T;
}
