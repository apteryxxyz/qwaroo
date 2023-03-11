import type { APIGameStatistics } from '@qwaroo/types';
import { WebRoutes } from '@qwaroo/types';
import { ms } from 'enhanced-ms';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Copyright } from '#/components/Footer/Copyright';
import { Links } from '#/components/Footer/Links';
import { Button } from '#/components/Input/Button';
import { Section } from '#/components/Section';
import { PageSeo } from '#/components/Seo';
import { useClient } from '#/contexts/Client';

export default (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    return <>
        <PageSeo
            title="Home"
            description="Ready to have some fun? Check out our collection of exciting guessing and statistics-based games!
            Can you guess which country has a higher population, or which movie has a better rating on IMDb?
            Find out today!"
            url="/"
        />

        <section className="flex flex-col m-auto max-w-3xl lg:my-[15%]">
            <h1
                aria-hidden
                className="text-qwaroo-400 text-center text-8xl font-bold"
            >
                QWAROO
            </h1>

            <h2 className="text-xl text-center max-w-xl">
                Ready to have some fun? Check out our collection of exciting
                guessing and statistics-based games!
            </h2>

            <span className="text-center">
                {props.statistics.totalPlays} games played,{' '}
                {props.statistics.totalScore} points scored, more than{' '}
                {ms(props.statistics.totalTime, { shortFormat: true }) ?? '0s'}{' '}
                spent playing
            </span>

            <div className="flex flex-col items-center gap-3 m-5 font-bold">
                <div className="flex gap-3 [&>*]:!min-w-[220px] [&>*]:!min-h-[50px] text-xl">
                    <Button linkProps={{ href: WebRoutes.games() }}>
                        Browse Games
                    </Button>
                </div>

                <div className="flex gap-3 [&>*]:!min-w-[160px] [&>*]:!min-h-[40px]">
                    <Button linkProps={{ href: WebRoutes.discord() }}>
                        Play on Discord
                    </Button>
                </div>
            </div>
        </section>

        <Section imageSrc="/images/web/play.png" imageSide="right">
            <h3 className="text-center text-3xl font-bold">Guessing Games</h3>

            <p className="text-center">
                Test your skills with a variety of guessing and statistics game
                modes, including different twists on the popular "Higher or
                Lower" game.
            </p>
        </Section>

        <Section imageSrc="/images/web/games.png" imageSide="left">
            <h3 className="text-center text-3xl font-bold">Trivia Challenge</h3>

            <p className="text-center">
                Choose from a range of game modes and put your knowledge to the
                test. Can you accurately guess which country is larger? Or which
                movie has a higher rating?
            </p>
        </Section>

        <Section imageSrc="/images/web/profile.png" imageSide="right">
            <h3 className="text-center text-3xl font-bold">
                Profile & Leaderboards
            </h3>

            <p className="text-center">
                Sign in to save your progress and compete with other players for
                the highest score on the leaderboard!
            </p>
        </Section>

        <footer>
            <Links />
            <Copyright />
        </footer>
    </>;
};

export const getServerSideProps: GetServerSideProps<{
    statistics: APIGameStatistics;
}> = async context => {
    const client = useClient(context.req);
    const statistics = await client.games.fetchStatistics();
    return { props: { statistics } };
};
