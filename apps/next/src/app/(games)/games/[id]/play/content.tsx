'use client';

import type { Game } from '@qwaroo/database';
import type { Source } from '@qwaroo/sources';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/button';
import { CountUp } from '@/components/count-up';
import { ItemBlock } from '@/features/item-block';
import { useMaximise } from '@/hooks/use-maximise';
import { trpc } from '@/services/trpc';
import { cn } from '@/utilities/styling';

interface ContentProps {
  game: Game.Entity;
  state: {
    ref: string;
    items: readonly [Source.Item, ...Source.PartialItem[]];
  };
  highScore?: number;
}

export default function Content(p: ContentProps) {
  const router = useRouter();
  const makeGuess = trpc.play.makeGuess.useMutation();
  const [maximise, minimise] = useMaximise();

  const [status, setStatus] = useState(Status.Preparing);
  const [guessStatus, setGuessStatus] = useState(GuessStatus.Neutral);

  const [previousItem, setPreviousItem] = useState(p.state.items[0]);
  const [currentItem, setCurrentItem] = useState(p.state.items[1]);
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [nextItems, setNextItems] = //
    useState<Source.PartialItem[]>(p.state.items.slice(2));

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<number>(p.highScore ?? 0);

  useEffect(() => {
    // Hide the header and remove page padding, aka maximise the screen
    maximise();
    setStatus(Status.Waiting);
    // Minimise the screen again when the component unmounts
    return () => minimise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const makeGuessHandler = useCallback(
    async (direction: 1 | -1) => {
      setStatus(Status.Pending);
      const result = await makeGuess.mutateAsync({
        ref: p.state.ref,
        direction,
      });

      setCurrentValue(result.currentValue);
      setStatus(Status.Counting);
      await new Promise((r) => setTimeout(r, 1000));
      setGuessStatus(
        result.isCorrect ? GuessStatus.Correct : GuessStatus.Wrong,
      );
      await new Promise((r) => setTimeout(r, 1000));

      if (result.isCorrect) {
        const newScore = score + 1;
        setScore(newScore);
        if (highScore && newScore > highScore) setHighScore(newScore);
        setGuessStatus(GuessStatus.Neutral);

        setStatus(Status.Sliding);
        await new Promise((r) => setTimeout(r, 1000));

        setPreviousItem({ value: result.currentValue, ...currentItem });
        setCurrentItem(nextItems[0]);
        setNextItems([...nextItems.slice(1), ...result.nextItems!]);
        setCurrentValue(null);

        setStatus(Status.Waiting);
      } else {
        setStatus(Status.Ended);
      }
    },
    [currentItem, highScore, makeGuess, nextItems, p.state.ref, score],
  );

  if (status === Status.Ended) {
    minimise();

    let text;
    if (score <= 5) text = 'You can do better, I believe in you!';
    else if (score <= 10) text = 'Not bad, not bad at all.';
    else if (score <= 15) text = 'Wow, you are good at this!';
    else text = 'You are a master, well done!';

    return (
      <div className="mt-[30vh] flex flex-col items-center justify-center gap-6">
        <h2 className="text-7xl font-bold">{score}</h2>
        <p className="text-xl">{text}</p>

        <div className="flex gap-4">
          <Button onClick={() => router.refresh()}>Play Again</Button>
          <Link href="/games">
            <Button>Browse Games</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          'fixed flex h-[150vh] w-screen flex-col overflow-hidden text-white xl:h-screen xl:w-[150vw] xl:flex-row',
          status === Status.Sliding &&
            '-translate-y-1/3 translate-x-0 transition-transform duration-1000 ease-in-out xl:-translate-x-1/3 xl:translate-y-0',
        )}
      >
        <ItemBlock {...p.game} {...previousItem} />

        <ItemBlock
          {...p.game}
          {...currentItem}
          value={currentValue ? <CountUp endValue={currentValue} /> : null}
          onHigherClick={() => makeGuessHandler(1)}
          onLowerClick={() => makeGuessHandler(-1)}
        />

        <ItemBlock
          {...p.game}
          {...nextItems[0]}
          onHigherClick={() => void 0}
          onLowerClick={() => void 0}
        />
      </div>

      <div className="pointer-events-none relative h-screen w-screen select-none">
        <motion.div
          className="absolute left-[calc(50vw_-_24px)] top-[calc(50vh_-_24px)] flex h-12 w-12 items-center justify-center rounded-full bg-white xl:left-[calc(50vw_-_32px)] xl:top-[calc(70vh_-_32px)] xl:h-16 xl:w-16"
          animate={{
            backgroundColor:
              guessStatus === GuessStatus.Correct
                ? '#34D399'
                : guessStatus === GuessStatus.Wrong
                ? '#EF4444'
                : '#15181c',
          }}
        >
          <span className="text-2xl font-bold text-white lg:text-3xl">
            {guessStatus === GuessStatus.Correct && '✓'}
            {guessStatus === GuessStatus.Wrong && '✗'}
            {guessStatus === GuessStatus.Neutral && 'VS'}
          </span>
        </motion.div>

        <div className="flex-end absolute right-5 top-5 flex flex-col text-2xl">
          <p>
            Score <span className="font-bold">{score}</span>
          </p>
          {highScore > 0 && (
            <p>
              High Score <span className="font-bold">{highScore}</span>
            </p>
          )}
        </div>

        {/* <span>
          Score <span className="font-bold">{score}</span>
          <br />
          High Score <span className="font-bold">{highScore}</span>
        </span> */}
      </div>
    </>
  );
}

export enum Status {
  /** Game is currently loading, not ready to be played. */
  Preparing,
  /** Waiting for the user to pick a direction. */
  Waiting,
  /** User has picked, waiting for value from server. */
  Pending,
  /** Received value, animating for suspense. */
  Counting,
  /** The page is currently animating in the next item. */
  Sliding,
  /** The game has ended. */
  Ended,
}

export enum GuessStatus {
  Correct,
  Wrong,
  Neutral,
}
