import { type APIGame, Game as GameEntity } from '@qwaroo/types';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { LoginModal } from '#/components/Modal/Login';
import { HigherOrLower } from '#/components/Modes/HigherOrLower';
import { GameSeo } from '#/components/Seo/Game';
import { useClient } from '#/contexts/ClientContext';

export default (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    const client = useClient();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const reminderKey = 'qwaroo.has_seen_reminder';
        if (client.id || localStorage.getItem(reminderKey)) return;

        localStorage.setItem(reminderKey, 'true');
        // prettier-ignore
        const showToast = () => toast.info(
            'Optionally, you can sign in to save your high scores and ' +
            'statistics. You will also be able to access your account ' +
            'across multiple devices.',
            {
                position: 'top-center',
                theme: 'dark',
                autoClose: 8_000,
                onClick: () => setIsModalOpen(true),
            }
        );

        const timeout = setTimeout(showToast, 1_000);
        return () => {
            clearTimeout(timeout);
        };
    }, [client.id]);

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

    return { props: game.toJSON() };
};
