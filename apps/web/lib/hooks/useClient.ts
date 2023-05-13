import { Client, Collection } from '@qwaroo/client';
import type { GetServerSidePropsContext } from 'next';
import { getApiUrl, getCdnUrl } from '#/utilities/env';

export const ClientCache = new Collection<string, Client>();

export function useClient(req?: GetServerSidePropsContext['req']) {
    if (req) return useOnServer(req);
    return useOnClient();
}

export function createClient() {
    return new Client({
        api: { baseUrl: getApiUrl() },
        cdn: { baseUrl: getCdnUrl() },
    });
}

function useOnServer(req: GetServerSidePropsContext['req']) {
    const userId = req.cookies['qwaroo.user_id'];
    const token = req.cookies['qwaroo.token'];
    if (!userId || !token) return createClient();

    if (ClientCache.has(token)) return ClientCache.get(token)!;

    const client = createClient();
    client.prepare(userId, token);
    ClientCache.set(token, client);
    return client;
}

function useOnClient() {
    let client = ClientCache.get('__default__');
    if (!client) {
        client = createClient();
        ClientCache.set('__default__', client);
    }

    if (client.hasTriedToPrepare) return client;
    if (typeof localStorage === 'undefined') return client;

    const userId = localStorage.getItem('qwaroo.user_id');
    const token = localStorage.getItem('qwaroo.token');
    if (!userId || !token) return client;

    client.prepare(userId, token);
    client.hasTriedToPrepare = true;
    void client.login();
    return client;
}
