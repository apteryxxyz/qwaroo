import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from './Button';

export namespace Dropdown {
    export interface Props {
        disableDefaultStyles?: boolean;
        className?: string;

        options: ({ label: string; value: string } | string)[];
        currentValue?: string;
        isDisabled?: boolean;

        onChange?(value: string): void;
    }
}

export function Dropdown(props: Dropdown.Props) {
    const options = props.options.map(option => {
        if (typeof option === 'string') return { label: option, value: option };
        else return option;
    });
    const currentValue = props.currentValue ?? options[0].value;

    const [isHover, setHover] = useState(false);

    function outsideListener(event: MouseEvent) {
        if (
            event.target instanceof Element &&
            !event.target.closest('.dropdown')
        ) {
            setHover(false);
            window.removeEventListener('click', outsideListener);
        }
    }

    function toggleHover() {
        if (props.isDisabled) return;
        setHover(!isHover);
        window.addEventListener('click', outsideListener);
        return () => window.removeEventListener('click', outsideListener);
    }

    return <div className="dropdown">
        <Button
            disableDefaultStyles={props.disableDefaultStyles}
            className={props.className}
            isDisabled={props.isDisabled}
            onClick={() => toggleHover()}
            iconProp={isHover ? faChevronUp : faChevronDown}
        >
            {options.find(option => option.value === currentValue)!.label}
        </Button>

        <motion.div
            className="absolute z-10"
            initial="exit"
            animate={isHover ? 'enter' : 'exit'}
            variants={{
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
            }}
        >
            {options.map((option, i) => <Button
                key={option.value}
                disableDefaultStyles
                className={`min-w-[200px] !justify-start bg-white dark:bg-neutral-800 rounded-none
                    ${
                        i === 0
                            ? 'rounded-t-xl'
                            : i === options.length - 1
                            ? 'rounded-b-xl'
                            : ''
                    }`}
                whileHover="bg-neutral-100 dark:brightness-125"
                isActive={option.value === currentValue}
                whileActive="text-white bg-sky-400 hover:bg-sky-400 hover:brightness-125"
                onClick={() => {
                    toggleHover();
                    props.onChange?.(option.value);
                }}
            >
                {option.label}
            </Button>)}
        </motion.div>
    </div>;
}

/*
export function Dropdown(props: Dropdown.Props) {
    return <div className="dropdown">
        <motion.div
            className="absolute z-10 w-full"
            initial="exit"
            animate={isHover ? 'enter' : 'exit'}
            variants={{
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
            }}
        >
            {options.map(option => <Button
                disableDefaultStyles={props.disableDefaultStyles}
                className="w-full"
                onClick={() => {
                    toggleHover();
                    props.onChange?.(option.value);
                }}
            >
                {option.label}
            </Button>)}
        </motion.div>
    </div>;
}
*/
