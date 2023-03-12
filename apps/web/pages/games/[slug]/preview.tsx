import { Game } from '@qwaroo/client';
import type { APIGame, APIScore } from '@qwaroo/types';
import { WebRoutes } from '@qwaroo/types';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { GameSeo } from '#/components/Seo';
import { useClient } from '#/contexts/Client';
import { useEventListener } from '#/hooks/useEventListener';
import { HigherOrLower } from '#/modes/HigherOrLower';
import { removeUndefined } from '#/utilities/object';

export default (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    const playRoute = WebRoutes.playGame(props.game.slug);
    const handleClick = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();
        window.open(playRoute, '_blank');
    };

    useEventListener('click', handleClick);

    return <>
        <GameSeo game={props.game} />

        <div className="cursor-pointer">
            {props.game.mode ===
                Game.Mode.HigherOrLower && <HigherOrLower.Gameplay.Embed
                game={props.game}
                score={props.score}
                isPreview
            />}
        </div>
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

    return {
        props: removeUndefined({
            game: game.toJSON(),
            isLayoutNeeded: false,
        }),
    };
};
