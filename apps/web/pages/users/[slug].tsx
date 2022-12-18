import { Display } from '#/components/Display';

export default () => {
    return <Display
        title="User profiles aren't ready."
        description="User profiles aren't ready yet, however your game statistics are being tracked and will appear here when ready. Check back soon!"
        showGoHome
        showSocials
    />;
};
