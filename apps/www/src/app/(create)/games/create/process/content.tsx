'use client';

import { AlertCircleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { useCreate } from '../context';
import type { BrowserEvents, ServerEvents } from '../socket/route';
import { Alert } from '@/components/Alert';
import { Card } from '@/components/Card';
import { useWebSocket } from '@/hooks/useWebSocket';

export default function Content() {
    const create = useCreate();
    if (!create?.setSource || !create.setProperties) throw new Error('Missing context');

    const router = useRouter();
    const [status, setStatus] = useState<string>('Initialising');
    const [error, setError] = useState<string | null>(null);

    const client = useWebSocket<BrowserEvents, ServerEvents>()!;

    useEffect(() => {
        if (!create.source || !create.properties || !create.details)
            return router.replace('/games/create');

        client.listen(['error', 'status', 'done']);
        client.send('create', {
            ...create.details,
            sourceSlug: create.source.slug as any,
            sourceProperties: create.properties,
        });

        client.on('error', setError);
        client.on('status', setStatus);
        client.on('done', id => {
            setStatus('Done, redirecting you now');
            router.replace(`/games/${id}`);
        });

        return () => client.unlisten(['error', 'status', 'done']);
    }, [client]);

    return <Card>
        <Card.Header>
            <Card.Title>Creating game</Card.Title>
            <Card.Description>
                {!error && "You're game is being created. This may take a few minutes."}
                {error && 'Something went wrong while creating your game. Please try again later.'}
            </Card.Description>
        </Card.Header>

        <Card.Content className="flex gap-2 justify-center items-center">
            {!error && <>
                <ClipLoader
                    size={16}
                    className="dark:!border-[rgb(255,_255,_255)_rgb(255,_255,_255)_transparent]"
                />
                {status}...
            </>}

            {error && <Alert variant="destructive">
                <AlertCircleIcon className="w-5 h-5 mr-2" />
                <Alert.Title>Game creation failed</Alert.Title>
                <Alert.Description>{error}</Alert.Description>
            </Alert>}
        </Card.Content>
    </Card>;
}
