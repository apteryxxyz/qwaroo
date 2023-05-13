import { Game } from '@qwaroo/client';
import type { APIGame, APIScore } from '@qwaroo/types';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { GameSeo } from '#/components/Seo';
import { useClient } from '#/hooks/useClient';
import { HigherOrLower } from '#/modes/HigherOrLower';
import { removeUndefined } from '#/utilities/object';

export default (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    return <>
        <GameSeo game={props.game} />

        {props.game.mode ===
            Game.Mode.HigherOrLower && <HigherOrLower.Gameplay.Embed
            game={props.game}
            score={props.score}
        />}
    </>;
};

export const getServerSideProps: GetServerSideProps<{
    game: APIGame;
    score?: APIScore;
    isLayoutNeeded: boolean;
}> = async context => {
    const slug = String(context.params?.['slug'] ?? '');
    if (!slug) return { notFound: true };
    const client = useClient(context.req);

    const game = await client.games.fetchOne(slug).catch(() => null);
    if (!game) return { notFound: true };

    const score = client.id
        ? await game.scores.fetchOne(client.id).catch(() => null)
        : undefined;

    return {
        props: removeUndefined({
            game: game.toJSON(),
            score: score?.toJSON(),
            isLayoutNeeded: false,
        }),
    };
};
