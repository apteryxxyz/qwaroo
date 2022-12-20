import { faCloudMoon } from '@fortawesome/free-solid-svg-icons/faCloudMoon';
import { faCloudSun } from '@fortawesome/free-solid-svg-icons/faCloudSun';
import { faGamepad } from '@fortawesome/free-solid-svg-icons/faGamepad';
// import { faMarker } from '@fortawesome/free-solid-svg-icons/faMarker';
import { faSignIn } from '@fortawesome/free-solid-svg-icons/faSignIn';
import { faSignOut } from '@fortawesome/free-solid-svg-icons/faSignOut';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
//
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { PlainButton } from './Input/PlainButton';
import { LoginModal } from './Modal/Login';
import { LogoutModal } from './Modal/Logout';
import { useClient } from '#/contexts/ClientContext';

export function NavigationBar() {
    const client = useClient();
    const router = useRouter();
    const { theme, setTheme } = useTheme();

    const [isMounted, setIsMounted] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState<string | undefined>(undefined);

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (client.isLoggedIn() !== isLoggedIn) {
            setIsLoggedIn(client.isLoggedIn());
            setUserId(client.id ?? undefined);
        }
    }, [client.isLoggedIn()]);

    if (!isMounted) return null;
    return <nav
        id="navigation-bar"
        className="z-20 flex flex-row p-3 text-white bg-neutral-800"
    >
        <div className="max-w-7xl w-full flex flex-col md:flex-row items-center mx-auto">
            <PlainButton
                className="mx-auto md:ml-0 font-bold text-1.5xl
                    text-sky-400 hover:text-white bg-transparent"
                linkProps={{ href: '/' }}
            >
                APTERYX OWENII
            </PlainButton>

            <div className="flex flex-wrap">
                <PlainButton
                    className="hover:text-sky-400"
                    iconProp={faGamepad}
                    linkProps={{ href: '/games' }}
                >
                    Games
                </PlainButton>

                {/* <PlainButton
                    className="hover:text-sky-400"
                    iconProp={faMarker}
                    linkProps={userId ? { href: '/games/new' } : undefined}
                    onClick={
                        userId ? undefined : () => setIsLoginModalOpen(true)
                    }
                >
                    Create
                </PlainButton> */}

                {/* <PlainButton
                    className="hover:text-sky-400"
                    iconProp={faFontAwesome}
                    linkProps={{ href: '/patchnotes' }}
                >
                    Patch Notes
                </PlainButton> */}

                <PlainButton
                    className="hover:text-sky-400"
                    iconProp={faUser}
                    onClick={() =>
                        userId
                            ? // If the user is already on the profile page, need to refresh
                              router.asPath.includes('/users/')
                                ? window.location.replace(`/users/${userId}`)
                                : router.push(`/users/${userId}`)
                            : setIsLoginModalOpen(true)
                    }
                >
                    Profile
                </PlainButton>

                {!isLoggedIn && <PlainButton
                    className="hover:text-sky-400"
                    iconProp={faSignIn}
                    onClick={() => setIsLoginModalOpen(true)}
                >
                    Login
                </PlainButton>}

                {isLoggedIn && <PlainButton
                    className="hover:text-sky-400"
                    iconProp={faSignOut}
                    onClick={() => setIsLogoutModalOpen(true)}
                >
                    Logout
                </PlainButton>}

                <PlainButton
                    className="hover:text-sky-400"
                    iconProp={theme === 'light' ? faCloudMoon : faCloudSun}
                    ariaLabel="Toggle theme"
                    onClick={() =>
                        setTheme(theme === 'light' ? 'dark' : 'light')
                    }
                ></PlainButton>
            </div>
        </div>

        <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
        />

        <LogoutModal
            isOpen={isLogoutModalOpen}
            onClose={() => setIsLogoutModalOpen(false)}
        />
    </nav>;
}
