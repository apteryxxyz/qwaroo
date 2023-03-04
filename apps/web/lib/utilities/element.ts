export function resizePageMargin() {
    const navElement = document.querySelector('nav');
    const mainElement = document.querySelector('main');

    if (!navElement || !mainElement) return;

    const navHeight = navElement.clientHeight;
    mainElement.style.marginTop = `${navHeight}px`;
    mainElement.style.minHeight = `calc(100vh - ${navHeight}px)`;
}
