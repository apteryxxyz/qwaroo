'use client';

import { redirect } from 'next/navigation';
import { useWebSocket } from 'next-ws/client';
import { useCallback, useEffect } from 'react';
import { useCreate } from '../context';

export default function Content() {
    const { source, options, details } = useCreate() ?? {};
    if (!source || !options || !details) redirect('/games/create');

    const ws = useWebSocket()!;
    const onMessage = useCallback((event: MessageEvent) => {
        const { type, payload } = JSON.parse(event.data.toString());
        if (type === 'created') redirect(`/games/${payload.slug}`);
    }, []);

    useEffect(() => {
        ws.addEventListener('message', onMessage);

        // Disabled for the time being
        // ws.send(
        //     JSON.stringify({
        //         type: 'create',
        //         payload: {
        //             sourceSlug: source.slug,
        //             sourceOptions: options,
        //             ...details,
        //         },
        //     })
        // );

        return () => ws.removeEventListener('message', onMessage);
    }, [ws]);

    return null;
}
