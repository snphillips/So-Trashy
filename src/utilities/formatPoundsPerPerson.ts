/**
 * Formats a pounds-per-person value for display.
 * - >= 100 lbs: rounded to the nearest whole pound (avoids distracting decimals on big numbers)
 * - < 100 lbs: shown with up to 3 decimal places (keeps precision on small numbers)
 */
export function formatPoundsPerPerson(value: number): string {
  if (value > 100) {
    return new Intl.NumberFormat().format(Math.round(value));
  }
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 3 }).format(
    value,
  );
}
