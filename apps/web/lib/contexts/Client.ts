import { Client, Collection } from '@qwaroo/client';
import type { GetServerSidePropsContext } from 'next';
import { createContext, useContext } from 'react';
import { getApiUrl, getCdnUrl } from '#/utilities/env';

export const ClientContext = createContext<Client>(null!);
export const ClientProvider = ClientContext.Provider;
export const ClientCache = new Collection<string, Client>();

export function useClient(req?: GetServerSidePropsContext['req']) {
    if (!req) return useContext(ClientContext);

    const userId = req.cookies['qwaroo.user_id'];
    const token = req.cookies['qwaroo.token'];

    if (!userId || !token) return createClient();
    if (ClientCache.has(token)) return ClientCache.get(token)!;

    const client = createClient();
    client.prepare(userId, token);
    ClientCache.set(token, client);
    return client;
}

export function createClient() {
    return new Client({
        api: { baseUrl: getApiUrl() },
        cdn: { baseUrl: getCdnUrl() },
    });
}
