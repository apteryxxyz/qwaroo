import { getGames } from './actions';
import Content from './content';

export const metadata = {
    title: 'Games',
    description:
        'Browse the many games of Higher or Lower we have to offer, or create your own and share it with your friends!',
};

// TODO: Pass page props to content component, for autofilling search form
// Could pass initial games data to save a request on the client
export default async function Page() {
    const output = await getGames({
        // TODO: Pass page props to this
        limit: 12,
        skip: 0,
    });

    if (!output.success) return null;

    return <Content data={output.data[0]} games={output.data[1]} />;
}
