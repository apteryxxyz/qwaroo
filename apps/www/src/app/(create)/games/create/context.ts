import type { Source } from '@qwaroo/data-sources';
import { createContext, useContext } from 'react';

const CreateData = createContext<{
    source: Source.Entity | null;
    setSource(source: Source.Entity): void;
    options: Record<string, unknown>;
    setOptions(options: Record<string, unknown>): void;
    details: Record<string, unknown>;
    setDetails(details: Record<string, unknown>): void;
}>(null!);

export const CreateDataProvider = CreateData.Provider;
export function useCreate() {
    return useContext(CreateData) ?? {};
}
