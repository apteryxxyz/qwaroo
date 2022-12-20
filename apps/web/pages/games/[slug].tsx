import { Game } from '@owenii/client';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { HigherOrLower } from '#/components/Modes/HigherOrLower';
import { PageSeo } from '#/components/Seo/Page';
import { useClient } from '#/contexts/ClientContext';

export default ({
    mode,
    slug,
    ...props
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    return <>
        <PageSeo
            title={props.title}
            description={props.longDescription}
            url={`/games/${slug}`}
        />

        {mode === Game.Entity.Mode.HigherOrLower && <HigherOrLower
            slug={slug}
        />}
    </>;
};

export const getServerSideProps: GetServerSideProps<{
    slug: string;
    mode: Game.Entity.Mode;
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
