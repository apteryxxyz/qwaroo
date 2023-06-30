import { AlertCircleIcon } from 'lucide-react';
import { notFound } from 'next/navigation';
import { executeServerAction } from 'next-sa/client';
import { GET_game } from './actions';
import { Alert } from '@/components/Alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { GameCard } from '@/features/GameCard';

interface PageProps {
    params: { slug: string };
}

export async function generateMetadata({ params: { slug } }: PageProps) {
    const { game } = (await executeServerAction(GET_game, { slug, recommended: false })) ?? {};

    if (!game)
        return {
            title: 'Game not found',
            description: 'Game not found',
        };

    return {
        title: game.title,
        description: game.longDescription,
    };
}

export default async function Page({ params: { slug } }: PageProps) {
    const { game, recommended } = (await executeServerAction(
        GET_game, //
        { slug, recommended: true }
    )) ?? { recommended: [] };

    if (!game) notFound();

    return <>
        <h1 className="text-2xl font-bold leading-none tracking-tight pb-6">{game.title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1 lg:col-span-2 h-fit">
                <Card.Header className="flex-row gap-2 items-center">
                    <Avatar>
                        <AvatarImage src={game.thumbnailUrl} />
                        <AvatarFallback>{game.title.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <Card.Title>{game.title}</Card.Title>
                        <Card.Description>
                            Created by <span className="underline">{game.creator.displayName}</span>
                        </Card.Description>
                    </div>
                </Card.Header>

                <Card.Content>
                    <div className="flex gap-2 flex-wrap">
                        <Badge>{game.category}</Badge>
                        <Badge>{game.totalPlays} Plays</Badge>
                    </div>

                    <p className="pt-2">{game.longDescription}</p>
                </Card.Content>
            </Card>

            <section className="col-span-1">
                <h2 className="text-lg font-bold leading-none tracking-tight pb-6">
                    You Might Like
                </h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1">
                    {recommended.map(game => <GameCard key={game.id} game={game} />)}
                </div>
            </section>
        </div>
    </>;
}
