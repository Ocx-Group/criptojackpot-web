import { LotteryType } from '@/interfaces/lottery';

/**
 * Returns the number of digits for formatting based on lottery type and range.
 * Pick3 is always 3 digits; other types derive digits from the lottery's max
 * number (e.g. maxNumber 9999 → 4 digits, legacy maxNumber 99 → 2 digits).
 */
export const getLotteryNumberDigits = (type?: LotteryType, maxNumber?: number): number => {
  if (type === LotteryType.Pick3) return 3;
  return Math.max(2, String(maxNumber ?? 99).length);
};

/**
 * Formats a lottery number based on the lottery type and range.
 * Pick3 numbers are displayed as 3-digit strings (e.g., 7 → "007").
 * Other types pad according to the lottery's max number (e.g., 12 → "0012" for a 0-9999 raffle).
 */
export const formatLotteryNumber = (number: number, type?: LotteryType, maxNumber?: number): string => {
  return number.toString().padStart(getLotteryNumberDigits(type, maxNumber), '0');
};
