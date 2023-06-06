import { AlertCircleIcon } from 'lucide-react';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { getProviders } from 'next-auth/react';
import { Alert } from '@/components/Alert';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { authOptions } from '@/utilities/authOptions';

export type SignInErrorTypes =
    | 'Callback'
    | 'CredentialsSignin'
    | 'default'
    | 'EmailSignin'
    | 'OAuthAccountNotLinked'
    | 'OAuthCallback'
    | 'OAuthCreateAccount'
    | 'OAuthSignin'
    | 'SessionRequired';

const ErrorStrings: Record<SignInErrorTypes, string> = {
    OAuthSignin: 'Try signing with a different account.',
    OAuthCallback: 'Try signing with a different account.',
    OAuthCreateAccount: 'Try signing with a different account.',
    Callback: 'Try signing with a different account.',
    OAuthAccountNotLinked:
        'To confirm your identity, sign in with the same account you used originally.',
    EmailSignin: 'The email could not be sent.',
    CredentialsSignin: 'Sign in failed. Check the details you provided are correct.',
    SessionRequired: 'Please sign in to access this page.',
    default: 'Unable to sign in.',
};

export const metadata = {
    title: 'Sign In to Qwaroo',
    description: 'Sign in to Qwaroo to access your profile and save your game statistics.',
};

export default async function Page({
    searchParams,
}: {
    searchParams: { error?: SignInErrorTypes; callbackUrl?: string };
}) {
    const session = await getServerSession(authOptions);
    if (session) redirect('/');

    const providers = Object.values((await getProviders()) ?? {});
    const errorString =
        searchParams.error && (ErrorStrings[searchParams.error] ?? ErrorStrings.default);

    const csrfToken = cookies().get('next-auth.csrf-token')?.value.split('|')[0];
    const callbackUrl = new URL(searchParams.callbackUrl ?? '', process.env.NEXTAUTH_URL);

    return <section className="container min-h-[75dvh] flex items-center justify-center">
        <Card>
            <Card.Header>
                <Card.Title>Sign In</Card.Title>
                <Card.Description>Choose your preferred sign in method.</Card.Description>
            </Card.Header>

            <Card.Content>
                <div className="grid gap-4 grid-cols-1">
                    {errorString && <Alert variant="destructive">
                        <AlertCircleIcon className="w-5 h-5 mr-2" />
                        <Alert.Title>Sign in failed</Alert.Title>
                        <Alert.Description>{errorString}</Alert.Description>
                    </Alert>}

                    {providers.map(provider => <form
                        key={provider.id}
                        method="post"
                        action={provider.signinUrl}
                    >
                        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                        {callbackUrl && <input
                            name="callbackUrl"
                            type="hidden"
                            defaultValue={callbackUrl.toString()}
                        />}

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
                </div>
            </Card.Content>
        </Card>
    </section>;
}
