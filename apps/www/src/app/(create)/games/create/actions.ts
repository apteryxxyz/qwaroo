'use server';

import { sources } from '@qwaroo/data-sources';
import { createServerAction } from 'next-sa/server';

export const GET_sources = createServerAction()
    .cache({ max: 1, ttl: '1h' })
    .definition(async () =>
        Object.values(sources)
            .filter(source => source.isPublic)
            .map(source => source.toJSON())
    );

export const GET_source = createServerAction()
    .input(z => z.object({ slug: z.string() }))
    .cache({ max: 1, ttl: '1h' })
    .definition(
        async ({ slug }) =>
            Object.values(sources)
                .filter(source => source.isPublic)
                .map(source => source.toJSON())
                .find(source => source.slug === slug) ?? null
    );

export const POST_validateProperties = createServerAction()
    .input(z => z.object({ slug: z.string(), properties: z.record(z.any()) }))
    .cache({ max: 1, ttl: '1h' })
    .definition(async ({ slug, properties }) => {
        if (!(slug in sources)) throw new Error(`No source was found for "${slug}".`);
        const source = sources[slug as keyof typeof sources];
        return source.validateProperties(properties);
    });
