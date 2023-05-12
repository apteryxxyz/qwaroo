import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { motion } from 'framer-motion';
import type {
    AriaRole,
    Dispatch,
    HTMLInputTypeAttribute,
    SetStateAction,
} from 'react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../Button';

export function StringTextbox(props: StringTextbox.Props) {
    const [value, setValue] = props.setValue
        ? [props.value ?? '', props.setValue]
        : useState(props.value ?? '');
    const [error, setError] = useState<string | null>(null);
    const searchTimeout = useRef<ReturnType<typeof setTimeout>>(null!);

    async function validate() {
        const valueExists = value && value.trim() !== '';
        const doesMatch = props.mustMatch?.test(value) ?? true;

        if (props.minLength && value.length < props.minLength)
            return `Must be at least ${props.minLength} characters long`;
        if (props.maxLength && value.length > props.maxLength)
            return `Must be at most ${props.maxLength} characters long`;

        if (!valueExists && props.isRequired) return 'Required';
        if (valueExists && !doesMatch) return 'Invalid format';

        const additionalValidation =
            (await props.additionalValidation?.(value)) ?? null;
        if (additionalValidation) return additionalValidation;

        return null;
    }

    useEffect(() => {
        (async () => {
            const result = await validate();
            setError(result);
            props.onValidate?.(result);
        })();
    }, [value]);

    return <div role={props.ariaRole} className="relative flex">
        {error && <p className="absolute text-red-500 bottom-1 right-1 px-1">
            {error}
        </p>}

        <motion.input
            type={props.type}
            placeholder={props.placeHolder}
            disabled={props.isDisabled}
            className={`w-full p-2 bg-white dark:bg-neutral-700
                ${props.enableIcon ? 'rounded-l-xl' : 'rounded-xl'}
                ${error ? 'outline outline-red-500' : ''}
                ${props.isDisabled ? 'cursor-not-allowed' : ''}
                ${props.className ?? ''}`}
            value={value}
            //
            onBlur={() => {
                if (error || !props.onBlur) return;
                props.onBlur(value);
            }}
            //
            onChange={event => {
                const newValue = event.currentTarget.value;
                clearTimeout(searchTimeout.current);
                setValue(newValue);

                const isLengthError = error?.includes('Must have at');
                if (
                    (error && !isLengthError) ||
                    !props.enableOnChange ||
                    !props.onValue
                )
                    return;

                searchTimeout.current = setTimeout(() => {
                    if (!props.onValue) return;
                    props.onValue(value);
                }, 300);
            }}
            //
            onKeyUp={event => {
                const isLengthError = error?.includes('Must have at');
                if (error && !isLengthError) return;

                if (
                    props.enableEnter &&
                    props.onValue &&
                    event.key === 'Enter'
                ) {
                    props.onValue(value);
                    event.currentTarget.blur();
                    return;
                }

                if (props.onKeyUp) props.onKeyUp(event.key, value);
            }}
        />

        {props.enableIcon && <Button
            className="rounded-l-none px-3"
            iconProp={faSearch}
            onClick={() => {
                if (!props.enableIcon || !props.onValue) return;
                return props.onValue(value);
            }}
            ariaLabel={props.placeHolder ?? '...'}
        />}
    </div>;
}

export namespace StringTextbox {
    export interface Props {
        // Styling
        ariaRole?: AriaRole;
        className?: string;

        // State
        value?: string;
        setValue?: Dispatch<SetStateAction<string>>;

        // Validate
        isRequired?: boolean;
        mustMatch?: RegExp;
        minLength?: number;
        maxLength?: number;
        additionalValidation?(
            value: string
        ): string | null | Promise<string | null>;

        // Input
        type?: HTMLInputTypeAttribute;
        placeHolder?: string;
        isDisabled?: boolean;

        // Icon Properties
        iconProp?: IconProp;

        // Enabling
        enableEnter?: boolean;
        enableIcon?: boolean;
        enableOnChange?: boolean;

        // Callbacks
        onKeyUp?(key: string, value: string): void;
        onValue?(value: string): void;
        onBlur?(value: string): void;
        onValidate?(value: string | null): void;
    }
}
