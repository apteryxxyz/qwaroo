'use client';

import type { Source } from '@qwaroo/data-sources';
import { useState } from 'react';
import { CreateDataProvider } from './context';
import { Tooltip } from '@/components/ui/Tooltip';

export default function Layout(props: { children: React.ReactNode }) {
    const [source, setSource] = useState<Source.Entity | null>(null);
    const [options, setOptions] = useState<Record<string, unknown>>({});
    const [details, setDetails] = useState<Record<string, unknown>>({});

    return <CreateDataProvider
        value={{ source, setSource, options, setOptions, details, setDetails }}
    >
        <>
            <h1 className="text-2xl font-bold leading-none tracking-tight pb-6">Create A Game</h1>

            {props.children}
        </>
    </CreateDataProvider>;
}
