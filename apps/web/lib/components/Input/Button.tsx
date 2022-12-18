import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import type { LinkProps } from 'next/link';
import Link from 'next/link';
import React from 'react';

export namespace Button {
    export interface Props {
        className?: string;
        whileHover?: string;
        whileActive?: string;
        disableDefaultStyles?: boolean;

        isDisabled?: boolean;
        isActive?: boolean;

        iconProp?: IconProp;
        ariaLabel?: string;

        onClick?(): void;
        linkProps?: LinkProps;
        children?: React.ReactNode | React.ReactNode[];
    }
}

export function Button(props: Button.Props) {
    if (!props.linkProps && !props.onClick)
        throw new Error('Button must have either linkProps or an onClick');
    if (props.linkProps && props.onClick)
        throw new Error('Button cannot have both linkProps and an onClick');

    const className = `
        flex flex-row gap-2 w-auto p-3 rounded-xl
        items-center justify-center text-center
        transition-all duration-200 ease-in-out

        ${
            !props.disableDefaultStyles &&
            `bg-white shadow-lg dark:bg-neutral-800
            hover:dark:brightness-125
            ${
                props.className?.includes('bg-')
                    ? 'hover:brightness-125'
                    : 'hover:bg-neutral-50'
            }`
        }

        ${(props.isActive && (props.whileActive ?? '')) ?? ''}
        ${prependToClass('hover', props.whileHover ?? '')}
        ${props.className ?? ''}
        `.replaceAll(/\s+/g, ' ');

    return props.linkProps ? (
        <Link className={className} {...props.linkProps}>
            {props.iconProp && <FontAwesomeIcon icon={props.iconProp} />}
            {props.children}
        </Link>
    ) : (
        <motion.button className={className} onClick={props.onClick}>
            {props.iconProp && <FontAwesomeIcon icon={props.iconProp} />}
            {props.children}
        </motion.button>
    );
}

function prependToClass(prefix: string, className: string) {
    return className
        .split(' ')
        .filter(Boolean)
        .map(name => {
            if (name.startsWith('dark:'))
                return name.replace('dark:', `dark:${prefix}:`);
            return `${prefix}:${name}`;
        })
        .join(' ');
}
