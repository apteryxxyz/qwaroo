import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { motion } from 'framer-motion';
import { type ChangeEvent, type KeyboardEvent, useRef, useState } from 'react';
import { Button } from './Button';

export namespace Textbox {
    export interface Props {
        className?: string;

        defaultValue?: string;
        placeHolder?: string;
        isDisabled?: boolean;

        iconProp?: IconProp;
        onValue(value: string): void;

        enableEnterKey?: boolean;
        enableInputChange?: boolean;
        enableIconClick?: boolean;
    }
}

export function Textbox(props: Textbox.Props) {
    const [value, setValue] = useState(props.defaultValue ?? '');
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | undefined>();

    return <div
        className={`
            w-auto flex items-center justify-center text-center
            transition-all duration-200 ease-in-out
            bg-white dark:bg-neutral-800 rounded-xl
            ${props.className ?? ''}
        `}
    >
        <motion.input
            className="w-full p-3 bg-transparent rounded-l-xl"
            placeholder={props.placeHolder ?? '...'}
            defaultValue={value}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                clearTimeout(searchTimeout.current);
                setValue(event.target.value);

                if (props.enableInputChange)
                    searchTimeout.current = setTimeout(() => {
                        props.onValue(event.target.value);
                    }, 300);
            }}
            onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                if (props.enableEnterKey && event.key === 'Enter') {
                    clearTimeout(searchTimeout.current);
                    props.onValue(value);
                }
            }}
            disabled={props.isDisabled}
        />

        {props.iconProp && <Button
            className="shadow-none m-1"
            iconProp={props.iconProp}
            onClick={() => props.enableEnterKey && props.onValue(value)}
            ariaLabel={props.placeHolder ?? '...'}
        ></Button>}
    </div>;
}
