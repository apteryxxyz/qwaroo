import type { Game, User } from '@qwaroo/database';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface GameCardProps {
    game: Game.Document;
    creator?: User.Document;
}

export function GameCard({ game, creator }: GameCardProps) {
    return <Link href="/" className="h-full">
        <Card className="grid grid-cols-4 h-full">
            <Image
                src={game.thumbnailUrl}
                className="aspect-square object-cover h-full rounded-l-md border-r-2"
                width={1_000}
                height={1_000}
                alt="image"
            />

            <div className="col-span-3 flex flex-col gap-2 justify-center">
                <Card.Header>
                    <Card.Title>{game.title}</Card.Title>
                    {creator && <Card.Description>
                        Created by <span className="underline">{creator.displayName}</span>
                    </Card.Description>}
                    <div className="space-x-2">
                        <Badge>{game.categories[0]}</Badge>
                        <Badge>{game.totalPlays} Plays</Badge>
                    </div>
                    <Card.Description>{game.shortDescription}</Card.Description>
                </Card.Header>

                {/* <Card.Content>
                    
                </Card.Content> */}
            </div>

            {/* <div className="col-span-3 flex flex-col gap-2 justify-center p-3">
                <Card.Title>{game.title}</Card.Title>
                <span>Created by {game.creator.displayName}</span>
                <div className="space-x-2">
                    <Badge>{game.categories[0]}</Badge>
                    <Badge>{game.totalPlays} Plays</Badge>
                </div>
                <Card.Description>{game.shortDescription}</Card.Description>
            </div> */}
        </Card>
    </Link>;
}
