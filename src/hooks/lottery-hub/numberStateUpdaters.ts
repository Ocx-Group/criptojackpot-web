import { AvailableNumberDto, NumberStatusDto } from '@/interfaces/lotteryHub';

/**
 * El servidor solo envía los números que NO están completamente disponibles;
 * un número ausente de la lista se considera totalmente disponible. Por eso los
 * updaters insertan (upsert) la entrada cuando no existe, usando totalSeries de
 * la lotería para calcular las series disponibles restantes.
 */
const buildEntry = (number: number, availableSeries: number, totalSeries: number): AvailableNumberDto => ({
  number,
  availableSeries,
  totalSeries,
  isFullyAvailable: availableSeries === totalSeries,
  isExhausted: availableSeries === 0,
});

/**
 * Actualiza el estado de un número cuando se reserva (decrementa availableSeries)
 */
export const updateNumberOnReserve = (
  numbers: AvailableNumberDto[],
  targetNumber: number,
  lotteryTotalSeries: number
): AvailableNumberDto[] => {
  const exists = numbers.some(n => n.number === targetNumber);

  if (!exists) {
    // Número totalmente disponible hasta ahora: crear entrada con una serie menos
    return [...numbers, buildEntry(targetNumber, Math.max(0, lotteryTotalSeries - 1), lotteryTotalSeries)];
  }

  return numbers.map(n => {
    if (n.number !== targetNumber) return n;

    const newAvailable = Math.max(0, n.availableSeries - 1);
    return buildEntry(n.number, newAvailable, n.totalSeries);
  });
};

/**
 * Actualiza el estado de un número cuando se libera (incrementa availableSeries)
 */
export const updateNumberOnRelease = (numbers: AvailableNumberDto[], targetNumber: number): AvailableNumberDto[] => {
  return numbers.map(n => {
    if (n.number !== targetNumber) return n;

    const newAvailable = Math.min(n.totalSeries, n.availableSeries + 1);
    return buildEntry(n.number, newAvailable, n.totalSeries);
  });
};

/**
 * Actualiza el estado de un número cuando se vende (decrementa availableSeries y totalSeries)
 */
export const updateNumberOnSold = (
  numbers: AvailableNumberDto[],
  targetNumber: number,
  lotteryTotalSeries: number
): AvailableNumberDto[] => {
  const exists = numbers.some(n => n.number === targetNumber);

  if (!exists) {
    const newTotal = Math.max(0, lotteryTotalSeries - 1);
    return [...numbers, { ...buildEntry(targetNumber, newTotal, newTotal), isExhausted: newTotal === 0 }];
  }

  return numbers.map(n => {
    if (n.number !== targetNumber) return n;

    const newAvailable = Math.max(0, n.availableSeries - 1);
    const newTotal = Math.max(0, n.totalSeries - 1);
    return buildEntry(n.number, newAvailable, newTotal);
  });
};

/**
 * Actualiza múltiples números cuando se liberan
 */
export const updateNumbersOnBulkRelease = (
  numbers: AvailableNumberDto[],
  releasedNumbers: NumberStatusDto[]
): AvailableNumberDto[] => {
  const updated = [...numbers];

  releasedNumbers.forEach(released => {
    const idx = updated.findIndex(n => n.number === released.number);
    if (idx !== -1) {
      const newAvailable = Math.min(updated[idx].totalSeries, updated[idx].availableSeries + 1);
      updated[idx] = buildEntry(updated[idx].number, newAvailable, updated[idx].totalSeries);
    }
  });

  return updated;
};

/**
 * Actualiza múltiples números cuando se venden
 */
export const updateNumbersOnBulkSold = (
  numbers: AvailableNumberDto[],
  soldNumbers: NumberStatusDto[],
  lotteryTotalSeries: number
): AvailableNumberDto[] => {
  const updated = [...numbers];

  soldNumbers.forEach(sold => {
    const idx = updated.findIndex(n => n.number === sold.number);
    if (idx !== -1) {
      const newAvailable = Math.max(0, updated[idx].availableSeries - 1);
      const newTotal = Math.max(0, updated[idx].totalSeries - 1);
      updated[idx] = buildEntry(updated[idx].number, newAvailable, newTotal);
    } else {
      const newTotal = Math.max(0, lotteryTotalSeries - 1);
      updated.push({ ...buildEntry(sold.number, newTotal, newTotal), isExhausted: newTotal === 0 });
    }
  });

  return updated;
};
