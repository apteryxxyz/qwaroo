import Link from 'next/link';
import Balancer from 'react-wrap-balancer';
import { Showcase } from '@/components/game/Showcase';
import { Button } from '@/components/ui/Button';

export default async function Home() {
    return <section className="min-h-[75dvh] grid lg:grid-cols-2">
        <div className="col-span-1 flex flex-col gap-2 justify-center">
            <h1 className="text-primary text-8xl font-bold">Qwaroo</h1>
            <p className="text-xl">
                <Balancer>
                    Higher or Lower on a whole new level, play one of the many games we have to
                    offer, or create your own and share it with your friends!
                </Balancer>
            </p>
            <p className="text-foreground/60">
                <Balancer>
                    1799 games played, 8312 points scored, more than 1d 2h 1m 24s spent playing
                </Balancer>
            </p>

            <div className="space-x-2 mt-2">
                <Link href="/games">
                    <Button>Browse games</Button>
                </Link>
                <Link href="/">
                    <Button>Play on Discord</Button>
                </Link>
                <Link href="/">
                    <Button variant="outline">Donate</Button>
                </Link>
            </div>
        </div>

        <div className="col-span-1 pt-10 lg:pt-0 flex flex-col items-center justify-center">
            <Showcase />
        </div>
    </section>;
}
