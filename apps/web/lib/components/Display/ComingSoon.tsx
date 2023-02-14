import { Display } from './Display';

export function ComingSoon() {
    return <Display
        header="Coming Soon"
        title="This feature is still in development."
        description="We're working hard to bring this feature to you as soon as possible, feel free to join the Discord server for updates."
        showSocials
    />;
}
