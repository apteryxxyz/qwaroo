import { useEffect, useState } from 'react';

export function CountUpString({
    endValue,
    animationDuration = 1_000,
}: CountUpString.Props) {
    const frameDuration = 1_000 / 30;
    const totalFrames = Math.round(animationDuration / frameDuration);
    const easeOutQuad = (time: number) => time * (2 - time);
    const stringLength = endValue.length;

    const [string, setString] = useState(
        CountUpString.createRandomString(stringLength)
    );

    useEffect(() => {
        let count = 0;
        let frame = 0;
        const counter = setInterval(() => {
            frame++;
            const progress = easeOutQuad(frame / totalFrames);
            const currentCount = Math.round(1_000 * progress);

            if (count !== currentCount) {
                count = currentCount;
                setString(CountUpString.createRandomString(stringLength));
            }

            if (frame === totalFrames) {
                clearInterval(counter);
                setString(endValue);
            }
        }, frameDuration);
    }, []);

    return <>{string}</>;
}

export namespace CountUpString {
    export interface Props {
        endValue: string;
        animationDuration?: number;
    }

    export function createRandomString(length: number) {
        let result = '';
        const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            );
        }

        return result;
    }
}
