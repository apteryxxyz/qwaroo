import { faDiscord } from '@fortawesome/free-brands-svg-icons/faDiscord';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { faReddit } from '@fortawesome/free-brands-svg-icons/faReddit';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode';
import { faHammer } from '@fortawesome/free-solid-svg-icons/faHammer';
import { faPalette } from '@fortawesome/free-solid-svg-icons/faPalette';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//
import type { Connection, Score, User } from '@qwaroo/client';
import ms from 'enhanced-ms';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useEffect, useState } from 'react';
import { HighscoreCard } from '#/components/Cards/Highscore';
import { StatisticCard } from '#/components/Cards/Statistic';
import { Loading } from '#/components/Display/Loading';
// import { Button } from '#/components/Input/Button';
import { PageSeo } from '#/components/Seo/Page';
import { useClient } from '#/contexts/ClientContext';

const providerIconMap = {
    discord: faDiscord,
    reddit: faReddit,
    github: faGithub,
} as const;

const providerNameMap = {
    discord: 'Discord',
    reddit: 'Reddit',
    github: 'GitHub',
};

const badgeIconMap = {
    Developer: faCode,
    Moderator: faHammer,
    Verified: faCheck,
    Creator: faPalette,
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
            ['Games Played', Number.isNaN(totalPlays) ? 0 : totalPlays],
            ['Total Score', Number.isNaN(totalScore) ? 0 : totalScore],
            ['Average Score', Number.isNaN(averageScore) ? 0 : averageScore],
            ['Total Time Played', Number.isNaN(totalTime) ? 0 : totalTime],
        ] as const;
    }

    return <>
        <PageSeo
            title={displayName}
            description={`View ${displayName}'s Qwaroo profile, containing their statistics, achievements, created games, and more.`}
            url={`/users/${id}`}
        />

        {!user && <Loading />}

        {user && <div className="flex flex-col gap-3">
            <section>
                <h2 className="font-bold text-3xl">User Profile</h2>

                <div className="flex gap-3 p-3 bg-white dark:bg-neutral-800 rounded-xl">
                    {/* Information */}

                    <picture>
                        <img
                            className="rounded-xl aspect-square"
                            src={user.avatarUrl}
                            alt={`${displayName}'s avatar`}
                            title={`${displayName}'s avatar`}
                            width={128}
                            height={128}
                        />
                    </picture>

                    <div className="flex flex-col justify-center">
                        <span className="flex items-center">
                            <h3 className="text-3xl font-bold text-qwaroo-400">
                                {displayName}
                            </h3>

                            {user.flags
                                .toArray()
                                .filter(
                                    (flag): flag is keyof typeof badgeIconMap =>
                                        flag in badgeIconMap
                                )
                                .map(flag => <FontAwesomeIcon
                                    key={flag}
                                    icon={badgeIconMap[flag]}
                                    title={flag}
                                    className="bg-qwaroo-gradient rounded-full text-white text-lg aspect-square ml-2 p-[0.3rem]"
                                    // className="bg-qwaroo-gradient rounded-full text-white text-xl ml-2 aspect-square p-1"
                                />)}
                        </span>

                        <p>
                            Joined {user.joinedAt.toLocaleDateString()}, about{' '}
                            {ms(Date.now() - user.joinedAt.getTime(), {
                                roundUp: true,
                            })}{' '}
                            ago
                            {connection && <span>
                                <br />
                                via{' '}
                                <FontAwesomeIcon
                                    title={
                                        providerNameMap[connection.providerName]
                                    }
                                    icon={
                                        providerIconMap[connection.providerName]
                                    }
                                />{' '}
                                as {connection.accountUsername}
                            </span>}
                            .
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="font-bold text-3xl">Game Statistics</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {/* Statistics */}

                    {getStatistics().map(([name, value]) => <StatisticCard
                        key={name}
                        value={value}
                        description={name}
                        formatNumber={
                            name === 'Total Time Played'
                                ? v => ms(v, { shortFormat: true }) ?? '0s'
                                : undefined
                        }
                    />)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    {/* Per Game Statistics */}

                    {scores.map(score => <HighscoreCard
                        key={score.gameId}
                        score={score}
                        game={client.games.get(score.gameId)!}
                        isMe={user.id === client.id}
                    />)}
                </div>
            </section>

            {/* TODO: Show this users created games */}
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
