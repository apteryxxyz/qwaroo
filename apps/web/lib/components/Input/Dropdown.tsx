import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from './Button';

export namespace Dropdown {
    export interface Props {
        disableDefaultStyles?: boolean;
        className?: string;

        options: { label: string; value: string }[];
        currentValue?: string;
        isDisabled?: boolean;

        onChange?(value: string): void;
    }
}

export function Dropdown(props: Dropdown.Props) {
    const currentValue = props.currentValue ?? props.options[0].value;

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
            {props.options.find(option => option.value === currentValue)
                ?.label ?? currentValue}
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
            {props.options.map((option, i) => <Button
                key={option.value}
                disableDefaultStyles
                className={`min-w-[200px] !justify-start bg-white dark:bg-neutral-800 rounded-none
                    ${
                        i === 0
                            ? 'rounded-t-xl'
                            : i === props.options.length - 1
                            ? 'rounded-b-xl'
                            : ''
                    }`}
                whileHover="bg-neutral-100 dark:brightness-125"
                isActive={option.value === currentValue}
                whileActive="text-white bg-qwaroo-400 hover:bg-qwaroo-400 hover:brightness-125"
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
