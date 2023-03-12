import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { motion } from 'framer-motion';
import type {
    ChangeEvent,
    Dispatch,
    KeyboardEvent,
    SetStateAction,
} from 'react';
import { useEffect, useRef, useState } from 'react';
import { Button } from './Button';

export function Textbox(props: Textbox.Props) {
    if (props.enableEnter && props.enableOnChange)
        throw new Error(
            'Textbox cannot have both enableEnter and enableOnChange'
        );

    const [value, setValue] = props.setValue
        ? [props.value ?? '', props.setValue]
        : useState(props.value ?? '');
    const [isValid, setIsValid] = useState(true);
    const searchTimeout = useRef<ReturnType<typeof setTimeout>>(null!);

    function updateIsValid() {
        const valueExists = value.trim() !== '';
        const doesMatch = props.mustMatch?.test(value) ?? true;

        if (props.isRequired && !valueExists) return setIsValid(false);
        else if (!valueExists) return setIsValid(!props.isRequired);
        else if (!doesMatch && (props.isRequired || !props.isRequired))
            return setIsValid(false);
        else return setIsValid(true);
    }

    useEffect(updateIsValid, [value]);

    return <div role={props.ariaRole} className="flex">
        <motion.input
            className={`w-full p-2 bg-neutral-100 dark:bg-neutral-800
                ${props.enableIcon ? 'rounded-l-xl' : 'rounded-xl'}
                ${isValid ? '' : 'outline outline-red-500'}
                ${props.className ?? ''}`}
            placeholder={props.placeHolder}
            value={value}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setValue(event.currentTarget.value);
                clearTimeout(searchTimeout.current);

                if (!isValid) return;

                if (props.enableOnChange)
                    searchTimeout.current = setTimeout(() => {
                        props.onValue(event.currentTarget.value);
                    }, 300);
            }}
            onKeyUp={(event: KeyboardEvent<HTMLInputElement>) => {
                if (!isValid) return;

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

        // Icon Properties
        iconProp?: IconProp;
        enableIcon?: boolean;

        // Callbacks
        onKeyUp?(value: string, key: string): void;
        onValue(value: string): void;
    }
}
