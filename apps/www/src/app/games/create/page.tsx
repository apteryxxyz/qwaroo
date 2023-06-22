import { redirect } from 'next/dist/client/components/redirect';
import { getServerSession } from 'next-auth';
import { executeServerAction } from 'next-sa/client';
import { getSources } from './actions';
import Content from './content';
import { authOptions } from '@/utilities/authOptions';

export default async function Page() {
    const session = await getServerSession(authOptions);
    if (!session?.user) return redirect('/auth/signin?callbackUrl=/games/create');

    return <Content sources={await executeServerAction(getSources)} />;
}
