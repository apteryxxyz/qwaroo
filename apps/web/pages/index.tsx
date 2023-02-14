import type { APIGameStatistics } from '@qwaroo/types';
import { WebRoutes } from '@qwaroo/types';
import { ms } from 'enhanced-ms';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Button } from '#/components/Input/Button';
import { PageSeo } from '#/components/Seo';
import { useClient } from '#/contexts/Client';

export default (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    return <section className="flex flex-col m-auto">
        <PageSeo
            title="Home"
            description="A collection of fun guessing and statistics based browser games.
            Can you guess which country has a higher population, or which movie has a better rating on IMDb?
            Find out today!"
            url="/"
        />

        <h1
            aria-hidden
            className="text-qwaroo-400 text-center text-8xl font-bold"
        >
            QWAROO
        </h1>

        <h2 className="text-2xl text-center">
            A collection of fun guessing and statistics based games.
        </h2>

        <span className="text-center">
            {props.statistics.totalPlays} games played,{' '}
            {props.statistics.totalScore} points scored, more than{' '}
            {ms(props.statistics.totalTime, { shortFormat: true }) ?? '0s'}{' '}
            spent playing
        </span>

        <div className="flex mx-auto my-5 gap-3 [&>*]:!min-w-[200px] [&>*]:!min-h-[50px] [&>*]:text-lg">
            <Button
                className="animate-scale"
                linkProps={{ href: WebRoutes.games() }}
            >
                Browse games
            </Button>

            {/* <Button linkProps={{ href: '/posts' }}>Blog posts</Button> */}
        </div>
    </section>;
};

export const getServerSideProps: GetServerSideProps<{
    statistics: APIGameStatistics;
}> = async context => {
    const client = useClient(context.req);
    const statistics = await client.games.fetchStatistics();
    return { props: { statistics } };
};
