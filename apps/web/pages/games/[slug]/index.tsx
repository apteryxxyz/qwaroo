import type { Game, User } from '@qwaroo/client';
import type { APIGame, APIScore, APIUser } from '@qwaroo/types';
import { WebRoutes } from '@qwaroo/types';
import { ms } from 'enhanced-ms';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { Card } from '#/components/Card';
import { Button } from '#/components/Input/Button';
import { ScoreBrowser } from '#/components/Score/Browser';
import { GameSeo } from '#/components/Seo';
import { useClient } from '#/contexts/Client';
import { removeUndefined } from '#/utilities/object';

export default (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    const client = useClient();
    const router = useRouter();
    const embedRef = useRef<HTMLIFrameElement>(null);

    const game = useRef<Game>(null!);
    if (!game.current) game.current = client.games.append(props.game);

    const creator = useRef<User>(null!);
    if (!creator.current) creator.current = client.users.append(props.creator);

    const score = useRef<APIScore | null>(null);
    if (!score.current && props.score)
        score.current = game.current.scores.append(props.score);

    // Functions

    const handleEmbedClick = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();

        const playRoute = WebRoutes.playGame(game.current.slug);
        void router.push(playRoute);
    };

    const handleEmbedLoad = () => {
        setTimeout(() => {
            const embedWindow = embedRef?.current?.contentWindow;
            if (!embedWindow) return;

            embedWindow.clearEventListeners();
            embedWindow.addEventListener('click', handleEmbedClick);
        }, 1_000);
    };

    return <>
        <GameSeo game={props.game} />

        <h2>{game.current.title}</h2>

        <div className="lg:grid grid-cols-3 gap-3">
            <div className="flex flex-col col-span-2 gap-3">
                <Card className="flex flex-col w-full">
                    <p>
                        {game.current.longDescription}
                        <br />
                        Created by{' '}
                        <a
                            href={WebRoutes.user(creator.current.id)}
                            className="text-qwaroo-500 font-bold"
                        >
                            {creator.current.displayName}
                        </a>
                        , on{' '}
                        {game.current.createdAt.toLocaleDateString('en-NZ')},
                        about{' '}
                        {ms(Date.now() - game.current.createdTimestamp, {
                            roundUp: true,
                        })}{' '}
                        ago, last played around{' '}
                        {ms(Date.now() - game.current.lastPlayedTimestamp, {
                            roundUp: true,
                        })}
                        .
                    </p>
                </Card>

                <div className="flex [&>*]:!w-full gap-3">
                    <Button
                        className="text-3xl font-bold !bg-qwaroo-500"
                        linkProps={{
                            href: WebRoutes.playGame(game.current.slug),
                        }}
                    >
                        Play
                    </Button>

                    {props.isCreator && <Button
                        className="text-3xl font-bold !bg-qwaroo-500"
                        linkProps={{
                            href: WebRoutes.editGame(game.current.slug),
                        }}
                    >
                        Edit
                    </Button>}
                </div>

                <section className="col-span-3 lg:col-span-2">
                    <h2>Leaderboard</h2>

                    <ScoreBrowser manager={game.current.scores} />
                </section>
            </div>

            <section className="hidden lg:block">
                <iframe
                    ref={embedRef}
                    className="rounded-xl w-full aspect-[9/16]"
                    src={WebRoutes.previewGame(game.current.slug)}
                    onLoad={handleEmbedLoad}
                />
            </section>
        </div>

        {/* <section className="contents lg:grid grid-cols-3">
            

            <Button
                className="text-3xl font-bold !bg-qwaroo-500"
                linkProps={{ href: WebRoutes.playGame(game.current.slug) }}
            >
                PLAY
            </Button>
        </section>

        <div className="grid grid-cols-3 gap-3">
            

            <section className="hidden lg:block">
                <iframe
                    ref={embedRef}
                    className="rounded-xl w-full aspect-[9/16]"
                    src={WebRoutes.previewGame(game.current.slug)}
                    onLoad={handleEmbedLoad}
                />
            </section>
        </div> */}
    </>;
};

export const getServerSideProps: GetServerSideProps<{
    game: APIGame;
    creator: APIUser;
    score?: APIScore;
    isCreator: boolean;
}> = async context => {
    const slug = String(context.params?.['slug'] ?? '');
    if (!slug) return { notFound: true };
    const client = useClient(context.req);

    const game = await client.games.fetchOne(slug).catch(() => null);
    if (!game) return { notFound: true };

    const creator = await game.fetchCreator().catch(() => null);
    if (!creator) return { notFound: true };

    const score = client.id
        ? await game.scores.fetchOne(client.id).catch(() => null)
        : null;

    return {
        props: removeUndefined({
            game: game.toJSON(),
            creator: creator.toJSON(),
            score: score?.toJSON(),
            isCreator: client.id === creator.id,
        }),
    };
};
