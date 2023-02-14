import React from 'react';

export function Container(props: Container.Props) {
    return React.createElement(
        props.parentType ?? 'div',
        { className: `z-10 ${props.parentClassName ?? ''}`, id: props.id },
        React.createElement(
            props.childType ?? 'div',
            { className: `max-w-8xl mx-auto ${props.childClassName ?? ''}` },
            props.children
        )
    );
}

export namespace Container {
    export interface Props {
        id?: string;
        parentType?: keyof React.ReactHTML;
        childType?: keyof React.ReactHTML;
        parentClassName?: string;
        childClassName?: string;
        children: React.ReactNode | React.ReactNode[];
    }
}
