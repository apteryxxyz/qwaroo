/* eslint-disable import/newline-after-import */

import { type ClassValue, clsx } from 'clsx';
import createTransformer from 'tailwind-group-variant';
import { twMerge } from 'tailwind-merge';
const groupVariants = createTransformer();

/** Only used for use inside Shadcn/UI components. */
export function cn(...className: ClassValue[]) {
    return twMerge(clsx(className));
}

/**
 * A wrapper around Tailwind classes that allows for
 * grouping variants, and merging classes.
 */
export function tw(...className: (string | undefined)[]) {
    return twMerge(groupVariants(className.flat().join(' ')));
}
