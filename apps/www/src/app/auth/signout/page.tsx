import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { authOptions } from '@/utilities/auth';

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

export default async function SignOut() {
    const session = await getServerSession(authOptions);
    if (!session) return redirect('/');

    const csrfToken = cookies().get('next-auth.csrf-token')?.value.split('|')[0];

    return <section className="container min-h-[75dvh] flex items-center justify-center">
        <Card>
            <Card.Header>
                <Card.Title>Sign out</Card.Title>
                <Card.Description>Are you sure you want to sign out?</Card.Description>
            </Card.Header>

            <Card.Content>
                <form method="post" action="/api/auth/signout">
                    <input type="hidden" name="csrfToken" value={csrfToken} />
                    <Button type="submit" className="w-full">
                        Sign out
                    </Button>
                </form>
            </Card.Content>
        </Card>
    </section>;
}
