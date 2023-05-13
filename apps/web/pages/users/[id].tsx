import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode';
import { faHammer } from '@fortawesome/free-solid-svg-icons/faHammer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { User } from '@qwaroo/client';
import type { APIUser } from '@qwaroo/types';
import { WebRoutes } from '@qwaroo/types';
import { ms } from 'enhanced-ms';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRef } from 'react';
import { Card } from '#/components/Card';
import { GameBrowser } from '#/components/Game/Browser';
import { ScoreBrowser } from '#/components/Score/Browser';
import { PageSeo } from '#/components/Seo';
import { useClient } from '#/hooks/useClient';

const BadgeIconMap = {
    Developer: faCode,
    Moderator: faHammer,
    Verified: faCheck,
};

export default (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    const client = useClient();

    const user = useRef<User>(null!);
    if (!user.current) user.current = client.users.append(props.user);

    return <>
        <PageSeo
            url={WebRoutes.user(user.current.id)}
            title={`${user.current.displayName}'s Profile`}
            description={`View ${user.current.displayName}'s Qwaroo profile, containing their statistics, achievements, created games, and more.`}
        />

        <h2>User Profile</h2>

        <Card className="flex flex-row">
            <picture>
                <img
                    className="rounded-xl aspect-square"
                    src={user.current.avatarUrl}
                    alt={`${user.current.displayName}'s avatar`}
                    title={`${user.current.displayName}'s avatar`}
                    width={128}
                    height={128}
                />
            </picture>

            <div className="flex flex-col justify-center">
                <span className="flex items-center gap-1">
                    <h3 className="text-3xl font-bold text-qwaroo-500">
                        {user.current.displayName}
                    </h3>

                    {user.current.flags
                        .toArray()
                        .filter(
                            (flag): flag is keyof typeof BadgeIconMap =>
                                flag in BadgeIconMap
                        )
                        .map(flag => <FontAwesomeIcon
                            key={flag}
                            icon={BadgeIconMap[flag]}
                            title={flag}
                            className="bg-qwaroo-500 rounded-full text-white text-lg aspect-square p-1"
                        />)}
                </span>

                <span>
                    Joined {user.current.joinedAt.toLocaleDateString('en-NZ')},
                    about{' '}
                    {ms(Date.now() - user.current.joinedTimestamp, {
                        roundUp: true,
                    })}{' '}
                    ago.
                </span>
            </div>
        </Card>

        <section>
            <h2>Game Statistics</h2>

            <ScoreBrowser manager={user.current.scores} />
        </section>

        <section>
            <h2>Created Games</h2>

            <GameBrowser manager={user.current.games} />
        </section>
    </>;
};

export const getServerSideProps: GetServerSideProps<{
    user: APIUser;
}> = async context => {
    const id = String(context.params?.['id'] ?? '');
    if (!id) return { notFound: true };
    const client = useClient(context.req);

    const user = await client.users.fetchOne(id).catch(() => null);
    if (!user) return { notFound: true };

    return { props: { user: user.toJSON() } };
};
