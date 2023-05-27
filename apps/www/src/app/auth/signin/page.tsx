import { AlertCircleIcon } from 'lucide-react';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { getProviders } from 'next-auth/react';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export type SignInErrorTypes =
    | 'OAuthSignin'
    | 'OAuthCallback'
    | 'OAuthCreateAccount'
    | 'Callback'
    | 'OAuthAccountNotLinked'
    | 'EmailSignin'
    | 'CredentialsSignin'
    | 'SessionRequired'
    | 'default';

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

// function fetchProviders() {
//     return getProviders();
// }

export default async function LogIn({
    searchParams,
}: {
    searchParams: { error?: SignInErrorTypes };
}) {
    const providers = Object.values((await getProviders()) ?? {});
    const csrfToken = cookies().get('next-auth.csrf-token')?.value.split('|')[0];
    const errorString =
        searchParams.error && (ErrorStrings[searchParams.error] ?? ErrorStrings.default);

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
