import type { Source } from '@qwaroo/sources';
import type { GameDetailsSchema } from '@qwaroo/validators';
import { createContext, useContext } from 'react';
import type z from 'zod';

const Create = createContext<{
  source: Source.Entity | null;
  setSource(source: Source.Entity): void;
  properties: Record<string, unknown> | null;
  setProperties(properties: Record<string, unknown>): void;
  details: z.infer<typeof GameDetailsSchema> | null;
  setDetails(details: z.infer<typeof GameDetailsSchema>): void;
} | null>(null);

export const CreateProvider = Create.Provider;

export function useCreate() {
  return useContext(Create);
}
