/* eslint-disable import/newline-after-import */

import { type ClassValue, clsx } from 'clsx';
import createTransformer from 'tailwind-group-variant';
import { twMerge } from 'tailwind-merge';
const groupVariants = createTransformer();

export function cn(...className: ClassValue[]) {
    return twMerge(clsx(className));
}

export function tw(...className: (string | undefined)[]) {
    return twMerge(groupVariants(className.flat().join(' ')));
}
