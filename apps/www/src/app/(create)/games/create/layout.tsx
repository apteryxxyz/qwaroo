'use client';

import type { Source } from '@qwaroo/data-sources';
import { WebSocketProvider } from 'next-ws/client';
import { useState } from 'react';
import { CreateDataProvider } from './context';

export default function Layout(props: { children: React.ReactNode }) {
    const [source, setSource] = useState<Source.Entity | null>(null);
    const [options, setOptions] = useState<Record<string, unknown>>({});
    const [details, setDetails] = useState<Record<string, unknown>>({});

    const externalUrl = new URL(process.env.NEXT_PUBLIC_EXTERNAL_URL!);
    const wsUrl = new URL('/games/create/socket', externalUrl);
    wsUrl.protocol = wsUrl.protocol.replace('http', 'ws');

    return <CreateDataProvider
        value={{ source, setSource, options, setOptions, details, setDetails }}
    >
        <WebSocketProvider url={wsUrl.toString()}>
            <>
                <h1 className="text-2xl font-bold leading-none tracking-tight pb-6">
                    Create A Game
                </h1>

                {props.children}
            </>
        </WebSocketProvider>
    </CreateDataProvider>;
}
