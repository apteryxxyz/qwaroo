import { WebRoutes } from '@qwaroo/types';
import Link from 'next/link';
import { Container } from './Container';

export function Footer() {
    return <Container
        parentType="footer"
        childClassName="flex flex-row gap-3 p-2 justify-center text-xs text-black dark:text-white"
    >
        <Link href={WebRoutes.contactUs()} className="hover:opacity-70">
            Contact Us
        </Link>
        <Link href={WebRoutes.privacyPolicy()} className="hover:opacity-70">
            Privacy Policy
        </Link>
        <Link href={WebRoutes.termsOfUse()} className="hover:opacity-70">
            Terms of Use
        </Link>
    </Container>;
}
