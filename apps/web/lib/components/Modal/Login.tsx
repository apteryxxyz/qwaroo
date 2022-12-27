import { faDiscord } from '@fortawesome/free-brands-svg-icons/faDiscord';
// import { faReddit } from '@fortawesome/free-brands-svg-icons/faReddit';
// import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { useEffect, useState } from 'react';
import { Button } from '../Input/Button';
import { Modal } from './Modal';
import { useApiUrl } from '#/hooks/useEnv';
import { getBackTo, setBackTo } from '#/utilities/backTo';

export namespace LoginModal {
    export type Props = Omit<
        Modal.Props & {
            closeLabel?: string;
        },
        'children'
    >;
}

export function LoginModal(props: LoginModal.Props) {
    const [previousBackTo, setPreviousBackTo] = useState<string | null>(null);

    useEffect(() => {
        if (props.isOpen) {
            setPreviousBackTo(getBackTo());
            setBackTo();
        }
    }, [props.isOpen]);

    return <Modal
        className="flex flex-col gap-3 items-center justify-center"
        {...props}
        onClose={() => {
            if (previousBackTo) setBackTo(previousBackTo);
            props.onClose();
        }}
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

            {/* <Button
                className="bg-[#24292E] text-white"
                whileHover="brightness-125"
                disableDefaultStyles
                iconProp={faGithub}
                linkProps={{ href: new URL('/auth/github/login', useApiUrl()) }}
            >
                Sign in with GitHub
            </Button> */}

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
            Qwaroo will only ever access your display name and avatar. Your
            email address or any other personal information will{' '}
            <strong>NEVER</strong> be stored or shared by Qwaroo.
        </p>

        <Button
            className="p-0"
            disableDefaultStyles
            onClick={() => {
                if (previousBackTo) setBackTo(previousBackTo);
                props.onClose();
            }}
        >
            {props.closeLabel ?? 'Cancel'}
        </Button>
    </Modal>;
}
