import { Seo } from '../Seo';
import { Display } from './Display';

export function ServerError() {
    return <>
        <Seo title="Server Error" noIndex />
        <Display
            header="Server Error"
            title="Something went wrong."
            description="You found an extremely rare bug! Try refreshing this page,
            if that doesn't help, please report this to the developers."
            showSocials
        />
    </>;
}
