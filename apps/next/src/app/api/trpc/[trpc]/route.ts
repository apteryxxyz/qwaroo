import { appRouter, createContext } from '@qwaroo/server';
import type { NextRequest } from 'next/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/auth';
import '@qwaroo/database/connect';

const handler = async (request: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    async createContext() {
      const session = await getServerSession(authOptions);
      return createContext({ me: session?.user });
    },
  });

export { handler as GET, handler as POST };
