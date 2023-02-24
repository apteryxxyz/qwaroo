export function resizeMain() {
    const headerHeight = document.querySelector('header')?.clientHeight;
    const footerHeight = document.querySelector('footer')?.clientHeight;
    const mainElement = document.querySelector('main');

    if (mainElement && headerHeight && footerHeight) {
        mainElement.style.marginTop = `${headerHeight}px`;
        mainElement.style.minHeight = `calc(100vh - ${headerHeight}px - ${footerHeight}px)`;
    }
}
