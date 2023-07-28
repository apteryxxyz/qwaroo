import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Balancer from 'react-wrap-balancer';
import { Button } from '@/components/ui/button';

export const metadata = {
  description:
    'Higher or Lower on a whole new level, play one of the many games we have to offer, or create your own and share it with your friends!',
} satisfies Metadata;

export default function Page() {
  return (
    <section className="grid min-h-[75dvh] lg:grid-cols-2">
      <div className="col-span-1 flex flex-col justify-center gap-2">
        <h1 className="text-7xl font-bold text-primary">Qwaroo</h1>
        <p className="text-lg">
          <Balancer>
            Higher or Lower on a whole new level, play one of the many games we
            have to offer, or create your own and share it with your friends!
          </Balancer>
        </p>

        <div className="space-y-2 sm:space-x-2 sm:space-y-0">
          <Link href="/games" className="block sm:inline">
            <Button>Browse games</Button>
          </Link>
          <Link href="/" className="block sm:inline">
            <Button variant="outline">Donate</Button>
          </Link>
        </div>
      </div>

      <div className="col-span-1 flex flex-col items-center justify-center pt-10 lg:pt-0">
        <div className="relative p-6">
          <Image
            className="absolute left-0 top-0 z-30 w-36 -rotate-6 rounded-md shadow-md md:w-52"
            src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
            width={500}
            height={500}
            alt="image"
          />

          <Image
            className="relative rounded-md shadow-md"
            src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
            width={500}
            height={500}
            alt="image"
          />

          <Image
            className="absolute bottom-0 right-0 z-30 w-36 rotate-6 rounded-md shadow-md md:w-48"
            src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
            width={500}
            height={500}
            alt="image"
          />
        </div>
      </div>
    </section>
  );
}
