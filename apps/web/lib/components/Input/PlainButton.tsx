import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import type { LinkProps } from 'next/link';
import Link from 'next/link';
import React from 'react';

export namespace PlainButton {
    export interface Props {
        className?: string;

        iconProp?: IconProp;
        ariaLabel?: string;
        title?: string;

        onClick?(): void;
        linkProps?: LinkProps;
        children?: React.ReactNode | React.ReactNode[];
    }
}

export function PlainButton(props: PlainButton.Props) {
    if (!props.linkProps && !props.onClick)
        throw new Error('PlainButton must have either linkProps or an onClick');
    if (props.linkProps && props.onClick)
        throw new Error(
            'PlainButton cannot have both linkProps and an onClick'
        );

    const className = `
        flex flex-row gap-2 w-auto p-3 rounded-xl
        items-center justify-center text-center
        transition-all duration-200 ease-in-out
        ${props.className ?? ''}`;

    return props.linkProps ? (
        <Link className={className} title={props.title} {...props.linkProps}>
            {props.iconProp && <FontAwesomeIcon icon={props.iconProp} />}
            {props.children}
        </Link>
    ) : (
        <motion.button
            className={className}
            onClick={props.onClick}
            title={props.title}
            aria-label={props.ariaLabel}
        >
            {props.iconProp && <FontAwesomeIcon icon={props.iconProp} />}
            {props.children}
        </motion.button>
    );
}
