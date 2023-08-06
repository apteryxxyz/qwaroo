export interface MeOptions {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
}

export interface ContextOptions {
  me?: MeOptions;
}

export function createContext(options: ContextOptions = {}) {
  return options;
}
