import { faSignOut } from '@fortawesome/free-solid-svg-icons/faSignOut';
import { Button } from '../Input/Button';
import { Modal } from './Modal';

export namespace LogoutModal {
    export type Props = Omit<
        Modal.Props & {
            closeLabel?: string;
        },
        'children'
    >;
}

export function LogoutModal(props: LogoutModal.Props) {
    return <Modal
        className="flex flex-col gap-3 items-center justify-center"
        {...props}
    >
        <h2 className="text-xl font-bold">Confirm Logout</h2>

        <div className="w-full flex flex-col gap-3 text-lg font-semibold">
            <Button
                className="!bg-red-500 text-white"
                iconProp={faSignOut}
                onClick={() => {
                    localStorage.removeItem('owenii.token');
                    window.location.reload();
                }}
            >
                Logout
            </Button>
        </div>

        <Button className="p-0" disableDefaultStyles onClick={props.onClose}>
            {props.closeLabel ?? 'Cancel'}
        </Button>
    </Modal>;
}
