import { redirect } from 'next/dist/client/components/redirect';
import { getServerSession } from 'next-auth';
import { executeServerAction } from 'next-sa/client';
import { GET_sources } from './actions';
import Content from './content';
import { authOptions } from '@/services/Authentication';

export default async function Page() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect('/auth/signin?callbackUrl=/games/create');

    return <Content sources={await executeServerAction(GET_sources)} />;
}
