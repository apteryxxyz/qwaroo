import { SkeletonGameCard } from '@/components/game-card';
import { SkeletonGameScoreCard } from '@/components/game-score-card';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <>
      <Skeleton className="mb-6 h-8 w-56" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-1 h-fit space-y-6 lg:col-span-2">
          <Card>
            <Card.Header className="flex-row items-center gap-2">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-24" />
              </div>
            </Card.Header>

            <Card.Content className="space-y-2">
              <Skeleton className="h-4" />
              <Skeleton className="h-4 w-[70%]" />
            </Card.Content>
          </Card>

          <section className="space-y-6">
            <Skeleton className="mb-6 h-6 w-32" />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <SkeletonGameScoreCard />
              <SkeletonGameScoreCard />
              <SkeletonGameScoreCard />
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <SkeletonGameScoreCard />
              <SkeletonGameScoreCard />
              <SkeletonGameScoreCard />
              <SkeletonGameScoreCard />
              <SkeletonGameScoreCard />
              <SkeletonGameScoreCard />
              <SkeletonGameScoreCard />
              <SkeletonGameScoreCard />
            </div>
          </section>
        </div>

        <section className="col-span-1">
          <Skeleton className="mb-6 h-6 w-32" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonGameCard key={i} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
