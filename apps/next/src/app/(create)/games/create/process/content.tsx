'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangleIcon, Loader2Icon } from 'lucide-react';
import { Alert } from '@/components/alert';
import { Card } from '@/components/card';
import { trpc } from '@/services/trpc';
import { useCreate } from '../context';

export default function Content() {
  const creating = useCreate();
  if (!creating?.setSource || !creating.setProperties)
    throw new Error('Missing context');

  const router = useRouter();
  const [status, setStatus] = useState('Initialising');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!creating.details || !creating.source || !creating.properties)
      router.replace('/games/create');
  }, [creating.details, creating.properties, creating.source, router]);
  if (!creating.details || !creating.source || !creating.properties)
    return null;

  trpc.create.createGame.useSubscription(
    {
      ...creating.details,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      sourceSlug: creating.source.slug as any,
      sourceProperties: creating.properties,
    },
    {
      onData(data) {
        const payload = data as { type: 'progress' | 'done'; message: string };

        if (payload.type === 'progress') setStatus(payload.message);
        else if (payload.type === 'done') {
          setStatus('Done, redirecting you now');
          router.replace(`/games/${payload.message}`);
        }
      },
      onError(error) {
        console.log(error);
        setError(error.message);
      },
    },
  );

  return (
    <Card>
      <Card.Header>
        <Card.Title>Creating game</Card.Title>
        <Card.Description>
          {!error &&
            "You're game is being created. This may take a few minutes."}
          {error &&
            'Something went wrong while creating your game. Please try again later.'}
        </Card.Description>
      </Card.Header>

      <Card.Content className="flex items-center justify-center gap-2">
        {!error && (
          <>
            <Loader2Icon className="h-4 w-4 animate-spin" />
            {status}...
          </>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangleIcon className="h-4 w-4" />
            <Alert.Title>Game creation failed</Alert.Title>
            <Alert.Description>{error}</Alert.Description>
          </Alert>
        )}
      </Card.Content>
    </Card>
  );
}
