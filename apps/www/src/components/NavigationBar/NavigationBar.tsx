import { DesktopNavigationBar } from './DesktopNavigationBar';
import { MobileNavigationBar } from './MobileNavigationBar';

export function NavigationBar() {
    return <header className="sticky top-0 z-40 w-full border-b supports-backdrop-blur:bg-background/60 bg-background/95 backdrop-blur">
        <MobileNavigationBar />
        <DesktopNavigationBar />
    </header>;
}
