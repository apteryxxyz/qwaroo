import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { motion } from 'framer-motion';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { useRef, useState } from 'react';
import { Button } from './Button';

export function Textbox(props: Textbox.Props) {
    if (props.enableEnter && props.enableOnChange)
        throw new Error(
            'Textbox cannot have both enableEnter and enableOnChange'
        );

    const [value, setValue] = useState(props.defaultValue ?? '');
    const searchTimeout = useRef<ReturnType<typeof setTimeout>>(null!);

    return <div
        className={`flex ${props.className ?? ''}`}
        role={props.ariaRole}
    >
        <motion.input
            className="w-full p-2 rounded-l-xl bg-neutral-100 dark:bg-neutral-800"
            placeholder={props.placeHolder}
            defaultValue={value}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                clearTimeout(searchTimeout.current);
                setValue(event.target.value);

                if (props.enableOnChange)
                    searchTimeout.current = setTimeout(() => {
                        props.onValue(event.target.value);
                    }, 300);
            }}
            onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                if (props.enableEnter && event.key === 'Enter') {
                    props.onValue(value);
                    event.currentTarget.blur();
                }
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

        iconProp?: IconProp;
        defaultValue?: string;
        placeHolder?: string;
        ariaRole?: string;

        onValue(value: string): void;

        enableEnter?: boolean;
        enableOnChange?: boolean;
        enableIcon?: boolean;
    }
}
