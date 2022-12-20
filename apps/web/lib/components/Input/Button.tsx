import { PlainButton } from './PlainButton';

export namespace Button {
    export interface Props extends PlainButton.Props {
        disableDefaultStyles?: boolean;
        whileHover?: string;
        whileActive?: string;

        isDisabled?: boolean;
        isActive?: boolean;
    }
}

export function Button(props: Button.Props) {
    const newClassName = `
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

        ${prependToClass('hover', props.whileHover ?? '')}
        ${(props.isActive && (props.whileActive ?? '')) || ''}
        ${props.className ?? ''}`;

    return <PlainButton {...props} className={newClassName} />;
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
