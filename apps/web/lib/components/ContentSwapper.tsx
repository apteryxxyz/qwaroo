import React from 'react';

export function ContentSwapper(props: ContentSwapper.Props) {
    const content = React.Children.toArray(props.children);

    return <>
        {content.map((element, i) => <section
            key={i}
            className={i === props.index ? 'visible' : 'hidden'}
        >
            {element}
        </section>)}
    </>;
}

export namespace ContentSwapper {
    export interface Props {
        index: number;
        children: React.ReactNode | React.ReactNode[];
    }
}
