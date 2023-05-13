import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faSortAmountDownAlt } from '@fortawesome/free-solid-svg-icons/faSortAmountDownAlt';
import { faSortAmountUpAlt } from '@fortawesome/free-solid-svg-icons/faSortAmountUpAlt';
import type { GameManager } from '@qwaroo/client';
import { GameListing } from '@qwaroo/client';
import type { FetchGamesOptions } from '@qwaroo/types';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../Input/Button';
import { Dropdown } from '../Input/Dropdown';
import { StringTextbox } from '../Input/Textbox/String';
import { Loading } from '../Loading';
import { GameCard } from './Card';
import { useClient } from '#/hooks/useClient';
import { useEventListener } from '#/hooks/useEventListener';
import { useIsFirstRender } from '#/hooks/useIsFirstRender';

export function GameBrowser(props: GameBrowser.Props) {
    // Variables

    const client = useClient();
    const router = useRouter();
    const browserRef = useRef<HTMLDivElement>(null);

    const games = useRef<GameListing | null>(null);
    const [options, setOptions] = useState<FetchGamesOptions>({});
    const [, setIsLoadingOptions] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Functions

    async function fetchAdditionalGames(listing: GameListing) {
        const newGames = await listing.fetchMore();

        const creatorIds = newGames
            .map(game => game.creatorId)
            .filter(
                (id, index, self) =>
                    !client.users.has(id) && self.indexOf(id) === index
            );
        console.log(creatorIds);
        return creatorIds.length > 0
            ? client.users.fetchMany({ ids: creatorIds })
            : undefined;
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
        return fetchAdditionalGames(listing).then(() => {
            games.current = listing;

            setIsLoadingOptions(false);
        });
    }

    async function changeOption(key: string, value: unknown) {
        const newOptions = { [key]: value };
        await loadNewOptions(newOptions);
    }

    function resizeGrid() {
        const browser = browserRef.current;
        if (!browser) return;

        const gridWidth = browser.clientWidth;
        const cardWidth = 300;
        const columns = Math.floor(gridWidth / cardWidth);

        browser.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    }

    // Hooks

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

    useEffect(resizeGrid, [games.current]);
    useEventListener('resize', resizeGrid);

    // Render

    return <div className="flex flex-col gap-3 w-full">
        {/* Filter bar */}
        <div className="flex flex-wrap gap-1">
            {/* Search box */}
            <StringTextbox
                ariaRole="searchbox"
                placeHolder="Search games..."
                iconProp={faSearch}
                value={options.term}
                onValue={value => changeOption('term', value)}
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
                onChange={v => changeOption('sort', v)}
            />

            {/* Sort direction */}
            <Button
                hoverText="Change sort order"
                ariaLabel="Change sort order"
                iconProp={
                    options.order === 'asc'
                        ? faSortAmountDownAlt
                        : faSortAmountUpAlt
                }
                onClick={() =>
                    changeOption(
                        'order',
                        options.order === 'asc' ? 'desc' : 'asc'
                    )
                }
            />
        </div>

        {/* Games grid */}
        {games.current ? (
            <section ref={browserRef} className="grid gap-3">
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

                {/* No games */}
                {games.current.size === 0 &&
                    !games.current.hasMore && <p className="col-span-full">
                        No games to show here, yet.
                    </p>}
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
        perPage?: number;
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
