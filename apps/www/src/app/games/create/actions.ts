'use server';

import { Sources } from '@qwaroo/data-sources';
import { createServerAction } from 'next-sa/server';

export const getSources = createServerAction()
    .cache({ max: 1, ttl: '1h' })
    .definition(async () =>
        Object.values(Sources)
            .filter(source => source.isPublic)
            .map(source => source.toJSON())
    );

export const getSource = createServerAction()
    .input(z => z.object({ slug: z.string() }))
    .cache({ max: 1, ttl: '1h' })
    .definition(
        async ({ slug }) =>
            Object.values(Sources)
                .filter(source => source.isPublic)
                .map(source => source.toJSON())
                .find(source => source.slug === slug) ?? null
    );

export const validateOptions = createServerAction()
    .input(z => z.object({ slug: z.string(), options: z.record(z.any()) }))
    .cache({ max: 1, ttl: '1h' })
    .definition(async ({ slug, options }) => {
        if (!(slug in Sources)) throw new Error(`No source was found for "${slug}".`);
        const source = Sources[slug as keyof typeof Sources];
        return source.validateOptions(options);
    });
