'use server';

import { Sources } from '@qwaroo/data-sources';
import { z } from 'zod';
import { serverAction } from '@/utilities/serverAction';

export const getSources = serverAction({ cacheTime: '1h' })(async () =>
    Object.values(Sources)
        .filter(source => source.isPublic)
        .map(source => source.toJSON())
);

export const getSource = serverAction({
    cacheTime: '1h',
    bodySchema: z.object({ slug: z.string() }),
})(async ({ slug }) => {
    return getSources({}).then(sources => sources.find(source => source.slug === slug) ?? null);
});

export const validateOptions = serverAction({
    cacheTime: '1h',
    bodySchema: z.object({ slug: z.string(), options: z.any() }),
})(async ({ slug, options }) => {
    if (!(slug in Sources)) return [false, 'Invalid source.'] as const;
    const source = Sources[slug as keyof typeof Sources];
    return source.validateOptions(options);
});
