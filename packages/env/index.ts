import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.union([z.literal('development'), z.literal('production')]),
  PORT: z.string().regex(/^\d+$/),
  EXTERNAL_URL: z.string().min(1),
  NEXT_PUBLIC_EXTERNAL_URL: z.string().min(1),

  MONGODB_ATLAS_URL: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

  NEXTAUTH_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(1),
  DISCORD_CLIENT_ID: z.string().min(1),
  DISCORD_CLIENT_SECRET: z.string().min(1),

  IMGUR_CLIENT_ID: z.string().min(1),
  IMGUR_CLIENT_SECRET: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;
export const env = envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
    interface ProcessEnv extends Env {
      [key: Uppercase<string>]: string | undefined;
    }
  }
}
