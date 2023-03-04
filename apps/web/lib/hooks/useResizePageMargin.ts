import { useEffect } from 'react';
import { resizePageMargin } from '#/utilities/element';

export function useResizePageMargin() {
    useEffect(() => {
        resizePageMargin();
        window.addEventListener('resize', resizePageMargin);
        return () => window.removeEventListener('resize', resizePageMargin);
    }, []);
}
