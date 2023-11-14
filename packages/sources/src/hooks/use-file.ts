import {
  mkdir as ensureDirectory,
  readFile,
  writeFile,
} from 'node:fs/promises';
import { dirname } from 'node:path';

export interface FileOptions<T> {
  defaultValue: T;
  serializer?: (data: T) => string;
  deserializer?: (data: string) => T;
}

/** A "hook" for reading and writing to a file. */
export async function useFile<T = string>(
  filePath: string,
  options?: FileOptions<T>,
) {
  const defaultValue = options?.defaultValue ?? ('' as T);
  const serializer = options?.serializer ?? ((s: T) => s as string);
  const deserializer = options?.deserializer ?? ((s: string) => s as T);

  const directoryPath = dirname(filePath);
  await ensureDirectory(directoryPath, { recursive: true });

  let data: T = await readFile(filePath, 'utf8')
    .then(deserializer)
    .catch(() => defaultValue);
  const setData = (newData: T) =>
    writeFile(filePath, serializer((data = newData)), 'utf8') //
      .then(() => newData);
  return [data, setData] as const;
}

/** A "hook" for reading and writing to a JSON file. */
export async function useJsonFile<T>(
  filePath: string,
  options?: FileOptions<T>,
) {
  return useFile<T>(filePath, {
    defaultValue: {} as T,
    serializer: (data) => JSON.stringify(data, null, 2),
    deserializer: (data) => JSON.parse(data) as T,
    ...options,
  });
}
