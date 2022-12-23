export function setBackTo(url?: string) {
    const errors = document.querySelector('div[id^="error-"]');
    if (!url && errors) return;

    const backTo = url ?? window.location.href;
    const backPath = new URL(backTo).pathname;
    localStorage.setItem('owenii.back_to', backPath);
}

export function getBackTo() {
    return localStorage.getItem('owenii.back_to') ?? '/';
}
