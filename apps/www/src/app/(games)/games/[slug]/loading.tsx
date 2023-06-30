import { Card } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';
import { GameCard } from '@/features/GameCard';

export default function Loading() {
    return <>
        <Skeleton className="h-8 w-56 mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1 lg:col-span-2 h-fit">
                <Card.Header className="flex-row gap-2 items-center">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-1">
                        <Skeleton className="h-5 w-36" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </Card.Header>

                <Card.Content className="space-y-2">
                    <div className="flex space-x-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                    </div>

                    <Skeleton className="h-4" />
                    <Skeleton className="h-4 w-[70%]" />
                </Card.Content>
            </Card>

            <section className="col-span-1">
                <Skeleton className="h-6 w-32 mb-6" />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1">
                    {Array.from({ length: 4 }).map((_, i) => <GameCard key={i} isLoading />)}
                </div>
            </section>
        </div>
    </>;
}
