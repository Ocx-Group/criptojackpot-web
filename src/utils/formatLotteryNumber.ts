import { LotteryType } from '@/interfaces/lottery';

/**
 * Formats a lottery number based on the lottery type.
 * Pick3 numbers are displayed as 3-digit strings (e.g., 7 → "007").
 * Other types use 2-digit padding (e.g., 7 → "07").
 */
export const formatLotteryNumber = (number: number, type?: LotteryType): string => {
  if (type === LotteryType.Pick3) {
    return number.toString().padStart(3, '0');
  }
  return number.toString().padStart(2, '0');
};

/**
 * Returns the number of digits for formatting based on lottery type.
 */
export const getLotteryNumberDigits = (type?: LotteryType): number => {
  return type === LotteryType.Pick3 ? 3 : 2;
};
