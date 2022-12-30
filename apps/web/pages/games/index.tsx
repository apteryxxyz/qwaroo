import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faShareNodes } from '@fortawesome/free-solid-svg-icons/faShareNodes';
import { faSortAmountAsc } from '@fortawesome/free-solid-svg-icons/faSortAmountAsc';
import { faSortAmountDesc } from '@fortawesome/free-solid-svg-icons/faSortAmountDesc';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons/faTrashCan';
import type { Game } from '@qwaroo/client';
import type { FetchGamesOptions } from '@qwaroo/types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { GameCard } from '#/components/Cards/Game';
import { Loading } from '#/components/Display/Loading';
import { Button } from '#/components/Input/Button';
import { Dropdown } from '#/components/Input/Dropdown';
import { Textbox } from '#/components/Input/Textbox';
import { PageSeo } from '#/components/Seo/Page';
import { useClient } from '#/contexts/ClientContext';
import { useWebUrl } from '#/hooks/useEnv';

export default () => {
    const router = useRouter();
    const client = useClient();

    const [games, setGames] = useState<Game[]>([]);
    const hasItems = useRef<Record<string, [number, boolean]>>({});

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [categories, setCategories] = useState<string[]>([]);
    const [query, setQuery] = useState<FetchGamesOptions | null>(null);
    const [shareUrl, setShareUrl] = useState<string>(router.asPath);

    useEffect(() => {
        void client.games.fetchCategories().then(c => setCategories(c));
    }, []);

    useEffect(() => {
        const search = new URLSearchParams(router.asPath.split('?')[1]);
        const config = Object.fromEntries(
            search.entries()
        ) as FetchGamesOptions;

        config['limit'] = Number(config['limit'] ?? 10);
        config['skip'] = Number(config['skip'] ?? 0);

        setQuery(Object.fromEntries(search.entries()));
    }, [router.isReady]);

    useEffect(() => {
        if (!query) return;

        const url = new URL(router.asPath, 'http://localhost');
        const search = new URLSearchParams(Object.entries(query));
        const path = url.pathname.split('?')[0] + '?' + search.toString();
        setShareUrl(path);

        const itemsCache = localStorage.getItem('qwaroo.has_items_cache');
        if (itemsCache) hasItems.current = JSON.parse(itemsCache) ?? {};

        (async () => {
            const games = await client.games.fetchMany(query);

            // Preload the creators
            const creatorIds = Array.from(new Set(games.map(g => g.creatorId)));
            await client.users.fetchMany({ ids: creatorIds });

            // Preload whether the games have items
            for (const game of games) {
                const current = hasItems.current[game.id];
                if (current && current[0] === game.updatedTimestamp) continue;

                const items = await game.fetchItems().catch(() => null);
                hasItems.current = Object.assign(hasItems.current, {
                    [game.id]: [game.updatedTimestamp, (items?.total ?? 0) > 0],
                });

                localStorage.setItem(
                    'qwaroo.has_items_cache',
                    JSON.stringify(hasItems.current)
                );
            }

            setGames(games);
            setIsLoading(false);
        })();
    }, [query]);

    return <section>
        <PageSeo
            title="Games"
            description="A collection of fun guessing and statistics based browser games.
            Can you guess which country has a higher population, or which movie has a better rating on IMDb?
            Find out today!"
            url="/games"
        />

        <h2 className="font-bold text-3xl">Game Modes</h2>

        {/* Filter bar */}
        <section className="flex flex-wrap gap-1 my-3 items-center">
            <div className="flex flex-wrap gap-1 [&>*]:shadow-lg [&>*]:flex-grow">
                {(categories ?? []).map(category => <Button
                    whileActive="bg-qwaroo-400 dark:bg-qwaroo-400
                    text-white hover:brightness-125 hover:bg-qwaroo-400"
                    isActive={query?.categories?.includes(category)}
                    key={category}
                    onClick={() => {
                        if (query?.categories?.includes(category))
                            setQuery((q = {}) => ({
                                ...q,
                                categories: q!.categories?.filter(
                                    c => c !== category
                                ),
                            }));
                        else
                            setQuery((q = {}) => ({
                                ...q,
                                categories: [
                                    ...(q!.categories ?? []),
                                    category,
                                ],
                            }));
                    }}
                >
                    {category}
                </Button>)}

                <div className="flex flex-row gap-1 [&>*:first-child]:w-full !shadow-none [&>*]:shadow-lg">
                    <Dropdown
                        className="!w-full"
                        options={[
                            { label: 'Most Played', value: 'totalPlays' },
                            {
                                label: 'Recently Updated',
                                value: 'updatedTimestamp',
                            },
                        ]}
                        currentValue={query?.sort ?? 'totalPlays'}
                        onChange={(value: 'totalPlays') =>
                            setQuery(q => ({ ...q, sort: value }))
                        }
                    />

                    <Button
                        iconProp={
                            query?.order === 'asc'
                                ? faSortAmountAsc
                                : faSortAmountDesc
                        }
                        onClick={() =>
                            setQuery((q = {}) => ({
                                ...q,
                                order: q!.order === 'asc' ? 'desc' : 'asc',
                            }))
                        }
                        ariaLabel="Change sort order"
                    />
                </div>
            </div>

            <div className="flex gap-1 w-full [&>*]:shadow-lg [&>*:first-child]:w-full">
                <Textbox
                    placeHolder="Search"
                    iconProp={faSearch}
                    onValue={value =>
                        setQuery((q = {}) => ({ ...q, term: value }))
                    }
                    defaultValue={query?.term ?? ''}
                    enableEnterKey
                    enableIconClick
                    enableInputChange
                />

                <Button
                    iconProp={faTrashCan}
                    onClick={() => {
                        setQuery(() => ({ limit: 10, skip: query?.skip }));
                        void router.replace('/games', undefined, {
                            shallow: true,
                        });
                    }}
                    ariaLabel="Clear search"
                />

                <Button
                    iconProp={faShareNodes}
                    onClick={() => {
                        const url = new URL(shareUrl, useWebUrl());
                        url.searchParams.delete('limit');
                        url.searchParams.delete('skip');

                        if (navigator.clipboard)
                            void navigator.clipboard.writeText(url.toString());
                        else console.info(url.toString());
                    }}
                    ariaLabel="Share search"
                />
            </div>
        </section>

        {isLoading && <Loading />}

        {!isLoading && <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {games.map(
                game =>
                    // If a game doesnt have items, exclude it from results
                    hasItems.current[game.id]?.[1] && <GameCard
                        key={game.slug}
                        game={game}
                        creator={client.users.get(game.creatorId)!}
                    />
            )}
            <Link
                href="/discord"
                target="_blank"
                className="flex flex-col w-auto h-auto aspect-square rounded-xl
                    transition-all duration-300 ease-in-out text-white
                    hover:shadow-lg hover:scale-105 hover:brightness-125"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.3),
                rgba(0,0,0,0.3)),url(https://assets-global.website-files.com/5f9072399b2640f14d6a2bf4/6348685d7c7b4e693020de8c_macro%20hero-blog%20header%402x-p-800.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
                onMouseEnter={event => {
                    const element = event.currentTarget;
                    element.style.rotate = `${
                        Math.round(Math.random()) === 0 ? -1 : 1
                    }deg`;
                }}
                onMouseLeave={event => {
                    const element = event.currentTarget;
                    element.style.rotate = '0deg';
                }}
            >
                <div
                    className="flex flex-col justify-end w-full min-h-[30%] mt-auto p-3
                        bg-qwaroo-gradient-to-t from-black to-transparent rounded-b-xl"
                >
                    <h3 className="text-1.5xl font-semibold">Suggest A Game</h3>

                    <p className="overflow-hidden">
                        Have an idea for a game? Click here to join the Discord
                        server and suggest it!
                    </p>
                </div>
            </Link>
        </section>}
    </section>;
};
