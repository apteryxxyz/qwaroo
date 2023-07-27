/** Compact a number. */
export function compactNumber(value: number) {
  const formatter = new Intl.NumberFormat(undefined, { notation: 'compact' });
  return formatter.format(value);
}

/** Format a date object. */
export function formatDate(value: Date) {
  const formatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'short' });
  return formatter.format(value);
}
