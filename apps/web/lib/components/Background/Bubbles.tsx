import { useEffect, useState } from 'react';
import styles from './Bubbles.module.css';

export function Bubbles({ count }: { count: number }) {
    return <div aria-hidden className={styles['bubbles']}>
        {Array.from({ length: count }, (_, i) => <Bubble
            key={i}
            index={i}
            count={count}
        />)}
    </div>;
}

function Bubble({ index, count }: { index: number; count: number }) {
    // Need to use state here because the values
    // need to be the same on the server as the client
    const [size, setSize] = useState(0);
    const [speed, setSpeed] = useState(0);
    const [delay, setDelay] = useState(0);

    const rand = (min: number, max: number) =>
        Math.random() * (max - min) + min;

    useEffect(() => {
        setSize(rand(10, 50));
        setSpeed(rand(7, 12));
        setDelay(rand(-5, 0));
    }, []);

    return <span
        style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${(index / count) * 100}%`,
            animationDuration: `${speed}s`,
            animationDelay: `${delay}s`,
        }}
        className={`bg-qwaroo-gradient dark:bg-white
            opacity-50 dark:opacity-20 ${styles['bubble']}`}
    ></span>;
}
