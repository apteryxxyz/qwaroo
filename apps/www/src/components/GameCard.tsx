import type { Game, User } from '@qwaroo/database';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/ui/Badge';
import { Card } from '@/ui/Card';
import { Skeleton } from '@/ui/Skeleton';

interface GameCardProps {
    game: Game.Entity;
    creator?: User.Entity;
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
                <Card.Header className="text-sm">
                    <Card.Title>{game.title}</Card.Title>
                    {creator && <p>
                        Created by <span className="underline">{creator.displayName}</span>
                    </p>}
                    <div className="space-x-2">
                        <Badge>{game.categories[0]}</Badge>
                        <Badge>{game.totalPlays} Plays</Badge>
                    </div>
                    <div>{game.shortDescription}</div>
                </Card.Header>
            </div>
        </Card>
    </Link>;
}

export function SkeletonGameCard() {
    return <Card className="grid grid-cols-4 h-full">
        <Skeleton className="object-cover h-full rounded-l-md border-r-2" />

        <div className="col-span-3 flex flex-col gap-2 justify-center">
            <Card.Header>
                <Skeleton className="h-5" />

                <Skeleton className="h-3 w-[70%]" />

                <div className="flex space-x-2">
                    <Skeleton className="h-4 w-[30%]" />
                    <Skeleton className="h-4 w-[30%]" />
                </div>

                <Skeleton className="h-3" />
                <Skeleton className="h-3 w-[70%]" />
            </Card.Header>
        </div>
    </Card>;
}
