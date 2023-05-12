import { faCloudMoon } from '@fortawesome/free-solid-svg-icons/faCloudMoon';
import { faCloudSun } from '@fortawesome/free-solid-svg-icons/faCloudSun';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from './Button';

export function ThemeSwitch() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => setMounted(true), []);

    // Div with a width to prevent the button from jumping around
    if (!mounted) return <div className="w-9" />;

    return <Button
        className="!bg-transparent"
        iconProp={theme === 'light' ? faCloudMoon : faCloudSun}
        ariaLabel="Toggle theme"
        onClick={() => toggleTheme()}
    />;
}
