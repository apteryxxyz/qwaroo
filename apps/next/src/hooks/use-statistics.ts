import { useLocalStorage } from '@mantine/hooks';
import { useCallback } from 'react';

// ==================== useStatistics ====================

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

// ==================== useAllStatistics ====================

export interface AllStatisticsState {
  list: (StatisticsState & { slug: string })[];
  combined: Omit<StatisticsState, 'highScore'> & {
    averageScore: number;
    averageTimePlayedInMs: number;
  };
}

export function useAllStatistics(slugs: string[]) {
  const list: AllStatisticsState['list'] = [];
  const combined: AllStatisticsState['combined'] = {
    playCount: 0,
    timePlayedInMs: 0,
    totalScore: 0,
    averageScore: 0,
    averageTimePlayedInMs: 0,
  };

  for (const slug of slugs) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [statistics] = useStatistics(slug);
    list.push({ ...statistics, slug });
    combined.playCount += statistics.playCount;
    combined.timePlayedInMs += statistics.timePlayedInMs;
    combined.totalScore += statistics.totalScore;
  }

  combined.averageScore =
    combined.playCount > 0 ? combined.totalScore / combined.playCount : 0;
  combined.averageTimePlayedInMs =
    combined.playCount > 0 ? combined.timePlayedInMs / combined.playCount : 0;

  return { combined, list };
}
