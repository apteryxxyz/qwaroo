'use client';

import type { Source } from '@qwaroo/sources';
import type { GameDetailsSchema } from '@qwaroo/validators';
import { useState } from 'react';
import type { z } from 'zod';
import type { LayoutProps } from '@/types';
import { CreateProvider } from './context';

type source = Source.Entity | null;
type properties = Record<string, unknown> | null;
type details = z.infer<typeof GameDetailsSchema> | null;

export default function Layout(p: LayoutProps) {
  const [source, setSource] = useState<source>(null);
  const [properties, setProperties] = useState<properties>(null);
  const [details, setDetails] = useState<details>(null);

  return (
    <CreateProvider
      value={{
        source,
        setSource,
        properties,
        setProperties,
        details,
        setDetails,
      }}
    >
      <>
        <h1 className="pb-6 text-2xl font-bold leading-none tracking-tight">
          Create A Game
        </h1>

        {p.children}
      </>
    </CreateProvider>
  );
}
