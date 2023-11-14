import type { MetadataRoute } from 'next/types';
import { APP } from '@/utilities/constants';

export default function manifest(): MetadataRoute.Manifest {
  return {
    theme_color: APP.THEME_COLOUR,
    background_color: '#FFFFFF',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    name: APP.NAME,
    short_name: APP.NAME,
    description: APP.DESCRIPTION,
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
