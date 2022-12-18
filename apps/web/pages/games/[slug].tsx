import { Game } from '@owenii/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Loading } from '#/components/Display/Loading';
import { NotFound } from '#/components/Display/NotFound';
import { HigherOrLower } from '#/components/Modes/HigherOrLower';
import { useClient } from '#/contexts/ClientContext';

export default () => {
    const client = useClient();
    const router = useRouter();
    const [game, setGame] = useState<Game | undefined | null>(undefined);

    useEffect(() => {
        const slug = String(router.query['slug'] ?? '');

        if (slug)
            client.games
                .fetchOne(slug)
                .then(game => setGame(game))
                .catch(() => setGame(null));
    }, [router.isReady]);

    if (game === undefined) return <Loading />;
    if (game === null) return <NotFound />;

    return game.mode === Game.Entity.Mode.HigherOrLower ? (
        <HigherOrLower game={game} />
    ) : (
        <NotFound />
    );
};
