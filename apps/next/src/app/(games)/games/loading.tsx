import { SkeletonGameCard } from '@/components/game-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <>
      <h1 className="pb-6 text-2xl font-bold leading-none tracking-tight">
        Games
      </h1>

      <div className="flex space-x-6 pb-6">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-10 w-20" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonGameCard key={i} />
        ))}
      </div>
    </>
  );
}
