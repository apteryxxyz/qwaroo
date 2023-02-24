/* eslint-disable no-multi-assign */
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { Button } from './Button';
import { useOnClickOutside } from '#/hooks/useOnClickOutside';

export function Dropdown<V extends string | number>(props: Dropdown.Props<V>) {
    const defaultValue = props.defaultValue ?? props.options[0].value;
    const defaultOption = props.options.find(o => o.value === defaultValue)!;

    const dropdownRef = useRef<HTMLDivElement>(null);
    const [selected, setSelected] = useState(defaultOption);
    const [isOpen, setIsOpen] = useState(false);

    function onChange(value: V) {
        if (isOpen) setIsOpen(false);
        props.onChange(value);
        setSelected(props.options.find(o => o.value === value)!);
    }

    useOnClickOutside(dropdownRef, () => setIsOpen(false));

    return <div ref={dropdownRef} className="flex flex-col">
        <Button
            // I hate that I have to hard code this width, but I can't
            // figure out how to get the width of the button and options
            // to be the same without weird resizing animations
            className={`w-full min-w-[180px] ${isOpen && '!rounded-b-none'}`}
            iconProp={isOpen ? faChevronUp : faChevronDown}
            onClick={() => setIsOpen(!isOpen)}
        >
            {selected.label}
        </Button>

        <motion.div
            className="absolute mt-10 rounded-b-xl z-[2]"
            initial="exit"
            animate={isOpen ? 'enter' : 'exit'}
            variants={Dropdown.Varients}
            role="listbox"
        >
            {props.options
                .filter(option => option.value !== selected.value)
                .map((option, index, self) => <Option
                    key={option.label}
                    {...option}
                    isLast={index === self.length - 1}
                    onClick={value => onChange(value as V)}
                />)}
        </motion.div>
    </div>;
}

export namespace Dropdown {
    export interface Props<V extends string | number> {
        className?: string;
        isDisabled?: boolean;
        ignoreResize?: boolean;

        options: { label: string; value: V }[];
        defaultValue?: string | number;

        onChange(value: V): void;
    }

    export const MinimumWidth = 100;

    export const Varients = {
        enter: {
            opacity: 1,
            rotateX: 0,
            transition: {
                duration: 0.1,
            },
            display: 'block',
        },
        exit: {
            opacity: 0,
            rotateX: -15,
            transition: {
                duration: 0.1,
            },
            transitionEnd: {
                display: 'none',
            },
        },
    };
}

export function Option(props: Option.Props) {
    return <Button
        className={`w-full min-w-[180px] rounded-none
            ${props.isLast ? '!rounded-b-xl' : ''}`}
        onClick={() => props.onClick(props.value)}
        ariaRole="option"
    >
        {props.label}
    </Button>;
}

export namespace Option {
    export interface Props {
        label: string;
        value: string | number;
        isLast: boolean;
        onClick(value: string | number): void;
    }
}
