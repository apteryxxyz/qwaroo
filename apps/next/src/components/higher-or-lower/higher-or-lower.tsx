'use client';

import { decompress, type Compressed } from '@qwaroo/shared/compress';
import type { Game } from '@qwaroo/shared/types';
import ms from 'enhanced-ms';
import { DoorOpenIcon, Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/utilities/styling';
import { Button } from '../ui/button';
import { useStatistics } from './hooks';
import { Combination } from './item-block/combination';
import { ItemBlock } from './item-block/item-block';
import { SettingsButton } from './settings-button';

export function HigherOrLower(p: {
  compressedGame: Compressed<Game.HigherOrLower>;
  compressedItems: Compressed<Game.HigherOrLower.Item[]>;
}) {
  // Decompress the game and items
  const game = useMemo(() => decompress(p.compressedGame), [p.compressedGame]);
  const items = useMemo(
    () => decompress(p.compressedItems),
    [p.compressedItems],
  );

  // State variables
  const hasStarted = useRef(false);
  const [state, setState] = useState(State.Preparing);
  const [guess, setGuess] = useState(Guess.None);
  const [score, setScore] = useState(0);

  // Statistics variables
  const timeStartedAt = useRef<number | null>(null);
  const [statistics, setStatistics] = useStatistics(game.slug);

  // Item variables
  const [pointer, setPointer] = useState(1);
  const [shuffledItems, setShuffledItems] = useState<typeof items>([]);
  const previousItem = useMemo(
    () => shuffledItems.at(pointer - 1)!,
    [pointer, shuffledItems],
  );
  const currentItem = useMemo(
    () => shuffledItems.at(pointer)!,
    [pointer, shuffledItems],
  );
  const nextItem = useMemo(
    () => shuffledItems.at(pointer + 1)!,
    [pointer, shuffledItems],
  );

  const prepareGame = useCallback(() => {
    setState(State.Waiting);
    setScore(0);
    setShuffledItems([...items].sort(() => Math.random() - 0.5));

    timeStartedAt.current = Date.now();
    if (window.gtag) window.gtag('event', 'game_start', { game: game.title });
  }, [items, game.title]);

  const saveStatistics = useCallback(() => {
    if (
      // Statistics are already saved when state is ended
      state === State.Ended ||
      // Don't want to save if the player hasn't made any attempts
      !hasStarted.current
    )
      return;

    setStatistics((prevState) => ({
      highScore: Math.max(prevState.highScore, score),
      totalScore: prevState.totalScore + score,
      playCount: prevState.playCount + 1,
      timePlayedInMs:
        prevState.timePlayedInMs + (Date.now() - timeStartedAt.current!),
    }));

    if (window.gtag)
      window.gtag('event', 'game_end', {
        game: game.title,
        score,
        time: ms(Date.now() - timeStartedAt.current!, { shortFormat: true }),
      });
  }, [game.title, score, setStatistics, state]);

  const makeGuess = useCallback(
    async (direction: 1 | -1) => {
      hasStarted.current = true;
      setState(State.Counting);
      await new Promise((r) => setTimeout(r, 1200));

      const isCorrect =
        direction === 1
          ? previousItem.value <= currentItem.value
          : previousItem.value >= currentItem.value;
      setGuess(isCorrect ? Guess.Correct : Guess.Wrong);
      await new Promise((r) => setTimeout(r, 800));

      if (isCorrect) {
        const newScore = score + 1;
        if (newScore > score) setScore(newScore);
        if (newScore > statistics.highScore)
          setStatistics({ highScore: newScore });

        setGuess(Guess.None);
        setState(State.Sliding);
        await new Promise((r) => setTimeout(r, 1000));

        setPointer(pointer + 1);
        setState(State.Waiting);
      } else {
        await new Promise((r) => setTimeout(r, 500));
        saveStatistics();
        setState(State.Ended);
      }
    },
    [
      currentItem?.value,
      pointer,
      previousItem?.value,
      saveStatistics,
      score,
      setStatistics,
      statistics.highScore,
    ],
  );

  useEffect(() => {
    // Save statistics when the user leaves the page
    window.addEventListener('beforeunload', saveStatistics, { once: true });
    return () => window.removeEventListener('beforeunload', saveStatistics);
  }, [saveStatistics]);

  useEffect(() => {
    prepareGame();
  }, [prepareGame]);

  if (state === State.Preparing) {
    return (
      <div className="mt-[30vh] flex flex-col items-center justify-center gap-6">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  if (state === State.Ended) {
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
          <Button onClick={prepareGame}>Play Again</Button>
          <Button asChild>
            <Link href="/">Browse Games</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-50 bg-background">
      <div
        className={cn(
          'fixed flex h-[150vh] w-screen flex-col overflow-hidden text-white xl:h-screen xl:w-[150vw] xl:flex-row',
          state === State.Sliding &&
            '-translate-y-1/3 translate-x-0 transition-transform duration-1000 ease-in-out xl:-translate-x-1/3 xl:translate-y-0',
        )}
      >
        <ItemBlock
          game={game}
          item={previousItem}
          currentValue={previousItem.value}
          shouldShowValue
        />

        <ItemBlock
          game={game}
          item={currentItem}
          currentValue={
            <Combination
              endValue={currentItem.value}
              endDisplay={currentItem.display}
            />
          }
          shouldShowValue={[
            State.Counting,
            State.Sliding,
            State.Ended,
          ].includes(state)}
          onHigherClick={() => void makeGuess(1)}
          onLowerClick={() => void makeGuess(-1)}
          shouldShowActions={State.Waiting === state}
        />

        <ItemBlock
          game={game}
          item={nextItem}
          onHigherClick={() => void makeGuess(1)}
          onLowerClick={() => void makeGuess(-1)}
          shouldShowActions
        />
      </div>

      <div className="absolute inset-0 pointer-events-none select-none">
        <div
          className="absolute left-[calc(50vw_-_24px)] top-[calc(50vh_-_24px)] flex h-12 w-12 items-center justify-center rounded-full bg-white xl:left-[calc(50vw_-_32px)] xl:top-[calc(70vh_-_32px)] xl:h-16 xl:w-16 transition-colors duration-300"
          style={{
            backgroundColor:
              guess === Guess.Correct
                ? '#34D399'
                : guess === Guess.Wrong
                ? '#EF4444'
                : '#15181C',
          }}
        >
          <span className="text-2xl font-bold text-white lg:text-3xl">
            {guess === Guess.Correct && '✓'}
            {guess === Guess.Wrong && '✗'}
            {guess === Guess.None && 'VS'}
          </span>
        </div>

        <div className="absolute left-4 top-4 space-x-2 pointer-events-auto text-white">
          <SettingsButton slug={game.slug} />
          <Button variant="ghost" className="p-2" asChild>
            <Link href="/">
              <DoorOpenIcon className="hover:cursor-pointer" />
              <span className="sr-only">Exit Game</span>
            </Link>
          </Button>
        </div>

        <div className="absolute right-4 top-4 text-xl text-white [&>*]:text-end">
          <p className="drop-shadow-xl">
            Score <span className="font-bold">{score}</span>
          </p>
          <p className="drop-shadow-xl">
            High Score <span className="font-bold">{statistics.highScore}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/*
export function HigherOrLower(p: {
  compressedGame: Compressed<Game.HigherOrLower>;
  compressedItems: Compressed<Game.HigherOrLower.Item[]>;
}) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const game = useMemo(() => decompress(p.compressedGame), []);
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  const items = useMemo(() => decompress(p.compressedItems), []);

  const [state, setState] = useState(State.Preparing);
  const [guess, setGuess] = useState(Guess.None);
  const timeStartedAt = useRef<number | null>(null);
  const [score, setScore] = useState(0);

  const [statistics, setStatistics] = useStatistics(game.slug);

  const [pointer, setPointer] = useState(1);
  const [shuffledItems, setShuffledItems] = useState<typeof items>([]);
  const previousItem = useMemo(
    () => shuffledItems.at(pointer - 1)!,
    [pointer, shuffledItems],
  );
  const currentItem = useMemo(
    () => shuffledItems.at(pointer)!,
    [pointer, shuffledItems],
  );
  const nextItem = useMemo(
    () => shuffledItems.at(pointer + 1)!,
    [pointer, shuffledItems],
  );

  const prepareGame = useCallback(() => {
    setState(State.Waiting);
    setScore(0);
    timeStartedAt.current = Date.now();
    setShuffledItems([...items].sort(() => Math.random() - 0.5));
  }, [items]);

  const saveStatistics = useCallback(() => {
    setStatistics((prevState) => ({
      highScore: Math.max(prevState.highScore, score),
      totalScore: prevState.totalScore + score,
      playCount: prevState.playCount + 1,
      timePlayedInMs:
        prevState.timePlayedInMs + (Date.now() - timeStartedAt.current!),
    }));
  }, [score, setStatistics]);

  const makeGuess = useCallback(async (direction: 1 | -1) => {
    setState(State.Counting);
    await new Promise((r) => setTimeout(r, 1200));

    const isCorrect =
      direction === 1
        ? previousItem.value <= currentItem.value
        : previousItem.value >= currentItem.value;
    setGuess(isCorrect ? Guess.Correct : Guess.Wrong);
    await new Promise((r) => setTimeout(r, 800));

    if (isCorrect) {
      const newScore = score + 1;
      if (newScore > score) setScore(newScore);
      if (newScore > statistics.highScore)
        setStatistics({ highScore: newScore });

      setGuess(Guess.None);
      setState(State.Sliding);
      await new Promise((r) => setTimeout(r, 1000));

      setPointer(pointer + 1);
      setState(State.Waiting);
    } else {
      saveStatistics();
      await new Promise((r) => setTimeout(r, 500));
      setState(State.Ended);
    }
  }, []);

  useEffect(prepareGame, [items, prepareGame]);

  if (state === State.Preparing) {
    return (
      <div className="mt-[30vh] flex flex-col items-center justify-center gap-6">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  if (state === State.Ended) {
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
          <Button onClick={prepareGame}>Play Again</Button>
          <Button asChild>
            <Link href="/">Browse Games</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-50 bg-background">
      <div
        className={cn(
          'fixed flex h-[150vh] w-screen flex-col overflow-hidden text-white xl:h-screen xl:w-[150vw] xl:flex-row',
          state === State.Sliding &&
            '-translate-y-1/3 translate-x-0 transition-transform duration-1000 ease-in-out xl:-translate-x-1/3 xl:translate-y-0',
        )}
      >
        <ItemBlock
          game={game}
          item={previousItem}
          currentValue={previousItem.value}
          shouldShowValue
        />

        <ItemBlock
          game={game}
          item={currentItem}
          currentValue={
            <Combination
              endValue={currentItem.value}
              endDisplay={currentItem.display}
            />
          }
          shouldShowValue={[
            State.Counting,
            State.Sliding,
            State.Ended,
          ].includes(state)}
          onHigherClick={() => void makeGuess(1)}
          onLowerClick={() => void makeGuess(-1)}
          shouldShowActions={State.Waiting === state}
        />

        <ItemBlock
          game={game}
          item={nextItem}
          onHigherClick={() => void makeGuess(1)}
          onLowerClick={() => void makeGuess(-1)}
          shouldShowActions
        />
      </div>

      <div className="absolute inset-0 pointer-events-none select-none">
        <div
          className="absolute left-[calc(50vw_-_24px)] top-[calc(50vh_-_24px)] flex h-12 w-12 items-center justify-center rounded-full bg-white xl:left-[calc(50vw_-_32px)] xl:top-[calc(70vh_-_32px)] xl:h-16 xl:w-16 transition-colors duration-300"
          style={{
            backgroundColor:
              guess === Guess.Correct
                ? '#34D399'
                : guess === Guess.Wrong
                ? '#EF4444'
                : '#15181C',
          }}
        >
          <span className="text-2xl font-bold text-white lg:text-3xl">
            {guess === Guess.Correct && '✓'}
            {guess === Guess.Wrong && '✗'}
            {guess === Guess.None && 'VS'}
          </span>
        </div>

        <div className="absolute left-4 top-4 space-x-2 pointer-events-auto text-white">
          <SettingsButton slug={game.slug} />
          <Button variant="ghost" className="p-2" asChild>
            <Link href="/">
              <DoorOpenIcon className="hover:cursor-pointer" />
              <span className="sr-only">Exit Game</span>
            </Link>
          </Button>
        </div>

        <div className="absolute right-4 top-4 text-xl text-white [&>*]:text-end">
          <p className="drop-shadow-xl">
            Score <span className="font-bold">{score}</span>
          </p>
          <p className="drop-shadow-xl">
            High Score <span className="font-bold">{highScore}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
*/

enum State {
  Preparing,
  Waiting,
  Counting,
  Sliding,
  Ended,
}

enum Guess {
  Correct,
  Wrong,
  None,
}
