import { motion } from 'framer-motion';
import type {
    ChangeEvent,
    Dispatch,
    KeyboardEvent,
    SetStateAction,
} from 'react';
import { useRef, useState } from 'react';

export function Textarea(props: Textarea.Props) {
    if (props.enableEnter && props.enableOnChange)
        throw new Error(
            'Textarea cannot have both enableEnter and enableOnChange'
        );

    const [value, setValue] = props.setValue
        ? [props.value ?? '', props.setValue]
        : useState(props.value ?? '');
    const searchTimeout = useRef<ReturnType<typeof setTimeout>>(null!);

    return <div role={props.ariaRole} className="flex">
        <motion.textarea
            className={`w-full p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 ${
                props.className ?? ''
            }`}
            placeholder={props.placeHolder}
            value={value}
            minLength={props.minLength}
            maxLength={props.maxLength}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                setValue(event.currentTarget.value);
                clearTimeout(searchTimeout.current);

                if (props.enableOnChange)
                    searchTimeout.current = setTimeout(() => {
                        props.onValue(event.currentTarget.value);
                    }, 300);
            }}
            onKeyUp={(event: KeyboardEvent<HTMLTextAreaElement>) => {
                if (props.enableEnter && event.key === 'Enter') {
                    props.onValue(value);
                    event.currentTarget.blur();
                    return;
                }

                if (props.onKeyUp) props.onKeyUp(value, event.key);
            }}
            disabled={props.isDisabled}
        />
    </div>;
}

export namespace Textarea {
    export interface Props {
        className?: string;
        isDisabled?: boolean;

        value?: string;
        setValue?: Dispatch<SetStateAction<string>>;

        placeHolder?: string;
        ariaRole?: string;
        minLength?: number;
        maxLength?: number;

        onKeyUp?(value: string, key: string): void;
        onValue(value: string): void;

        enableEnter?: boolean;
        enableOnChange?: boolean;
    }
}
