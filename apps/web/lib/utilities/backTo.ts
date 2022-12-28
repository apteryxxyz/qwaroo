import { useWebUrl } from '#/hooks/useEnv';

export function setBackTo(url?: string) {
    const error = document.querySelector('div[id^="error-"]');
    if (!url && error) return;

    const backTo = url ?? window.location.href;
    const backPath = new URL(backTo, useWebUrl()).pathname;
    if (backPath.startsWith('/auth/callback')) return;

    localStorage.setItem('qwaroo.back_to', backPath);
}

export function getBackTo() {
    return localStorage.getItem('qwaroo.back_to') ?? '/';
}
