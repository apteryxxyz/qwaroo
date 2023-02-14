import type { ScoreManager } from '@qwaroo/client';
import { Game, ScoreListing, User } from '@qwaroo/client';
import type { FetchScoresOptions } from '@qwaroo/types';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../Input/Button';
import { Loading } from '../Loading';
import { ScoreCard } from './Card';
import { useClient } from '#/contexts/Client';
import { useIsFirstRender } from '#/hooks/useIsFirstRender';

export function ScoreBrowser<P extends Game | User>(
    props: ScoreBrowser.Props<P>
) {
    const client = useClient();
    const router = useRouter();

    const scores = useRef<ScoreListing<P> | null>(null);
    const [options, setOptions] = useState<FetchScoresOptions>({});
    const [, setIsLoadingOptions] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    async function fetchAdditionalScores(listing: ScoreListing<P>) {
        const newScores = await listing.fetchMore();

        const gameIds = Array.from(
            new Set(newScores.map(s => s.gameId))
        ).filter(id => !client.games.has(id));
        if (gameIds.length > 0) await client.games.fetchMany({ ids: gameIds });

        const userIds = Array.from(
            new Set(newScores.map(s => s.userId))
        ).filter(id => !client.users.has(id));
        if (userIds.length > 0) await client.users.fetchMany({ ids: userIds });
    }

    async function loadMoreScores() {
        if (!scores.current || isLoadingMore === true) return;
        setIsLoadingMore(true);
        await fetchAdditionalScores(scores.current);
        setIsLoadingMore(false);
    }

    async function loadNewOptions(newOptions: Record<string, unknown>) {
        setIsLoadingOptions(true);

        const combinedOptions = ScoreBrowser.parseOptions(options, newOptions);
        setOptions(combinedOptions);
        if (props.enablePathQuery)
            void router.replace(
                {
                    pathname: router.pathname,
                    query: { ...combinedOptions },
                },
                undefined,
                { shallow: true }
            );

        const listing = new ScoreListing(props.manager, combinedOptions, -1);
        await fetchAdditionalScores(listing);
        scores.current = listing;

        setIsLoadingOptions(false);
    }

    const isFirstRender = useIsFirstRender();
    useEffect(() => {
        if (isFirstRender) {
            if (props.enablePathQuery) {
                void loadNewOptions(router.query);
            } else {
                void loadNewOptions({});
            }
        }
    }, [router.query]);

    return <div className="flex flex-col gap-3 w-full">
        {scores.current ? (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {scores.current.map((score, _, self) => <ScoreCard
                    key={score.id}
                    score={score}
                    user={
                        self.manager.parent instanceof Game
                            ? client.users.get(score.userId)
                            : undefined
                    }
                    game={
                        self.manager.parent instanceof User
                            ? client.games.get(score.gameId)
                            : undefined
                    }
                />)}

                {/* Load more */}
                {scores.current.hasMore && <Button
                    className="col-span-full"
                    onClick={loadMoreScores}
                >
                    {isLoadingMore ? 'Loading...' : 'Load more'}
                </Button>}
            </section>
        ) : (
            <Loading.Circle className="mt-[33px]" />
        )}
    </div>;
}

export namespace ScoreBrowser {
    export interface Props<P extends Game | User> {
        manager: ScoreManager<P>;
        enablePathQuery?: boolean;
    }

    export function parseOptions(...allOptions: FetchScoresOptions[]) {
        const options = Object.assign({}, ...allOptions);

        for (const [key, value] of Object.entries(options)) {
            if (!value || ['limit', 'skip'].includes(key))
                Reflect.deleteProperty(options, key);
            else if (['ids'].includes(key))
                Reflect.set(options, key, [value].flat().join(','));
        }

        return options as Record<string, string | number>;
    }
}
