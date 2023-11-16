import { useLocalStorage } from '@mantine/hooks';
import { useCallback } from 'react';

export interface StatisticsState {
  highScore: number;
  playCount: number;
  timePlayedInMs: number;
  totalScore: number;
}

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

export interface SettingsState {
  imageQuality: 'max' | 'reduced';
  imageCropping: 'none' | 'crop' | 'auto';
}

export function useSettings(slug: string) {
  const [state, setState] = useLocalStorage<SettingsState>({
    key: `qwaroo.${slug}.settings`,
    defaultValue: { imageCropping: 'auto', imageQuality: 'reduced' },
  });

  const setSettings = useCallback(
    (
      value:
        | Partial<SettingsState>
        | ((value: SettingsState) => Partial<SettingsState>),
    ) =>
      setState((prevState) => ({
        ...prevState,
        ...(typeof value === 'function' ? value(prevState) : value),
      })),
    [setState],
  );

  return [state, setSettings] as const;
}
