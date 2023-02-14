/** Hide the header, footer and remove border spacing. */
export function goFullscreen() {
    const toHide = document.querySelectorAll<HTMLElement>('header, footer');
    for (const el of Array.from(toHide)) el.style.display = 'none';

    const toExpand = document.querySelector('main');
    if (toExpand) {
        toExpand.classList.remove('max-w-8xl', 'p-3');
        toExpand.style.marginTop = '0';
        toExpand.style.minHeight = '100vh';
    }

    document.body.style.overflow = 'hidden';
}

/** Show the header, footer and reset the border spacing. */
export function goMinimised() {
    const toShow = document.querySelectorAll<HTMLElement>('header, footer');
    for (const el of Array.from(toShow)) el.style.display = 'block';

    const toContract = document.querySelector('main');
    if (toContract) {
        toContract.classList.add('max-w-8xl', 'p-3');
        repairMainHeight();
    }

    document.body.style.overflow = 'auto';
}

export function repairMainHeight() {
    const headerHeight = document.querySelector('header')?.clientHeight;
    const footerHeight = document.querySelector('footer')?.clientHeight;
    const mainElement = document.querySelector('main');

    if (mainElement && headerHeight && footerHeight) {
        mainElement.style.marginTop = `${headerHeight}px`;
        mainElement.style.minHeight = `calc(100vh - ${headerHeight}px - ${footerHeight}px)`;
    }
}
