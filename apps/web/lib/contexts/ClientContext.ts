import { Client } from '@owenii/client';
import { createContext, useContext } from 'react';
import { useApiUrl } from '#/hooks/useEnv';

export const ClientContext = createContext<Client>(null as unknown as Client);
export const ClientProvider = ClientContext.Provider;

export function useClient<R extends boolean = boolean>(server = false) {
    if (server) return new Client({ apiHost: useApiUrl() });
    return useContext(ClientContext) as Client<R>;
}
