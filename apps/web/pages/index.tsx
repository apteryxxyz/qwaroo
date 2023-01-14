import type { APIGameStatistics } from '@qwaroo/types';
import { ms } from 'enhanced-ms';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Button } from '#/components/Input/Button';
import { PageSeo } from '#/components/Seo/Page';
import { useClient } from '#/contexts/ClientContext';

export default (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    const router = useRouter();

    useEffect(() => {
        void router.prefetch('/games');
    }, []);

    return <>
        <PageSeo
            title="Home"
            description="A collection of fun guessing and statistics based browser games.
            Can you guess which country has a higher population, or which movie has a better rating on IMDb?
            Find out today!"
            url="/"
        />

        <div className="flex flex-col h-[70vh] items-center justify-center">
            <h1 className="text-qwaroo-gradient font-bold text-8xl">QWAROO</h1>

            <h2 className="text-2xl">
                A collection of fun guessing and statistics based games.
            </h2>

            <Button
                className="m-2 w-[30vh] bg-qwaroo-gradient text-xl font-bold text-white"
                linkProps={{ href: '/games' }}
            >
                Browse games
            </Button>

            <div className="flex flex-col items-center justify-center font-semibold">
                <h3 className="text-lg">Global Statistics</h3>

                <span>
                    {props.totalPlays} games plays, {props.totalScore} points
                    earned
                </span>

                <span>
                    {ms(props.totalTime, {
                        shortFormat: true,
                    }) ?? '0s'}{' '}
                    spent playing
                </span>
            </div>
        </div>
    </>;
};

export const getServerSideProps: GetServerSideProps<
    APIGameStatistics
> = async () => {
    const statistics = await useClient(true)
        .games.fetchStatistics('@all')
        .catch(() => null);
    if (!statistics) return { notFound: true };

    return { props: statistics };
};
