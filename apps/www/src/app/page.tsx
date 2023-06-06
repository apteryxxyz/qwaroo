import Image from 'next/image';
import Link from 'next/link';
import Balancer from 'react-wrap-balancer';
import { Button } from '@/components/Button';
import { tw } from '@/utilities/styling';

export const metadata = {
    title: 'Qwaroo',
    description:
        'Higher or Lower on a whole new level, play one of the many games we have to offer, or create your own and share it with your friends!',
};

export default async function Page() {
    return <section className="min-h-[75dvh] grid lg:grid-cols-2">
        <div className="col-span-1 flex flex-col gap-2 justify-center">
            <h1 className="text-primary text-7xl font-bold">Qwaroo</h1>
            <p className="text-lg">
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

            <div className="space-y-2 sm:space-y-0 sm:space-x-2">
                <Link href="/games" className="block sm:inline">
                    <Button>Browse games</Button>
                </Link>
                <Link href="/" className="block sm:inline">
                    <Button>Play on Discord</Button>
                </Link>
                {/* <Link href="/" className="block sm:inline">
                    <Button variant="outline">Donate</Button>
                </Link> */}
            </div>
        </div>

        <div className="col-span-1 pt-10 lg:pt-0 flex flex-col items-center justify-center">
            <div className="relative p-6">
                <Image
                    className={tw(
                        'absolute shadow-md rounded-md w-36 md:w-52 -rotate-6 top-0 left-0 z-30'
                    )}
                    src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
                    width={500}
                    height={500}
                    alt="image"
                />

                <Image
                    className="relative shadow-md rounded-md"
                    src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
                    width={500}
                    height={500}
                    alt="image"
                />

                <Image
                    className={tw(
                        'absolute shadow-md rounded-md w-36 md:w-48 rotate-6 bottom-0 right-0 z-30'
                    )}
                    src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
                    width={500}
                    height={500}
                    alt="image"
                />
            </div>
        </div>
    </section>;
}
