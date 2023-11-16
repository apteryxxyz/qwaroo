'use client';

import { useEffect, useMemo, useState } from 'react';

type CombinationProps = {
  endDisplay?: string | undefined;
  endValue: number;
  animationDuration?: number;
};

export function Combination(p: CombinationProps) {
  const [display, setDisplay] = useState('ㅤ');

  const animationDuration = p.animationDuration ?? 1000;
  const timeBetweenFrames = 1000 / 30;
  const totalFrames = Math.round(animationDuration / timeBetweenFrames);

  const format = useMemo(
    () => getFormatter(p.endValue, p.endDisplay),
    [p.endDisplay, p.endValue],
  );
  const generator = useMemo(
    () => getGenerator(p.endValue, p.endDisplay),
    [p.endDisplay, p.endValue],
  );

  useEffect(() => {
    let frame = 0;

    const counter = setInterval(() => {
      if (++frame === totalFrames) {
        clearInterval(counter);
        setDisplay(format(p.endDisplay ?? p.endValue));
      } else {
        setDisplay(format(generator(frame / totalFrames)));
      }
    }, timeBetweenFrames);

    return () => clearInterval(counter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.endValue, p.endDisplay]);

  return display;
}

function getFormatter(value: number, display?: string) {
  if (display) {
    return (v: unknown) => String(v);
  } else {
    const decimalCount = `${value}`.split('.')[1]?.length ?? 0;
    const decimalPlaces = Math.min(decimalCount, 3);
    return (v: unknown) =>
      Number(v).toLocaleString(undefined, {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      });
  }
}

function getGenerator(value: number, display?: string) {
  if (display) {
    const shouldBe = Array.from(display.split('')) //
      .map((s) => (Number.isNaN(Number(s)) ? 'string' : 'number'));
    const getRandom = (type: 'string' | 'number') =>
      type === 'string'
        ? String.fromCharCode(Math.floor(Math.random() * 26) + 97)
        : Math.floor(Math.random() * 10);
    return () => shouldBe.map(getRandom).join('');
  } else {
    return (progress: number) => value * (progress * (2 - progress));
  }
}
