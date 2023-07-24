import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.union([z.literal('development'), z.literal('production')]),
    PORT: z.string().regex(/^\d+$/),
    EXTERNAL_URL: z.string().min(1),

    MONGODB_ATLAS_URL: z.string().min(1),
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

    NEXTAUTH_URL: z.string().min(1),
    NEXTAUTH_SECRET: z.string().min(1),
    DISCORD_CLIENT_ID: z.string().min(1),
    DISCORD_CLIENT_SECRET: z.string().min(1),

    IMGUR_CLIENT_ID: z.string().min(1),
    IMGUR_CLIENT_SECRET: z.string().min(1),
  },

  client: {
    NEXT_PUBLIC_EXTERNAL_URL: z.string().min(1),
  },

  experimental__runtimeEnv: {
    NEXT_PUBLIC_EXTERNAL_URL: process.env['NEXT_PUBLIC_EXTERNAL_URL'],
  },
});
