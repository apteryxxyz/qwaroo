import { faGamepad } from '@fortawesome/free-solid-svg-icons/faGamepad';
import { faPenFancy } from '@fortawesome/free-solid-svg-icons/faPenFancy';
import { faUserAlt } from '@fortawesome/free-solid-svg-icons/faUserAlt';
import { Container } from './Container';
import { Button } from './Input/Button';
import { ThemeSwitch } from './Input/ThemeSwitch';

export function Header() {
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
                    iconProp={faUserAlt}
                    linkProps={{ href: '/profile' }}
                >
                    Profile
                </Button>

                <Button
                    className="!bg-transparent"
                    iconProp={faPenFancy}
                    linkProps={{ href: '/games/create' }}
                >
                    Create
                </Button>

                <ThemeSwitch />
            </div>
        </nav>
    </Container>;
}
