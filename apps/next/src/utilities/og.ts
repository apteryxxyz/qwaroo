import type { OGSchema } from '@qwaroo/validators';
import type { z } from 'zod';
import { absoluteUrl } from './url';

/** Convert OG data into an encrypted string. */
export function encryptOgData(options: Record<string, unknown>) {
  const jsonString = JSON.stringify(options);
  const secretBuffer = Buffer.from(process.env.OG_SECRET, 'utf8');
  const encryptedResult = Buffer.alloc(jsonString.length);

  for (let i = 0; i < jsonString.length; i++)
    encryptedResult[i] =
      jsonString.charCodeAt(i) ^ secretBuffer[i % secretBuffer.length];

  return encryptedResult.toString('base64');
}

/** Convert an encrypted string into OG data. */
export function decryptOgData(encrypted: string) {
  const secretBuffer = Buffer.from(process.env.OG_SECRET, 'utf8');
  const encryptedBuffer = Buffer.from(encrypted, 'base64');
  const decryptedResult = Buffer.alloc(encryptedBuffer.length);

  for (let i = 0; i < encryptedBuffer.length; i++)
    decryptedResult[i] =
      encryptedBuffer[i] ^ secretBuffer[i % secretBuffer.length];

  return JSON.parse(decryptedResult.toString('utf8')) as Record<
    string,
    unknown
  >;
}

/** Generate an image URL with OG data. */
export function makeImageUrl(options: z.infer<typeof OGSchema>) {
  const encrypted = encryptOgData(options);
  return absoluteUrl(`/api/og?input=${encrypted}`);
}
