import Image from 'next/image';
import Link from 'next/link';
import Balancer from 'react-wrap-balancer';
import { Button } from '@/components/ui/button';

export default function Page() {
  return (
    <section className="grid min-h-[75dvh] lg:grid-cols-2">
      <div className="col-span-1 flex flex-col justify-center gap-2 [&>*]:w-fit">
        <h1 className="relative text-7xl font-bold text-primary">
          Qwaroo
          <span className="absolute -top-1 right-1 text-lg uppercase">
            Beta
          </span>
        </h1>
        <p className="text-lg">
          <Balancer>
            Higher or Lower on a whole new level, play one of the many games we
            have to offer, or create your own and share it with your friends!
          </Balancer>
        </p>

        <div className="flex flex-wrap gap-2">
          <Link href="/games">
            <Button>Browse games</Button>
          </Link>

          <Link href="/blog">
            <Button variant="outline">Blog posts</Button>
          </Link>
        </div>
      </div>

      <div className="col-span-1 flex flex-col items-center justify-center pt-10 lg:pt-0">
        <div className="relative p-6">
          <Image
            className="absolute -top-10 left-0 z-30 w-36 -rotate-6 rounded-md shadow-md md:w-52"
            src="/images/promo-beast.png"
            width={500}
            height={500}
            alt="image"
          />

          <Image
            className="relative rounded-md shadow-md"
            src="/images/promo-beast.png"
            width={500}
            height={500}
            alt="image"
          />

          <Image
            className="absolute -bottom-10 right-0 z-30 w-36 rotate-6 rounded-md shadow-md md:w-48"
            src="/images/promo-beast.png"
            width={500}
            height={500}
            alt="image"
          />
        </div>
      </div>
    </section>
  );
}
