import _ from 'lodash';
import z from 'zod';

export const OGSchema = z.object({
  type: z.union([z.literal('post'), z.literal('game')]),
  title: z.string().transform((val) => _.truncate(val, { length: 50 })),
  description: z.string().transform((val) => _.truncate(val, { length: 200 })),

  // For game
  creator: z.string().optional(),
  likes: z.number().int().min(0).max(100).optional(),
  plays: z.number().int().min(0).optional(),
});
