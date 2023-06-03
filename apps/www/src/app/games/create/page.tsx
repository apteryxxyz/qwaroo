import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { getSources } from './actions';
import Content from './content';
import { authOptions } from '@/utilities/authOptions';

export default async function Page() {
    const session = await getServerSession(authOptions);
    if (!session?.user) return redirect('/auth/signin?callbackUrl=/games/create');

    const sources = await getSources({});

    return <Content sources={sources} />;
}
