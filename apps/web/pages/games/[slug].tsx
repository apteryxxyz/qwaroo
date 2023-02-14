import { Game } from '@qwaroo/client';
import type { APIGame, APIScore } from '@qwaroo/types';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { HigherOrLower } from '#/components/Modes/HigherOrLower';
import { GameSeo } from '#/components/Seo/Game';
import { useClient } from '#/contexts/Client';

export default (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    function GameScreen() {
        switch (props.game.mode) {
            case Game.Mode.HigherOrLower:
                return <HigherOrLower game={props.game} score={props.score} />;
            default:
                return null;
        }
    }

    return <>
        <GameSeo game={props.game} />

        <GameScreen />
    </>;
};

export const getServerSideProps: GetServerSideProps<{
    game: APIGame;
    score?: APIScore;
}> = async context => {
    const slug = String(context.params?.['slug'] ?? '');
    if (!slug) return { notFound: true };
    const client = useClient(context.req);

    const game = await client.games.fetchOne(slug).catch(() => null);
    if (!game) return { notFound: true };
    const score = client.id
        ? await game.scores.fetchOne(client.id).catch(() => null)
        : undefined;

    const props = { game: game.toJSON(), score: score?.toJSON() };
    if (!props.score) Reflect.deleteProperty(props, 'score');
    return { props };
};
