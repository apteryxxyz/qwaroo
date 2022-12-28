import { useEffect, useState } from 'react';

export namespace CountUpNumber {
    export interface Props {
        startValue?: number;
        endValue: number;
        animationDuration?: number;
        format?(value: number): string;
    }
}

export function CountUpNumber({
    startValue = 0,
    endValue,
    animationDuration = endValue > 10 ? 1_000 : 500,
    format = (value: number) =>
        endValue > 10 ? value.toLocaleString() : value.toFixed(1),
}: CountUpNumber.Props) {
    const frameDuration = 1_000 / 30;
    const totalFrames = Math.round(animationDuration / frameDuration);
    const easeOutQuad = (t: number) => t * (2 - t);
    const [count, setCount] = useState(startValue);

    useEffect(() => {
        let frame = 0;
        const counter = setInterval(() => {
            frame++;
            const progress = easeOutQuad(frame / totalFrames);
            const currentCount =
                endValue < 100
                    ? endValue * progress
                    : Math.round(endValue * progress);

            if (count !== currentCount) {
                setCount(currentCount);
            }

            if (frame === totalFrames) {
                clearInterval(counter);
                setCount(endValue);
            }
        }, frameDuration);
    }, []);

    return <>{format(count)}</>;
}
