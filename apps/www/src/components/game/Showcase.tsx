import Image from 'next/image';
import { tw } from '@/utilities/styling';

export function Showcase() {
    return <div className="relative flex h-[400px] w-96 items-center justify-center">
        <Image
            className={tw('rounded-xl shadow-md z-10')}
            src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
            width={700}
            height={700}
            alt="image"
        />

        <Image
            className={tw('rounded-xl shadow-md absolute -top-0 -left-20 -rotate-6 z-0')}
            src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
            width={250}
            height={250}
            alt="image"
        />

        <Image
            className={tw('rounded-xl shadow-md absolute -bottom-0 -right-20 rotate-6 z-20')}
            src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
            width={250}
            height={250}
            alt="image"
        />
    </div>;
}
