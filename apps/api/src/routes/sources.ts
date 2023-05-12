import { handle, useMethods, useToken } from '@qwaroo/middleware';
import { Sources } from '@qwaroo/sources';
import type { APISource } from '@qwaroo/types';
import { APIRoutes } from '@qwaroo/types';

export default () => {
    const router = require('express').Router();

    router.get(
        APIRoutes.sources(),
        useMethods(['GET']),
        useToken([]),
        handle(async (_req, res) => {
            const sources = Array.from(Sources.values())
                .filter(source => source.isPublic)
                .map(source => ({
                    ...source,

                    properties: Object.entries(source.properties) //
                        .map(([key, property]) => ({
                            key,
                            ...property,
                            validate: property.validate?.toString(),
                        })),
                })) satisfies APISource[];

            res.status(200).json({ success: true, items: sources });
        })
    );

    return router;
};
