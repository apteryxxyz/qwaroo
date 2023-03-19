import { faCoffee } from '@fortawesome/free-solid-svg-icons/faCoffee';
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
            title="Discord Bot"
            description="Get ready to level up your Discord experience with our collection of exciting guessing
            and statistics-based games! Our Discord bot brings the fun right to your server!
            Can you guess which country has a higher population, or which movie has a better rating on IMDb?
            Find out today!"
            url="/discord"
        />

        <section className="flex flex-col m-auto max-w-3xl lg:my-[15%]">
            <h1
                aria-hidden
                className="text-qwaroo-500 text-center text-8xl font-bold"
            >
                <span className="text-8xl font-bold">QWAROO</span>
                <span className="hidden lg:inline text-4xl">, </span>
                <span className="block lg:inline text-4xl">but on Discord</span>
            </h1>

            <h2 className="text-xl text-center">
                Get ready to level up your Discord experience with our
                collection of exciting guessing and statistics-based games! Our
                Discord bot brings the fun right to your server!
            </h2>

            <span className="text-center">
                {props.statistics.totalPlays} games played,{' '}
                {props.statistics.totalScore} points scored, more than{' '}
                {ms(props.statistics.totalTime, { shortFormat: true }) ?? '0s'}{' '}
                spent playing
            </span>

            <div className="flex flex-col items-center gap-3 m-5 font-bold">
                <div className="flex gap-3 text-xl">
                    <Button
                        linkProps={{
                            href: WebRoutes.discordInvite(),
                            newTab: true,
                        }}
                    >
                        Invite to Server
                    </Button>

                    <Button
                        linkProps={{
                            href: WebRoutes.discordSupport(),
                            newTab: true,
                        }}
                    >
                        Join Support
                    </Button>

                    <Button
                        linkProps={{
                            href: WebRoutes.donate(),
                            newTab: true,
                        }}
                        iconProp={faCoffee}
                    ></Button>
                </div>

                <div className="flex gap-3"></div>
            </div>
        </section>

        <Section imageSrc="/images/discord/play.png" imageSide="right">
            <h3 className="text-center text-3xl font-bold">Guessing Games</h3>

            <p className="text-center">
                Test your skills with a variety of guessing and statistics game
                modes, including different twists on the popular "Higher or
                Lower" game.
            </p>
        </Section>

        <Section imageSrc="/images/discord/games.png" imageSide="left">
            <h3 className="text-center text-3xl font-bold">Trivia Challenge</h3>

            <p className="text-center">
                Choose from a range of game modes and put your knowledge to the
                test. Can you accurately guess which country is larger? Or which
                movie has a higher rating?
            </p>
        </Section>

        <Section imageSrc="/images/discord/profile.png" imageSide="right">
            <h3 className="text-center text-3xl font-bold">
                Profile & Leaderboards
            </h3>

            <p className="text-center">
                Save your progress and compete with other players for the
                highest score on the leaderboard!
            </p>
        </Section>

        <footer>
            <Links />
            <Copyright includeDiscord />
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
