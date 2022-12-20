import { faDiscord } from '@fortawesome/free-brands-svg-icons/faDiscord';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Connection, Score, User } from '@owenii/client';
import _ms from 'enhanced-ms';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useEffect, useState } from 'react';
import { HighScoreCard } from '#/components/Cards/HighScore';
import { StatisticCard } from '#/components/Cards/Statistic';
import { Loading } from '#/components/Display/Loading';
// import { Button } from '#/components/Input/Button';
import { PageSeo } from '#/components/Seo/Page';
import { useClient } from '#/contexts/ClientContext';

const ms = _ms({ shortFormat: true });

const providerIconMap = {
    discord: faDiscord,
    github: faGithub,
} as const;

export default ({
    id,
    displayName,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const client = useClient();
    const [user, setUser] = useState<User | null>(null);
    const [connection, setConnection] = useState<Connection | null>(null);
    const [scores, setScores] = useState<Score[]>([]);

    useEffect(() => {
        (async () => {
            const user = await client.users.fetchOne(id);
            const [connections, scores] = await Promise.all([
                user.fetchConnections().catch(() => null),
                user
                    .fetchScores()
                    .then(async scores => {
                        await client.games.fetchMany({
                            ids: scores?.map(s => s.gameId),
                        });
                        return scores;
                    })
                    .catch(() => null),
            ]);

            if (connections?.first()) setConnection(connections.first()!);
            if (scores) setScores(Array.from(scores.values()));
            setUser(user);
        })();
    }, []);

    function getStatistics() {
        const totalPlays = scores.reduce((a, s) => a + s.totalPlays, 0);
        const totalScore = scores.reduce((a, s) => a + s.totalScore, 0);
        const averageScore = totalPlays > 0 ? totalScore / totalPlays : 0;
        const totalTime = scores.reduce((a, s) => a + s.totalTime, 0);

        return [
            ['Games Played', totalPlays],
            ['Total Score', totalScore],
            ['Average Score', averageScore],
            ['Total Play Time', totalTime],
        ] as const;
    }

    return <>
        <PageSeo
            title={displayName}
            description={`View ${displayName}'s Owenii profile, containing their statistics, achievements, created games, and more.`}
            url={`/users/${id}`}
        />

        {!user && <Loading />}

        {user && <div className="flex flex-col gap-3">
            <div className="flex gap-3 p-3 bg-white dark:bg-neutral-800 rounded-xl">
                {/* Information */}

                <picture>
                    <img
                        className="rounded-xl"
                        src={user.avatarUrl}
                        alt={`${displayName}'s avatar`}
                        width={128}
                        height={128}
                    />
                </picture>

                <div className="flex flex-col justify-center">
                    <h1 className="font-bold text-3xl text-sky-400">
                        {displayName}
                    </h1>

                    <span>
                        Joined {user.joinedAt.toLocaleDateString()}, about{' '}
                        {ms(Date.now() - user.joinedAt.getTime())} ago
                    </span>

                    {connection && <span>
                        via{' '}
                        <FontAwesomeIcon
                            icon={providerIconMap[connection.providerName]}
                        />{' '}
                        as {connection.accountUsername}
                    </span>}
                </div>

                {/* {user.id ===
                    client.id && <div className="flex flex-col ml-auto p-1 border border-red-500 rounded-xl">
                    <span className="font-bold text-red-500 text-center">
                        DANGER ZONE
                    </span>

                    <div className="flex flex-col gap-1 text-white h-full items-center justify-center">
                        <Button
                            className="!bg-red-500 !w-full"
                            onClick={() => ''}
                        >
                            Logout Everywhere
                        </Button>

                        <Button
                            className="!bg-red-500 !w-full"
                            onClick={() => ''}
                        >
                            Delete Account
                        </Button>
                    </div>
                </div>} */}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Statistics */}

                {getStatistics().map(([name, value]) => <StatisticCard
                    key={name}
                    value={value}
                    description={name}
                    formatNumber={
                        name === 'Total Play Time'
                            ? v => ms(v, { shortFormat: true }) ?? 'N/A'
                            : undefined
                    }
                />)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Games */}

                {scores.map(score => <HighScoreCard
                    key={score.gameId}
                    score={score}
                    game={client.games.get(score.gameId)!}
                />)}
            </div>
        </div>}
    </>;
};

export const getServerSideProps: GetServerSideProps<{
    id: string;
    displayName: string;
}> = async ({ params }) => {
    const id = String(params?.['id'] ?? '');
    if (!id) return { notFound: true };

    const user = await useClient(true)
        .users.fetchOne(id)
        .catch(() => null);
    if (!user) return { notFound: true };

    return { props: { id, displayName: user.displayName } };
};
