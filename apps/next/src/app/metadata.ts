import _ from 'lodash';
import type { Metadata } from 'next/types';
import { APP } from '@/utilities/constants';
import { absoluteUrl } from '@/utilities/url';

export function generateMetadata(target: Metadata) {
  return _.merge(
    {
      metadataBase: absoluteUrl('/'),
      applicationName: APP.NAME,
      title: target.title ?? APP.NAME,
      description: target.description ?? APP.DESCRIPTION,

      openGraph: {
        type: 'website',
        siteName: APP.NAME,
        locale: 'en',
        description: target.description ?? APP.DESCRIPTION,
        url: target.openGraph?.url ?? absoluteUrl('/'),
        images: [
          { url: absoluteUrl('/images/og.png'), width: 1200, height: 630 },
        ],
      },

      twitter: {
        card: 'summary',
        title: APP.NAME,
        description: target.description ?? APP.DESCRIPTION,
        creator: '@apteryxxyz',
        images: [
          { url: absoluteUrl('/images/og.png'), width: 1200, height: 630 },
        ],
      },
    },
    target,
  );
}
