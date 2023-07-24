import type { AppRouter } from '@qwaroo/server';
import {
  createWSClient,
  httpBatchLink,
  loggerLink,
  wsLink,
} from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import SuperJSON from 'superjson';
import { env } from '@/env';

function getEndingLink() {
  if (typeof window === 'undefined')
    return httpBatchLink<AppRouter>({ url: `/api/trpc` });
  console.log(env);
  const client = createWSClient({
    url: env.NEXT_PUBLIC_EXTERNAL_URL.replace('http', 'ws'),
  });
  return wsLink<AppRouter>({ client });
}

export function getClientConfig() {
  return {
    links: [
      loggerLink({
        enabled: (opts) =>
          (env.NODE_ENV === 'development' && typeof window !== 'undefined') ||
          (opts.direction === 'down' && opts.result instanceof Error),
      }),
      getEndingLink(),
    ],
    transformer: SuperJSON,
  };
}

export const trpc = createTRPCReact<AppRouter>({});
