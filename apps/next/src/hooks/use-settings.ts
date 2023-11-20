import { useLocalStorage } from '@mantine/hooks';
import { useCallback } from 'react';

export interface HigherOrLowerSettingsState {
  imageQuality: 'max' | 'reduced';
  imageCropping: 'none' | 'crop' | 'auto';
}

/**
 * Returns a **Higher or Lower** game's settings state and a function to update it.
 * @param slug The game's slug.
 */
export function useHigherOrLowerSettings(slug: string) {
  const [state, setState] = useLocalStorage<HigherOrLowerSettingsState>({
    key: `qwaroo.${slug}.settings`,
    defaultValue: { imageCropping: 'auto', imageQuality: 'reduced' },
  });

  // The setter function returned by useLocalStorage does not merge the
  // previous state with the new state, so we have to do it ourselves
  const setSettings = useCallback(
    (
      value:
        | Partial<HigherOrLowerSettingsState>
        | ((
            value: HigherOrLowerSettingsState,
          ) => Partial<HigherOrLowerSettingsState>),
    ) =>
      setState((prevState) => ({
        ...prevState,
        ...(typeof value === 'function' ? value(prevState) : value),
      })),
    [setState],
  );

  return [state, setSettings] as const;
}
