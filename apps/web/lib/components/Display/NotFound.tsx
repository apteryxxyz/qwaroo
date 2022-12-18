import { Display } from './Display';

export function NotFound() {
    return <Display
        header="Not Found"
        title="This resource doesn't exist."
        description="We couldn't find the page you were looking for.
            You may have clicked on a bad link or entered an invalid URL."
        showGoHome
        showGoBack
        showSocials
    />;
}
