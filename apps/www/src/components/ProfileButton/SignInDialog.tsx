'use client';

import { AlertCircleIcon } from 'lucide-react';
import Image from 'next/image';
import type { ClientSafeProvider } from 'next-auth/react';
import { getCsrfToken, getProviders } from 'next-auth/react';
import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { ImageWithFallback } from '../ImageWithFallback';
import { Alert } from '@/ui/Alert';
import { Button } from '@/ui/Button';
import { Dialog } from '@/ui/Dialog';

export function SignInDialog({ children }: PropsWithChildren) {
    const [providers, setProviders] = useState<ClientSafeProvider[]>([]);
    const [csrfToken, setCsrfToken] = useState<string | undefined>();
    const [callbackUrl, setCallbackUrl] = useState<string | undefined>();

    useEffect(() => {
        (async () => {
            const token = await getCsrfToken();
            if (token) setCsrfToken(token);

            const url = window.location.href;
            if (url) setCallbackUrl(url);

            const providers = await getProviders();
            if (providers) setProviders(Object.values(providers));
        })();
    }, []);

    return <Dialog>
        <Dialog.Trigger asChild>{children}</Dialog.Trigger>

        <Dialog.Body>
            <Dialog.Header>
                <Dialog.Title>Sign In</Dialog.Title>
                <Dialog.Description>Choose your preferred sign in method.</Dialog.Description>
            </Dialog.Header>

            <Dialog.Content className="grid gap-4 grid-cols-1">
                {providers.map(provider => <form
                    key={provider.id}
                    method="post"
                    action={provider.signinUrl}
                >
                    <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                    <input name="callbackUrl" type="hidden" defaultValue={callbackUrl} />

                    <Button type="submit" className="w-full">
                        <ImageWithFallback
                            className="mr-2 dark:hidden"
                            src={`https://authjs.dev/img/providers/${provider.id}-dark.svg`}
                            fallbackSrc={`https://authjs.dev/img/providers/${provider.id}.svg`}
                            alt={`${provider.name} logo`}
                            width={24}
                            height={24}
                        />
                        <Image
                            className="mr-2 hidden dark:block"
                            src={`https://authjs.dev/img/providers/${provider.id}.svg`}
                            alt={`${provider.name} logo`}
                            width={24}
                            height={24}
                        />{' '}
                        Sign in using {provider.name}
                    </Button>
                </form>)}

                {providers.length === 0 && <Alert variant="destructive">
                    <AlertCircleIcon className="w-5 h-5 mr-2" />
                    <Alert.Title>Sign in failed</Alert.Title>
                    <Alert.Description>
                        There are no sign in providers configured.
                    </Alert.Description>
                </Alert>}
            </Dialog.Content>
        </Dialog.Body>
    </Dialog>;
}
