import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
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

export const metadata = {
  title: 'Sign Out from Qwaroo',
  description: 'Sign out from Qwaroo.',
};

export default async function SignOut() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/');

  const csrfToken = cookies().get('next-auth.csrf-token')?.value.split('|')[0];

  return (
    <section className="container flex min-h-[75dvh] items-center justify-center">
      <Card>
        <Card.Header>
          <Card.Title>Sign out</Card.Title>
          <Card.Description>
            Are you sure you want to sign out?
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <form method="post" action="/api/auth/signout">
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

            <Button type="submit" className="w-full">
              Sign out
            </Button>
          </form>
        </Card.Content>
      </Card>
    </section>
  );
}
