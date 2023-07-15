import { sources } from '@qwaroo/data-sources';
import _ from 'lodash';
import z from 'zod';
import { UnionToTuple } from '../utilities/types';

namespace Shared {
    export const Autogenerated = {
        id: z.string(),
        thumbnailUrl: z.string(),
    } as const;

    export const Inputs = {
        title: z.string().min(3).max(40),
        shortDescription: z.string().min(8).max(64),
        longDescription: z.string().min(96).max(512),
        thumbnailBinary: z.string(),
        category: z.string().min(3).max(40),
        valueVerb: z.string().max(40),
        valueNoun: z.string().max(40),
        higherText: z.string().max(40),
        lowerText: z.string().max(40),
        valuePrefix: z.string().max(10).optional(),
        valueSuffix: z.string().max(10).optional(),
    } as const;

    export const Statistics = {
        totalScore: z.number().int().min(0),
        totalTime: z.number().int().min(0),
        totalPlays: z.number().int().min(0),
        highScore: z.number().int().min(0).optional(),
        highScoreTime: z.number().int().min(0).optional(),
        highScoreAt: z.date().optional(),
        lastScore: z.number().int().min(0).optional(),
        lastTime: z.number().int().min(0).optional(),
        lastPlayedAt: z.date().optional(),
        createdAt: z.date(),
        editedAt: z.date().optional(),
        updatedAt: z.date().optional(),
    } as const;

    const sourceKeys = Object.keys(sources);
    const sourcesMapped = sourceKeys.map(key => z.literal(key));
    type sourcesMapped = UnionToTuple<typeof sourcesMapped>[number];
    export const Source = {
        // @ts-expect-error - Stuff
        sourceSlug: z.union(
            // @ts-expect-error - Stuff
            Object.keys(sources).map(key => z.literal(key))
            // @ts-expect-error - Stuff
        ) as z.ZodUnion<sourcesMapped>,
        sourceProperties: z.record(z.unknown()),
    } as const;
}

export const GameSchema = z.object({
    ...Shared.Statistics,
    ...Shared.Source,
    ...Shared.Inputs,
    creator: z.any(),
    ...Shared.Autogenerated,
});

export const GameCreateSchema = z.object({
    ...Shared.Inputs,
});

export const GameEditSchema = z.object({
    ..._.mapValues(Shared.Inputs, value => value.optional()),
});