import { faDiscord } from '@fortawesome/free-brands-svg-icons/faDiscord';
// import { faReddit } from '@fortawesome/free-brands-svg-icons/faReddit';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Button } from '../Input/Button';
import { Modal } from './Modal';
import { useApiUrl } from '#/hooks/useEnv';

export namespace LoginModal {
    export type Props = Omit<
        Modal.Props & {
            closeLabel?: string;
        },
        'children'
    >;
}

export function LoginModal(props: LoginModal.Props) {
    const router = useRouter();
    useEffect(() => {
        if (props.isOpen) {
            localStorage.setItem('owenii.back_to', router.asPath);
        }
    }, [props.isOpen]);

    return <Modal
        className="flex flex-col gap-3 items-center justify-center"
        {...props}
    >
        <h2 className="text-xl font-bold">Login / Sign Up</h2>

        <div className="w-full flex flex-col gap-3 text-lg font-semibold">
            <Button
                className="bg-[#5865F2] text-white"
                whileHover="brightness-125"
                disableDefaultStyles
                iconProp={faDiscord}
                linkProps={{
                    href: new URL('/auth/discord/login', useApiUrl()),
                }}
            >
                Sign in with Discord
            </Button>

            <Button
                className="bg-[#24292E] text-white"
                whileHover="brightness-125"
                disableDefaultStyles
                iconProp={faGithub}
                linkProps={{ href: new URL('/auth/github/login', useApiUrl()) }}
            >
                Sign in with GitHub
            </Button>

            {/* <Button
                className="bg-[#FF5700] text-white"
                iconProp={faReddit}
                onClick={r =>
                    r.push(new URL('/auth/reddit/login', useApiUrl()))
                }
            >
                Sign in with Reddit
            </Button> */}
        </div>

        <p className="text-center text-sm opacity-50 max-w-[320px]">
            Owenii will only ever access your display name and avatar. Your
            email address or any other personal information will{' '}
            <strong>NEVER</strong> be stored or shared by Owenii.
        </p>

        <Button className="p-0" disableDefaultStyles onClick={props.onClose}>
            {props.closeLabel ?? 'Cancel'}
        </Button>
    </Modal>;
}
