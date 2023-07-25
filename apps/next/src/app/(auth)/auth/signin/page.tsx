import { cookies } from 'next/headers';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { AlertTriangleIcon } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { getProviders } from 'next-auth/react';
import { Alert } from '@/components/alert';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { authOptions } from '@/services/auth';

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

const ErrorStrings = {
  OAuthSignin: 'Try signing with a different account.',
  OAuthCallback: 'Try signing with a different account.',
  OAuthCreateAccount: 'Try signing with a different account.',
  Callback: 'Try signing with a different account.',
  OAuthAccountNotLinked:
    'To confirm your identity, sign in with the same account you used originally.',
  EmailSignin: 'The email could not be sent.',
  CredentialsSignin:
    'Sign in failed. Check the details you provided are correct.',
  SessionRequired: 'Please sign in to access this page.',
  default: 'Unable to sign in.',
} as const;

export const metadata = {
  title: 'Sign In to Qwaroo',
  description:
    'Sign in to Qwaroo to access your profile and save your game statistics.',
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
    searchParams.error &&
    (ErrorStrings[searchParams.error] ?? ErrorStrings.default);

  // The __Host prefix is required in production
  const csrfToken = (
    cookies().get('next-auth.csrf-token') ?? //
    cookies().get('__Host-next-auth.csrf-token')
  )?.value.split('|')[0];
  const callbackUrl = new URL(
    searchParams.callbackUrl ?? '',
    process.env.NEXTAUTH_URL,
  );

  return (
    <section className="container flex min-h-[75dvh] items-center justify-center">
      <Card>
        <Card.Header>
          <Card.Title>Sign In</Card.Title>
          <Card.Description>
            Choose your preferred sign in method.
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className="grid grid-cols-1 gap-4">
            {errorString && (
              <Alert variant="destructive">
                <AlertTriangleIcon className="h-4 w-4" />
                <Alert.Title>Sign in failed</Alert.Title>
                <Alert.Description>{errorString}</Alert.Description>
              </Alert>
            )}

            {providers.map((provider) => (
              <form key={provider.id} method="post" action={provider.signinUrl}>
                <input
                  name="csrfToken"
                  type="hidden"
                  defaultValue={csrfToken}
                />
                {callbackUrl && (
                  <input
                    name="callbackUrl"
                    type="hidden"
                    defaultValue={callbackUrl.toString()}
                  />
                )}

                <a href="https://discord.com/oauth2/authorize?client_id=69420">
                  <Button type="submit" className="w-full">
                    <ImageWithFallback
                      className="mr-1 dark:hidden"
                      src={`https://authjs.dev/img/providers/${provider.id}-dark.svg`}
                      fallbackSrc={`https://authjs.dev/img/providers/${provider.id}.svg`}
                      alt={`${provider.name} logo`}
                      width={24}
                      height={24}
                    />
                    <Image
                      className="mr-1 hidden dark:block"
                      src={`https://authjs.dev/img/providers/${provider.id}.svg`}
                      alt={`${provider.name} logo`}
                      width={24}
                      height={24}
                    />{' '}
                    Sign in using {provider.name}
                  </Button>
                </a>
              </form>
            ))}

            {providers.length === 0 && (
              <Alert variant="destructive">
                <AlertTriangleIcon className="h-4 w-4" />
                <Alert.Title>Sign in failed</Alert.Title>
                <Alert.Description>
                  There are no sign in providers configured.
                </Alert.Description>
              </Alert>
            )}
          </div>
        </Card.Content>
      </Card>
    </section>
  );
}
