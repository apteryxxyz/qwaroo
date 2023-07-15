'use client';

import { Source } from '@qwaroo/data-sources';
import { GameCreateSchema } from '@qwaroo/validators';
import { useState } from 'react';
import z from 'zod';
import { CreateProvider } from './context';
import { WebSocketProvider } from '@/hooks/useWebSocket';

export default function Layout(props: { children: React.ReactNode }) {
    const [source, setSource] = useState<Source.Entity | null>(null);
    const [properties, setProperties] = useState<Record<string, unknown> | null>(null);
    const [details, setDetails] = useState<z.infer<typeof GameCreateSchema>>({} as any);

    const externalUrl = new URL(process.env.NEXT_PUBLIC_EXTERNAL_URL!);
    const wsUrl = new URL('/games/create/socket', externalUrl);
    wsUrl.protocol = wsUrl.protocol.replace('http', 'ws');

    return <CreateProvider
        value={{
            source,
            setSource,
            properties,
            setProperties,
            details,
            setDetails,
        }}
    >
        <WebSocketProvider url={wsUrl.toString()}>
            <>
                <h1 className="text-2xl font-bold leading-none tracking-tight pb-6">
                    Create A Game
                </h1>

                {props.children}
            </>
        </WebSocketProvider>
    </CreateProvider>;
}
