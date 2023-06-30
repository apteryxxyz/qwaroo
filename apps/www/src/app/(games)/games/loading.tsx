import { Skeleton } from '@/components/Skeleton';
import { GameCard } from '@/features/GameCard';

export default function Loading() {
    return <>
        <h1 className="text-2xl font-bold leading-none tracking-tight pb-6">Games</h1>

        <div className="flex pb-6 space-x-6">
            <Skeleton className="w-56 h-10" />
            <Skeleton className="w-20 h-10" />
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <GameCard key={i} isLoading />)}
        </div>
    </>;
}
