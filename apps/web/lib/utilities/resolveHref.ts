import { useWebUrl } from '#/hooks/useEnv';

/** Resolve a path to a full URL. */
export function resolveHref(path: string, baseUrl = useWebUrl()) {
    return path.startsWith('http') ? path : new URL(path, baseUrl).toString();
}
