import Image from 'next/image';
import { tw } from '@/utilities/styling';

export function Showcase() {
    return <div className="relative p-6">
        {/* <Image
            className="absolute shadow-md top-0 left-0 z-10"
            src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
            width={500}
            height={500}
            alt="image"
        />

        <Image
            className="relative z-20 shadow-md"
            src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
            width={500}
            height={500}
            alt="image"
        />

        <Image
            className="absolute shadow-md bottom-0 right-0 z-30"
            src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
            width={500}
            height={500}
            alt="image"
        /> */}

        <Image
            className={tw('absolute shadow-md rounded-md w-36 md:w-48 -rotate-6 top-0 left-0 z-30')}
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
    </div>;
}
