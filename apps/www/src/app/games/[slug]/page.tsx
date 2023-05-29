import { RatingBar } from './Rating';
import { getGame } from './actions';
import { GameCard } from '@/components/GameCard';
import { Alert } from '@/ui/Alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/Avatar';
import { Badge } from '@/ui/Badge';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';

export default async function Slug({ params: { slug } }: { params: { slug: string } }) {
    const { game, recommended } = (await getGame({ slug, recommended: true })) ?? {};

    // TODO: Improve the not found handling
    if (!game) return <Alert variant="destructive">Game not found</Alert>;

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
                        {game.categories.map(category => <Badge key={category}>{category}</Badge>)}
                        <Badge>{game.totalPlays} Plays</Badge>
                    </div>

                    <p>{game.longDescription}</p>
                </Card.Content>

                <Card.Footer className="space-x-2">
                    <Button>Play</Button>

                    <RatingBar />
                </Card.Footer>
            </Card>

            <section className="col-span-1">
                <h2 className="text-lg font-bold leading-none tracking-tight pb-6">
                    You Might Like
                </h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1">
                    {recommended!.map(game => <GameCard key={game.id} {...game} />)}
                </div>
            </section>
        </div>
    </>;
}
