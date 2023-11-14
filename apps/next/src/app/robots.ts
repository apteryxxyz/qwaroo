import type { MetadataRoute } from 'next/types';
import { absoluteUrl } from '@/utilities/url';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api', '/_next', '/static'],
      },
    ],
    host: absoluteUrl().toString(),
    sitemap: absoluteUrl(`/sitemap.xml`).toString(),
  };
}
