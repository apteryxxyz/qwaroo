import styles from './Circle.module.css';

export function Circle(props: Circle.Props) {
    return <div {...props}>
        <div className={styles['loading-circle']} />
    </div>;
}

export namespace Circle {
    export interface Props {
        className?: string;
        style?: React.CSSProperties;
    }
}
