/**
 * Formats a pounds-per-person value for display.
 * - > 10 lbs: rounded to the nearest whole pound (avoids distracting decimals on big numbers)
 * - < 10 lbs: shown with up to 3 decimal places (keeps precision on small numbers)
 */
export function formatPoundsPerPerson(value: number): string {
  if (value > 10) {
    return new Intl.NumberFormat().format(Math.round(value));
  }
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(
    value,
  );
}
