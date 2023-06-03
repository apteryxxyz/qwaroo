import { redirect } from 'next/navigation';
import { getSource } from '../actions';
import Content from './content';

interface PageProps {
    searchParams: { source?: string };
}

export default async function Page(props: PageProps) {
    if (!props.searchParams.source) return redirect('/games/create');

    const source = await getSource({ slug: props.searchParams.source });
    if (!source) return redirect('/games/create');

    return <Content source={source} />;
}
