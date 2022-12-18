import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faShareNodes } from '@fortawesome/free-solid-svg-icons/faShareNodes';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons/faTrashCan';
import type { Game } from '@owenii/client';
import type { FetchGamesOptions } from '@owenii/types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GameCard } from '#/components/Cards/Game';
import { Display } from '#/components/Display';
import { Button } from '#/components/Input/Button';
import { Textbox } from '#/components/Input/Textbox';
import { useClient } from '#/contexts/ClientContext';
import { useWebUrl } from '#/hooks/useEnv';

export default () => {
    const router = useRouter();
    const client = useClient();

    const [games, setGames] = useState<Game[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [query, setQuery] = useState<FetchGamesOptions>({
        limit: 10,
        skip: 0,
    });
    const [shareUrl, setShareUrl] = useState<string>(router.asPath);

    useEffect(() => {
        (async () => {
            const cats = await client.games.fetchCategories();
            setCategories(cats);
            const search = new URLSearchParams(router.asPath.split('?')[1]);
            setQuery(Object.fromEntries(search.entries()));
        })();
    }, [router.isReady]);

    useEffect(() => {
        (async () => {
            const url = new URL(router.asPath, 'http://localhost');
            const search = new URLSearchParams(Object.entries(query));
            const path = url.pathname.split('?')[0] + '?' + search.toString();
            setShareUrl(path);

            const games = await client.games.fetchMany(query);
            await Promise.all(games.map(g => g.fetchCreator(false)));
            setGames(games);
        })();
    }, [query]);

    return <>
        <h1 className="font-bold text-3xl">Games</h1>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-1 my-3">
            {(categories ?? []).map(category => <Button
                whileActive="bg-sky-400 dark:bg-sky-400
                    text-white hover:brightness-125 hover:bg-sky-400"
                isActive={query.categories?.includes(category)}
                key={category}
                onClick={() => {
                    if (query.categories?.includes(category))
                        setQuery(q => ({
                            ...q,
                            categories: q.categories?.filter(
                                c => c !== category
                            ),
                        }));
                    else
                        setQuery(q => ({
                            ...q,
                            categories: [...(q.categories ?? []), category],
                        }));
                }}
            >
                {category}
            </Button>)}

            <div className="flex flex-row gap-1 [&>*]:shadow-lg">
                <Textbox
                    placeHolder="Search"
                    iconProp={faSearch}
                    onValue={value => setQuery(q => ({ ...q, term: value }))}
                    defaultValue={query.term}
                    enableEnterKey
                    enableIconClick
                    enableInputChange
                />

                <Button
                    iconProp={faTrashCan}
                    onClick={() => {
                        setQuery(() => ({ limit: 10, skip: query.skip }));
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
                        if (navigator.clipboard)
                            void navigator.clipboard.writeText(url.toString());
                    }}
                    ariaLabel="Share search"
                />
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {games.map(game => <GameCard
                key={game.slug}
                game={game}
                creator={client.users.get(game.creatorId)!}
            />)}
        </div>

        {games.length === 0 && <Display
            title="No games found."
            description="Try searching for something else."
        />}
    </>;
};
