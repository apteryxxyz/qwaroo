import { useWebUrl } from '#/hooks/useEnv';

export function setBackTo(url?: string) {
    const errors = document.querySelector('div[id^="error-"]');
    if (!url && errors) return;

    const backTo = url ?? window.location.href;
    const backPath = new URL(backTo, useWebUrl()).pathname;
    if (backPath.startsWith('/auth/callback')) return;

    localStorage.setItem('qwaroo.back_to', backPath);
}

export function getBackTo() {
    return localStorage.getItem('qwaroo.back_to') ?? '/';
}
