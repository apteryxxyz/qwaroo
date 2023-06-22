import { redirect } from 'next/dist/client/components/redirect';
import { executeServerAction } from 'next-sa/client';
import { getSource } from '../actions';
import Content from './content';

interface PageProps {
    searchParams: { source?: string };
}

export default async function Page(props: PageProps) {
    const slug = props.searchParams.source;
    const source = slug && (await executeServerAction(getSource, { slug }));
    if (!source) return redirect('/games/create');

    return <Content source={source} />;
}
