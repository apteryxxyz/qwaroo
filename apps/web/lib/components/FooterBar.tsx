import { PlainButton } from './Input/PlainButton';

export function FooterBar() {
    return <footer id="footer-bar" className="z-10 bg-transparent">
        <div className="max-w-8xl w-full flex flex-row mx-auto text-sm items-center justify-center">
            <PlainButton
                className="hover:opacity-80"
                linkProps={{ href: '/policies/privacy' }}
            >
                Privacy Policy
            </PlainButton>

            <PlainButton
                className="hover:opacity-80"
                linkProps={{ href: '/policies/terms' }}
            >
                Terms of Use
            </PlainButton>
        </div>
    </footer>;
}
