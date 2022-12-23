import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faShareNodes } from '@fortawesome/free-solid-svg-icons/faShareNodes';
import { faSortAmountAsc } from '@fortawesome/free-solid-svg-icons/faSortAmountAsc';
import { faSortAmountDesc } from '@fortawesome/free-solid-svg-icons/faSortAmountDesc';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons/faTrashCan';
import type { Game } from '@owenii/client';
import type { FetchGamesOptions } from '@owenii/types';
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
    const hasItems = useRef(new Map<string, boolean>());

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

        (async () => {
            const url = new URL(router.asPath, 'http://localhost');
            const search = new URLSearchParams(Object.entries(query));
            const path = url.pathname.split('?')[0] + '?' + search.toString();
            setShareUrl(path);

            const games = await client.games.fetchMany(query);
            for (const game of games) {
                // Preload the creator
                await game.fetchCreator(false).catch(() => null);

                // TODO: Still need to find a better way to check if the game has items
                // This results in a lot of requests and requests the rate limit faster
                if (!hasItems.current.has(game.id)) {
                    // Get the item count to ensure the game has items
                    const items = await game.fetchItems().catch(() => null);
                    hasItems.current.set(game.id, (items?.total ?? 0) > 0);
                }
            }

            setGames(games);
            setIsLoading(false);
        })();
    }, [query]);

    return <>
        <PageSeo
            title="Games"
            description="A collection of fun guessing and statistics based browser games. Play games such as YouTuber Higher or Lower."
            url="/games"
        />

        <h1 className="font-bold text-3xl">Games</h1>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-1 my-3">
            <div className="flex flex-wrap gap-1 [&>*]:shadow-lg">
                {(categories ?? []).map(category => <Button
                    whileActive="bg-owenii-400 dark:bg-owenii-400
                    text-white hover:brightness-125 hover:bg-owenii-400"
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
            </div>

            <div className="flex flex-wrap gap-1 [&>*]:shadow-lg">
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

            <div className="flex flex-wrap gap-1 [&>*]:shadow-lg">
                <Dropdown
                    className="w-[200px]"
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

        {isLoading && <Loading />}

        {!isLoading && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {games.map(
                game =>
                    // If a game doesnt have items, exclude it from results
                    hasItems.current.get(game.id) && <GameCard
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
                        bg-owenii-gradient-to-t from-black to-transparent rounded-b-xl"
                >
                    <h2 className="text-1.5xl font-semibold">Suggest A Game</h2>

                    <p className="overflow-hidden">
                        Have an idea for a game? Click here to join the Discord
                        server and suggest it!
                    </p>
                </div>
            </Link>
        </div>}
    </>;
};
