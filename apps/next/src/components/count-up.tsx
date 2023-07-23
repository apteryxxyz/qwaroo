import { useEffect, useState } from 'react';

interface CountUpProps {
  startValue?: number;
  endValue: number;
  animationDuration?: number;
}

export function CountUp(p: CountUpProps) {
  const frameDuration = p.animationDuration ?? 1000 / 30;
  const totalFrames = Math.round(p.animationDuration ?? 1000 / frameDuration);
  const easeOutQuad = (t: number) => t * (2 - t);
  const [count, setCount] = useState(p.startValue ?? 0);

  const decimalCount = p.endValue.toString().split('.')[1]?.length ?? 0;
  const decimalPlaces = Math.min(decimalCount, 3);
  const formatter = (n: number) =>
    n.toLocaleString(undefined, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    });

  useEffect(() => {
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = easeOutQuad(frame / totalFrames);
      const currentCount = p.endValue * progress;

      if (count !== currentCount) {
        setCount(currentCount);
      }

      if (frame === totalFrames) {
        clearInterval(counter);
        setCount(p.endValue);
      }
    }, frameDuration);

    return () => clearInterval(counter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{formatter(count)}</>;
}
