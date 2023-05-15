import { faCloudMoon } from '@fortawesome/free-solid-svg-icons/faCloudMoon';
import { faCloudSun } from '@fortawesome/free-solid-svg-icons/faCloudSun';
import { faGamepad } from '@fortawesome/free-solid-svg-icons/faGamepad';
import { faPenFancy } from '@fortawesome/free-solid-svg-icons/faPenFancy';
import { faUserAlt } from '@fortawesome/free-solid-svg-icons/faUserAlt';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Container } from './Container';
import { Button } from './Input/Button';
import { Loading } from './Loading';
import { useClient } from '#/hooks/useClient';

export function Header() {
    const client = useClient();

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const { theme, setTheme } = useTheme();
    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    return <Container
        parentType="header"
        parentClassName="fixed left-0 right-0 z-[2] shadow-xl bg-qwaroo-500 dark:bg-neutral-800"
    >
        <nav className="flex flex-col md:flex-row text-white">
            <Button
                className="mx-auto md:mx-0 !bg-transparent"
                linkProps={{ href: '/' }}
            >
                <h1 className="text-3xl font-bold">QWAROO</h1>
            </Button>

            <div className="flex flex-wrap mx-auto md:mr-0">
                <Button
                    className="!bg-transparent"
                    iconProp={faGamepad}
                    linkProps={{ href: '/games' }}
                >
                    Games
                </Button>

                <Button
                    className="!bg-transparent"
                    iconProp={faPenFancy}
                    linkProps={{ href: '/games/create' }}
                >
                    Create
                </Button>

                {mounted ? (
                    client.id ? (
                        <Button
                            className="!bg-transparent"
                            iconProp={faUserAlt}
                            linkProps={{ href: '/profile' }}
                        >
                            Profile
                        </Button>
                    ) : (
                        <Button
                            className="!bg-transparent"
                            iconProp={faUserAlt}
                            linkProps={{ href: '/login' }}
                        >
                            Login
                        </Button>
                    )
                ) : (
                    <Loading.Circle className="m-auto [&>*]:!w-6 [&>*]:!h-6" />
                )}

                {mounted ? (
                    <Button
                        className="!bg-transparent"
                        iconProp={theme === 'light' ? faCloudMoon : faCloudSun}
                        ariaLabel="Toggle theme"
                        onClick={() => toggleTheme()}
                    />
                ) : (
                    <Loading.Circle className="m-auto [&>*]:!w-6 [&>*]:!h-6" />
                )}
            </div>
        </nav>
    </Container>;
}
