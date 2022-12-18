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
    animationDuration = 1_000,
    format = (value: number) => value.toLocaleString(),
}: CountUpNumber.Props) {
    const frameDuration = 1_000 / 60;
    const totalFrames = Math.round(animationDuration / frameDuration);
    const easeOutQuad = (t: number) => t * (2 - t);

    const [count, setCount] = useState(startValue);

    useEffect(() => {
        let frame = 0;
        const counter = setInterval(() => {
            frame++;
            const progress = easeOutQuad(frame / totalFrames);
            const currentCount = Math.round(endValue * progress);

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
