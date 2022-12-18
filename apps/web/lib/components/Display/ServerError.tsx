import { Display } from './Display';

export function ServerError() {
    return <Display
        header="Server Error"
        title="Something went wrong."
        description="You found an extremely rare bug! Try refreshing this page,
            if that doesn't help, please report this to the developers."
        showGoHome
        showRefresh
        showGoBack
        showSocials
    />;
}
