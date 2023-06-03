'use server';

import { Sources } from '@qwaroo/data-sources';
import { z } from 'zod';
import { serverAction } from '@/utilities/serverAction';

export const getSources = serverAction({ cacheTime: '1h' })(async () =>
    Object.values(Object.fromEntries(Sources))
        .filter(source => source.isPublic)
        .map(source => source.toJSON())
);

export const getSource = serverAction({
    cacheTime: '1h',
    bodySchema: z.object({ slug: z.string() }),
})(async ({ slug }) => Sources.get(slug)?.toJSON() ?? null);
