import { Client } from '@qwaroo/client';
import type { GetServerSidePropsContext } from 'next';
import { createContext, useContext } from 'react';
import { getApiUrl, getCdnUrl } from '#/utilities/getEnv';

export const ClientContext = createContext<Client>(null!);
export const ClientProvider = ClientContext.Provider;

export function useClient(req?: GetServerSidePropsContext['req']) {
    if (req) {
        const userId = req.cookies['qwaroo.user_id'];
        const token = req.cookies['qwaroo.token'];

        const client = createClient();
        if (userId && token) client.prepare(userId, token);
        return client;
    } else return useContext(ClientContext);
}

export function createClient() {
    return new Client({
        api: { baseUrl: getApiUrl() },
        cdn: { baseUrl: getCdnUrl() },
    });
}
