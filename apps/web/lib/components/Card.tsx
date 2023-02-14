export function Card(props: Card.Props) {
    return <section
        className={`p-3 gap-3 rounded-xl shadow-md
        bg-neutral-100 dark:bg-neutral-800 ${props.className ?? ''}`}
    >
        {props.children}
    </section>;
}

export namespace Card {
    export interface Props {
        className?: string;
        children: React.ReactNode | React.ReactNode[];
    }
}
