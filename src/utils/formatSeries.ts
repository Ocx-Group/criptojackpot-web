/**
 * Formats a lottery series number with zero-padding for single digits.
 * Series 0-9 → "00"-"09", series 10+ unchanged.
 */
export const formatSeries = (series: number | string): string =>
  String(series).padStart(2, '0');
