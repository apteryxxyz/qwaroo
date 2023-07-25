import '@qwaroo/env';
import type { IncomingMessage, Server } from 'node:http';
import { appRouter, createContext } from '@qwaroo/server';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { getServerSession } from 'next-auth';
import type { WebSocketServer } from 'ws';
import { authOptions } from '../services/auth';

async function getSession(request: IncomingMessage) {
  const headers = request.headers;
  const cookies =
    headers.cookie?.split(';').reduce(
      (acc, cookie) => {
        const [key, value] = cookie.split('=');
        acc[key.trim()] = value;
        return acc;
      },
      {} as Record<string, string>,
    ) ?? {};

  delete cookies['next-auth.callback-url'];
  delete cookies['__Secure-next-auth.callback-url'];
  return getServerSession(
    // @ts-expect-error - Types are not assignable
    { headers, cookies },
    { getHeader: () => ({}), setHeader: () => ({}) },
    authOptions,
  );
}

export function prepareWebSocketServer(
  httpServer: Server,
  wsServer: WebSocketServer,
) {
  httpServer.on('upgrade', (request, socket, head) => {
    // Handle upgrade ourselves so we can ignore /_next requests (hot reload)
    const url = new URL(request.url ?? '', 'http://next-ws');
    const pathname = url.pathname;
    if (pathname.startsWith('/_next')) return;

    wsServer.handleUpgrade(request, socket, head, (ws) => {
      wsServer.emit('connection', ws, request);
    });
  });

  return applyWSSHandler({
    wss: wsServer,
    router: appRouter,
    async createContext({ req: request }) {
      const session = await getSession(request);
      return createContext({ me: session?.user });
    },
  });
}
