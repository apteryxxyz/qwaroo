import type { Embed } from './Embed';
import { Dropdown } from '#/components/Input/Dropdown';
import { Modal } from '#/components/Modal';

export function Settings(props: Settings.Props) {
    return <Modal
        title="Game Settings"
        isOpen={props.isOpen}
        toClose={props.toClose}
    >
        <div>
            <span>Image Cropping</span>
            <Dropdown
                options={[
                    { label: 'Auto', value: 'auto' },
                    { label: 'Crop', value: 'crop' },
                    { label: 'None', value: 'none' },
                ]}
                defaultValue={props.settings.imageCropping}
                onChange={val => props.mergeSettings({ imageCropping: val })}
            />
        </div>
        <div>
            <span>Image Quality</span>
            <Dropdown
                options={[
                    { label: 'Max', value: 'max' },
                    { label: 'Reduced', value: 'reduced' },
                ]}
                defaultValue={props.settings.imageQuality}
                onChange={val => props.mergeSettings({ imageQuality: val })}
            />
        </div>
    </Modal>;
}

export namespace Settings {
    export interface Props {
        isOpen: boolean;
        toClose(): void;
        settings: Embed.Settings;
        mergeSettings(settings: Partial<Embed.Settings>): void;
    }
}
