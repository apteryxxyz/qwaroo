import type { Client } from '@owenii/client';
import { createContext, useContext } from 'react';

export const ClientContext = createContext<Client>(null as unknown as Client);
export const ClientProvider = ClientContext.Provider;

export function useClient<Ready extends boolean = boolean>() {
    return useContext(ClientContext) as Client<Ready>;
}
