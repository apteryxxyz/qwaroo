import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Only used for use inside Shadcn/UI components. */
export function cn(...className: ClassValue[]) {
  return twMerge(clsx(className));
}
