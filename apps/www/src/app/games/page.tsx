'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Game } from '@qwaroo/database';
import { FileQuestionIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getGames } from './actions';
import { GameCard, SkeletonGameCard } from '@/components/game/Card';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Form } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Page } from '@/components/ui/Page';

const searchSchema = z.object({
    query: z.string().optional(),
});

export default function Games() {
    const searchForm = useForm<z.infer<typeof searchSchema>>({
        resolver: zodResolver(searchSchema),
        defaultValues: { query: '' },
    });

    const [isLoading, setLoading] = useState(true);
    const [total, setTotal] = useState(-1);
    const [loaded, setLoaded] = useState<Game.Entity[]>([]);
    const [lastLength, setLastLength] = useState(6);

    const fetchMore = async (fromSubmit?: boolean) => {
        if (!fromSubmit && total !== -1 && loaded.length >= total) return;
        if (!isLoading) setLoading(true);

        const formOptions = searchForm.getValues();
        const options = { ...formOptions, limit: 12, skip: loaded.length };

        const [data, games] = await getGames(options);

        if (!total || data.total !== total) setTotal(data.total);
        setLoaded(prev => {
            setLastLength(games.length);
            if (fromSubmit) return games;
            else return [...prev, ...games];
        });
        setLoading(false);
    };

    useEffect(() => void fetchMore(), []);

    return <>
        <Page.Title>Games</Page.Title>

        {/* TODO: Filtering will come later, less important right now */}

        <Form {...searchForm}>
            <form
                onSubmit={searchForm.handleSubmit(() => {
                    setLoaded([]);
                    return fetchMore(true);
                })}
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