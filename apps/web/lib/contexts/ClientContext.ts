import { Client } from '@qwaroo/client';
import { createContext, useContext } from 'react';
import { useApiUrl } from '#/hooks/useEnv';

export const ClientContext = createContext<Client>(null as unknown as Client);
export const ClientProvider = ClientContext.Provider;

/** Get the client context. */
export function useClient<R extends boolean = boolean>(server = false) {
    // If on the server, there is no context, so just create a new client
    // No need (yet) to allow use of API tokens on the server
    if (server) return new Client({ apiHost: useApiUrl() });
    return useContext(ClientContext) as Client<R>;
}
