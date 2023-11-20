import { useLocalStorage } from '@mantine/hooks';
import { useCallback } from 'react';

export interface StatisticsState {
  highScore: number;
  playCount: number;
  timePlayedInMs: number;
  totalScore: number;
}

/**
 * Returns **any** game's statistics state and a function to update it.
 * @param slug The game's slug.
 */
export function useStatistics(slug: string) {
  const [state, setState] = useLocalStorage<StatisticsState>({
    key: `qwaroo.${slug}.statistics`,
    defaultValue: {
      highScore: 0,
      playCount: 0,
      timePlayedInMs: 0,
      totalScore: 0,
    },
  });

  // The setter function returned by useLocalStorage does not merge the
  // previous state with the new state, so we have to do it ourselves
  const setStatistics = useCallback(
    (
      value:
        | Partial<StatisticsState>
        | ((value: StatisticsState) => Partial<StatisticsState>),
    ) =>
      setState((prevState) => ({
        ...prevState,
        ...(typeof value === 'function' ? value(prevState) : value),
      })),
    [setState],
  );

  return [state, setStatistics] as const;
}
