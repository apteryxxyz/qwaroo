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
    const [isValid, setIsValid] = useState(
        props.mustMatch ? props.mustMatch.test(value) : true
    );
    const searchTimeout = useRef<ReturnType<typeof setTimeout>>(null!);

    return <div role={props.ariaRole} className="flex">
        <motion.textarea
            className={`w-full p-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl
                ${isValid ? '' : 'outline outline-red-500'}
                ${props.className ?? ''}`}
            placeholder={props.placeHolder}
            value={value}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                setValue(event.currentTarget.value);
                clearTimeout(searchTimeout.current);

                if (props.mustMatch && !props.mustMatch.test(value))
                    return setIsValid(false);
                else setIsValid(true);

                if (props.enableOnChange)
                    searchTimeout.current = setTimeout(() => {
                        props.onValue(event.currentTarget.value);
                    }, 300);
            }}
            onKeyUp={(event: KeyboardEvent<HTMLTextAreaElement>) => {
                if (props.mustMatch && !props.mustMatch.test(value))
                    return setIsValid(false);
                else setIsValid(true);

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
        // Styling
        className?: string;
        ariaRole?: string;

        // State
        value?: string;
        setValue?: Dispatch<SetStateAction<string>>;
        isDisabled?: boolean;
        isRequired?: boolean;
        mustMatch?: RegExp;

        // Input Properties
        placeHolder?: string;
        enableEnter?: boolean;
        enableOnChange?: boolean;

        // Callbacks
        onKeyUp?(value: string, key: string): void;
        onValue(value: string): void;
    }
}
