'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Game } from '@qwaroo/database';
import { FileQuestionIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getGames } from './actions';
import { GameCard, SkeletonGameCard } from '@/components/GameCard';
import { Alert } from '@/ui/Alert';
import { Button } from '@/ui/Button';
import { Form } from '@/ui/Form';
import { Input } from '@/ui/Input';
import { Page } from '@/ui/Page';

const searchSchema = z.object({
    query: z.string().optional(),
});

export default function Games() {
    const searchForm = useForm<z.infer<typeof searchSchema>>({
        resolver: zodResolver(searchSchema),
        defaultValues: { query: '' },
    });

    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(-1);
    const [loaded, setLoaded] = useState<Game.Entity[]>([]);
    const [lastLength, setLastLength] = useState(6);

    async function fetchMore(isInitial = false) {
        // Reset loaded games if this is the initial load
        if (isInitial && loaded.length > 0) setLoaded([]);

        // Only fetch more if we have less than the total amount of games
        if (!isInitial && total !== -1 && loaded.length >= total) return;

        if (!isLoading) setIsLoading(true);
        const [data, games] = await getGames({
            ...searchForm.getValues(),
            limit: 12,
            skip: isInitial ? 0 : loaded.length,
        });

        if (data.total !== total) setTotal(data.total);
        setLoaded(prev => {
            setLastLength(games.length);
            if (isInitial) return games;
            else return [...prev, ...games];
        });
        setIsLoading(false);
    }

    useEffect(() => void fetchMore(true), []);

    return <>
        <Page.Title>Games</Page.Title>

        {/* TODO: Filtering will come later, less important right now */}

        <Form {...searchForm}>
            <form
                onSubmit={searchForm.handleSubmit(() => fetchMore(true))}
                className="flex pb-6 space-x-6"
            >
                <Form.Field
                    control={searchForm.control}
                    name="query"
                    render={({ field }) => <Form.Item>
                        <div className="inline-flex space-x-6">
                            <Form.Control>
                                <Input placeholder="Search games..." {...field} />
                            </Form.Control>
                            <Button type="submit">Search</Button>
                        </div>
                        <Form.Message />
                    </Form.Item>}
                />
            </form>
        </Form>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {loaded.map(game => <GameCard key={game.id} game={game} creator={game.creator} />)}

            {isLoading &&
                Array.from({ length: lastLength || 6 }).map((_, i) => <SkeletonGameCard key={i} />)}

            {!isLoading && loaded.length === 0 && <Alert>
                <FileQuestionIcon className="w-5 h-5 mr-2" />

                <Alert.Title>Hmm, no games were found</Alert.Title>
                <Alert.Description>
                    Check back later, or try a different search query.
                </Alert.Description>
            </Alert>}
        </div>
    </>;
}
