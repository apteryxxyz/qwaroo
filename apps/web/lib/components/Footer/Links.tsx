import { WebRoutes } from '@qwaroo/types';
import Link from 'next/link';

export function Links() {
    return <span className="flex flex-row gap-3 justify-center text-sm">
        <Link href={WebRoutes.contactUs()} className="hover:opacity-80">
            Contact Us
        </Link>

        <Link href={WebRoutes.privacyPolicy()} className="hover:opacity-80">
            Privacy Policy
        </Link>

        <Link href={WebRoutes.termsOfUse()} className="hover:opacity-80">
            Terms of Use
        </Link>
    </span>;
}
