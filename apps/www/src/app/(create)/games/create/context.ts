import { Source } from '@qwaroo/data-sources';
import { GameCreateSchema } from '@qwaroo/validators';
import { createContext, useContext } from 'react';
import z from 'zod';

const Create = createContext<{
    source: Source.Entity | null;
    setSource(source: Source.Entity): void;
    properties: Record<string, unknown> | null;
    setProperties(properties: Record<string, unknown>): void;
    details: z.infer<typeof GameCreateSchema> | null;
    setDetails(details: z.infer<typeof GameCreateSchema>): void;
} | null>(null);

export const CreateProvider = Create.Provider;

export function useCreate() {
    return useContext(Create);
}
