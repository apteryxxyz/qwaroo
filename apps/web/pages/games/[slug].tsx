import { type APIGame, Game as GameEntity } from '@qwaroo/types';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useState } from 'react';
import { LoginModal } from '#/components/Modal/Login';
import { HigherOrLower } from '#/components/Modes/HigherOrLower';
import { GameSeo } from '#/components/Seo/Game';
import { useClient } from '#/contexts/ClientContext';

export default (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    function GameScreen() {
        switch (props.mode) {
            case GameEntity.Mode.HigherOrLower:
                return <HigherOrLower slug={props.slug} />;
            default:
                return null;
        }
    }

    const bannerUrl = new URL('https://wsrv.nl');
    bannerUrl.searchParams.set('url', props.thumbnailUrl);
    bannerUrl.searchParams.set('w', '900');
    bannerUrl.searchParams.set('h', '900');

    return <>
        <GameSeo
            url={`/games/${props.slug}`}
            title={props.title}
            description={props.longDescription}
            categories={props.categories}
            mode={props.mode}
            banner={{
                source: bannerUrl.toString(),
                width: 900,
                height: 900,
            }}
            noIndex={
                (props.publicFlags & GameEntity.Flags.Approved) ===
                GameEntity.Flags.Approved
            }
        />

        <GameScreen />

        <LoginModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
        />
    </>;
};

export const getServerSideProps: GetServerSideProps<APIGame> = async ({
    params,
}) => {
    const slug = String(params?.['slug'] ?? '');
    if (!slug) return { notFound: true };

    const game = await useClient(true)
        .games.fetchOne(slug)
        .catch(() => null);
    if (!game) return { notFound: true };

    return { props: JSON.parse(JSON.stringify(game)) };
};
