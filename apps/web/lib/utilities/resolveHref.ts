import { useWebUrl } from '#/hooks/useEnv';

export function resolveHref(path: string, baseUrl = useWebUrl()) {
    return path.startsWith('http') ? path : new URL(path, baseUrl).toString();
}
