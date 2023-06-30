import { executeServerAction } from 'next-sa/client';
import { GET_games } from './actions';
import Content from './content';

export const metadata = {
    title: 'Games',
    description:
        'Browse the many games of Higher or Lower we have to offer, or create your own and share it with your friends!',
};

export default async function Page() {
    const result = await executeServerAction(GET_games, { limit: 12, skip: 0 });
    return <Content data={result[0]} games={result[1]} />;
}
