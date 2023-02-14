import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import type { LinkProps } from 'next/link';
import Link from 'next/link';

export function Button(props: Button.Props) {
    if (!props.linkProps && !props.onClick)
        throw new Error('Button must have either linkProps or onClick');
    if (props.linkProps && props.onClick)
        throw new Error('Button cannot have both linkProps and onClick');

    const className = `
        flex gap-2 px-3 py-2 rounded-xl cursor-pointer
        items-center justify-center text-center
        text-white bg-qwaroo-500 hover:brightness-125
        dark:bg-neutral-800 dark:hover:brightness-125
        transition-color duration-200
        ${props.className ?? ''}`
        .replaceAll(/\s+/g, ' ')
        .trim();

    return props.linkProps?.newTab ? (
        <a
            id={props.id}
            className={className}
            style={props.style}
            title={props.hoverText}
            href={String(props.linkProps.href)}
            target="_blank"
            role={props.ariaRole}
            aria-label={props.ariaLabel}
        >
            {props.iconProp && <FontAwesomeIcon icon={props.iconProp} />}
            {props.children}
        </a>
    ) : props.linkProps ? (
        <Link
            id={props.id}
            className={className}
            style={props.style}
            title={props.hoverText}
            {...props.linkProps}
            role={props.ariaRole}
            aria-label={props.ariaLabel}
        >
            {props.iconProp && <FontAwesomeIcon icon={props.iconProp} />}
            {props.children}
        </Link>
    ) : (
        <motion.button
            id={props.id}
            className={className}
            style={props.style}
            onClick={props.onClick}
            title={props.hoverText}
            role={props.ariaRole}
            aria-label={props.ariaLabel}
        >
            {props.iconProp && <FontAwesomeIcon icon={props.iconProp} />}
            {props.children}
        </motion.button>
    );
}

export namespace Button {
    export interface Props {
        id?: string;
        className?: string;
        style?: React.CSSProperties;

        iconProp?: IconProp;
        hoverText?: string;
        ariaLabel?: string;
        ariaRole?: string;

        disableGradient?: boolean;

        onClick?(): void;
        linkProps?: LinkProps & { newTab?: boolean };
        children?: React.ReactNode | React.ReactNode[];
    }
}
