import { WebRoutes } from '@qwaroo/types';
import Link from 'next/link';
import { Container } from './Container';

// export function Footer() {
//     return <Container
//         parentType="footer"
//         parentClassName="z-[1]"
//         childClassName="flex flex-row gap-3 p-2 justify-center text-[10px] text-black dark:text-white [&>*]:!opacity-50"
//     >

//     </Container>;
// }

export function Footer() {
    return <Container
        parentType="footer"
        parentClassName="z-[1]"
        childClassName="flex flex-row gap-3 p-2 justify-center
            text-[10px] text-black dark:text-white [&>*]:opacity-50"
    >
        <Link href={WebRoutes.contactUs()} className="hover:opacity-80">
            Contact Us
        </Link>

        <Link href={WebRoutes.privacyPolicy()} className="hover:opacity-80">
            Privacy Policy
        </Link>

        <Link href={WebRoutes.termsOfUse()} className="hover:opacity-80">
            Terms of Use
        </Link>
    </Container>;
}
