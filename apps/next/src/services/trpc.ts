import type { AppRouter } from '@qwaroo/server';
import {
  createWSClient,
  httpBatchLink,
  loggerLink,
  wsLink,
} from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import SuperJSON from 'superjson';
import { absoluteUrl } from '@/utilities/url';

function getEndingLink() {
  if (typeof window === 'undefined')
    return httpBatchLink<AppRouter>({ url: `/api/trpc` });

  const url = absoluteUrl('/api/trpc').replace('http', 'ws');
  const client = createWSClient({ url });
  return wsLink<AppRouter>({ client });
}

export function getClientConfig() {
  return {
    links: [
      loggerLink({
        enabled: (opts) =>
          (process.env.NODE_ENV === 'development' &&
            typeof window !== 'undefined') ||
          (opts.direction === 'down' && opts.result instanceof Error),
      }),
      getEndingLink(),
    ],
    transformer: SuperJSON,
  };
}

export const trpc = createTRPCReact<AppRouter>({});
