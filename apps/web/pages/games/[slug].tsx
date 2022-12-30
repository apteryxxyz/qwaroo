import { Game as GameEntity } from '@qwaroo/types';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { LoginModal } from '#/components/Modal/Login';
import { HigherOrLower } from '#/components/Modes/HigherOrLower';
import { PageSeo } from '#/components/Seo/Page';
import { useClient } from '#/contexts/ClientContext';

export default ({
    mode,
    slug,
    ...props
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const client = useClient();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const reminderKey = 'qwaroo.has_seen_reminder';
        if (client.id || localStorage.getItem(reminderKey)) return;

        localStorage.setItem(reminderKey, 'true');
        // prettier-ignore
        const showToast = () => toast.info(
            'You can optionally sign in to save your high scores and ' +
            'statistics, and will also be able to access your account '+
            'across multiple devices.', {
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

    return <>
        <PageSeo
            title={props.title}
            description={props.longDescription}
            url={`/games/${slug}`}
        />

        {mode === GameEntity.Mode.HigherOrLower && <HigherOrLower
            slug={slug}
        />}

        <LoginModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
        />
    </>;
};

export const getServerSideProps: GetServerSideProps<{
    slug: string;
    mode: GameEntity.Mode;
    title: string;
    longDescription: string;
}> = async ({ params }) => {
    const slug = String(params?.['slug'] ?? '');
    if (!slug) return { notFound: true };

    const game = await useClient(true)
        .games.fetchOne(slug)
        .catch(() => null);
    if (!game) return { notFound: true };

    const { title, mode, longDescription } = game.toJSON();
    return { props: { slug, title, mode, longDescription } };
};
