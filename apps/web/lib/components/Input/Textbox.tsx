import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { motion } from 'framer-motion';
import type {
    ChangeEvent,
    Dispatch,
    KeyboardEvent,
    SetStateAction,
} from 'react';
import { useRef, useState } from 'react';
import { Button } from './Button';

export function Textbox(props: Textbox.Props) {
    if (props.enableEnter && props.enableOnChange)
        throw new Error(
            'Textbox cannot have both enableEnter and enableOnChange'
        );

    const [value, setValue] = props.setValue
        ? [props.value ?? '', props.setValue]
        : useState(props.value ?? '');
    const searchTimeout = useRef<ReturnType<typeof setTimeout>>(null!);

    return <div role={props.ariaRole} className="flex">
        <motion.input
            className={`w-full p-2 ${
                props.enableIcon ? 'rounded-l-xl' : 'rounded-xl'
            } bg-neutral-100 dark:bg-neutral-800 ${props.className ?? ''}`}
            placeholder={props.placeHolder}
            value={value}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setValue(event.currentTarget.value);
                clearTimeout(searchTimeout.current);

                if (props.enableOnChange)
                    searchTimeout.current = setTimeout(() => {
                        props.onValue(event.currentTarget.value);
                    }, 300);
            }}
            onKeyUp={(event: KeyboardEvent<HTMLInputElement>) => {
                if (props.enableEnter && event.key === 'Enter') {
                    props.onValue(value);
                    event.currentTarget.blur();
                    return;
                }

                if (props.onKeyUp) props.onKeyUp(value, event.key);
            }}
            disabled={props.isDisabled}
        />

        {props.enableIcon && <Button
            className="rounded-l-none px-3"
            iconProp={faSearch}
            onClick={() => props.enableIcon && props.onValue(value)}
            ariaLabel={props.placeHolder ?? '...'}
        />}
    </div>;
}

export namespace Textbox {
    export interface Props {
        className?: string;
        isDisabled?: boolean;

        value?: string;
        setValue?: Dispatch<SetStateAction<string>>;

        iconProp?: IconProp;
        placeHolder?: string;
        ariaRole?: string;

        onKeyUp?(value: string, key: string): void;
        onValue(value: string): void;

        enableEnter?: boolean;
        enableOnChange?: boolean;
        enableIcon?: boolean;
    }
}
