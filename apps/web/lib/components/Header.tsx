import { faCloudMoon } from '@fortawesome/free-solid-svg-icons/faCloudMoon';
import { faCloudSun } from '@fortawesome/free-solid-svg-icons/faCloudSun';
import { faGamepad } from '@fortawesome/free-solid-svg-icons/faGamepad';
// import { faPenFancy } from '@fortawesome/free-solid-svg-icons/faPenFancy';
import { faUserAlt } from '@fortawesome/free-solid-svg-icons/faUserAlt';
import { useTheme } from 'next-themes';
import { Container } from './Container';
import { Button } from './Input/Button';

export function Header() {
    const { theme, setTheme } = useTheme();
    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    return <Container
        parentType="header"
        parentClassName="fixed left-0 right-0 z-[1030] shadow-xl bg-qwaroo-500 dark:bg-neutral-800"
    >
        <nav className="flex flex-col md:flex-row text-white">
            <Button
                className="mx-auto md:mx-0 !bg-transparent
                    hover:text-qwaroo-100 dark:hover:text-neutral-200"
                linkProps={{ href: '/' }}
            >
                <h1 className="text-3xl font-bold">QWAROO</h1>
            </Button>

            <div className="flex flex-wrap mx-auto md:mr-0">
                <Button
                    className="!bg-transparent hover:text-qwaroo-100 dark:hover:text-neutral-200"
                    iconProp={faGamepad}
                    linkProps={{ href: '/games' }}
                >
                    Games
                </Button>

                <Button
                    className="!bg-transparent hover:text-qwaroo-100 dark:hover:text-neutral-200"
                    iconProp={faUserAlt}
                    linkProps={{ href: '/profile' }}
                >
                    Profile
                </Button>

                {/* <Button
                    className="!bg-transparent hover:text-qwaroo-100 dark:hover:text-neutral-200"
                    iconProp={faPenFancy}
                    linkProps={{ href: '/games/create' }}
                >
                    Create
                </Button> */}

                <Button
                    className="!bg-transparent hover:text-qwaroo-100 dark:hover:text-neutral-200"
                    iconProp={
                        (theme ?? 'light') === 'light'
                            ? faCloudMoon
                            : faCloudSun
                    }
                    ariaLabel="Toggle theme"
                    onClick={() => toggleTheme()}
                />
            </div>
        </nav>
    </Container>;
}
