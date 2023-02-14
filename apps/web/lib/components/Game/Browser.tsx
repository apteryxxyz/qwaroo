import {
    faSearch,
    faSortAmountDownAlt,
    faSortAmountUpAlt,
} from '@fortawesome/free-solid-svg-icons';
import type { GameManager } from '@qwaroo/client';
import { GameListing } from '@qwaroo/client';
import type { FetchGamesOptions } from '@qwaroo/types';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../Input/Button';
import { Dropdown } from '../Input/Dropdown';
import { Textbox } from '../Input/Textbox';
import { Loading } from '../Loading';
import { GameCard } from './Card';
import { useClient } from '#/contexts/Client';
import { useIsFirstRender } from '#/hooks/useIsFirstRender';

export function GameBrowser(props: GameBrowser.Props) {
    const client = useClient();
    const router = useRouter();

    const games = useRef<GameListing | null>(null);
    const [options, setOptions] = useState<FetchGamesOptions>({});
    const [, setIsLoadingOptions] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    async function fetchAdditionalGames(listing: GameListing) {
        const newGames = await listing.fetchMore();

        const creatorIds = Array.from(
            new Set(newGames.map(game => game.creatorId))
        ).filter(id => !client.users.has(id));
        if (creatorIds.length > 0)
            await client.users.fetchMany({ ids: creatorIds });
    }

    async function loadMoreGames() {
        if (!games.current || isLoadingMore === true) return;
        setIsLoadingMore(true);

        await fetchAdditionalGames(games.current);

        setIsLoadingMore(false);
    }

    async function loadNewOptions(newOptions: Record<string, unknown>) {
        setIsLoadingOptions(true);

        const combinedOptions = GameBrowser.parseOptions(options, newOptions);
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

        const listing = new GameListing(props.manager, combinedOptions, -1);
        await fetchAdditionalGames(listing);
        games.current = listing;

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
        {/* Filter bar */}
        <section className="flex flex-wrap gap-1">
            {/* Search box */}
            <Textbox
                ariaRole="searchbox"
                placeHolder="Search games..."
                iconProp={faSearch}
                defaultValue={options.term}
                onValue={v => loadNewOptions({ term: v })}
                enableIcon
                enableEnter
            />

            {/* Sort by */}
            <Dropdown
                options={[
                    { label: 'Most Played', value: 'totalPlays' },
                    {
                        label: 'Recently Updated',
                        value: 'updatedTimestamp',
                    },
                    {
                        label: 'Recently Played',
                        value: 'lastPlayedTimestamp',
                    },
                ]}
                defaultValue={options.sort}
                onChange={v => loadNewOptions({ sort: v })}
            />

            {/* Sort direction */}
            <Button
                hoverText="Change sort order"
                ariaLabel="Change sort order"
                iconProp={
                    options.order === 'asc'
                        ? faSortAmountUpAlt
                        : faSortAmountDownAlt
                }
                onClick={() =>
                    void loadNewOptions({
                        order: options.order === 'asc' ? 'desc' : 'asc',
                    })
                }
            />
        </section>

        {/* Games grid */}
        {games.current ? (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {games.current.map(game => <GameCard
                    key={game.id}
                    game={game}
                    creator={client.users.get(game.creatorId)}
                />)}

                {/* Load more */}
                {games.current.hasMore && <Button
                    className="col-span-full"
                    onClick={loadMoreGames}
                >
                    {isLoadingMore ? 'Loading...' : 'Load more'}
                </Button>}
            </section>
        ) : (
            <Loading.Circle className="mt-[100px]" />
        )}
    </div>;
}

export namespace GameBrowser {
    export interface Props {
        manager: GameManager;
        enablePathQuery?: boolean;
    }

    export function parseOptions(...allOptions: FetchGamesOptions[]) {
        const options = Object.assign({}, ...allOptions);

        for (const [key, value] of Object.entries(options)) {
            if (!value || ['limit', 'skip'].includes(key))
                Reflect.deleteProperty(options, key);
            else if (['ids', 'modes', 'categories'].includes(key))
                Reflect.set(options, key, [value].flat().join(','));
        }

        return options as Record<string, string | number>;
    }
}
