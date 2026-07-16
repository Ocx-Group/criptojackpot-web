export enum NumberStatus {
  Available = 0,
  Reserved = 1,
  Sold = 2,
}

export interface AvailableNumberDto {
  number: number;
  /** Número con ceros a la izquierda tal como se generó en BD (ej. "0007"). */
  displayNumber?: string;
  availableSeries: number;
  totalSeries: number;
  isFullyAvailable: boolean;
  isExhausted: boolean;
}

export interface NumberReservationDto {
  numberId: number;
  lotteryNumberGuid: string;
  lotteryGuid: string;
  number: number;
  /** Número con ceros a la izquierda tal como se generó en BD (ej. "0007"). */
  displayNumber?: string;
  series: number;
  reservationExpiresAt: string;
  secondsRemaining: number;
}

export interface NumberStatusDto {
  numberId: number;
  lotteryNumberGuid: string;
  number: number;
  /** Número con ceros a la izquierda tal como se generó en BD (ej. "0007"). */
  displayNumber?: string;
  series: number;
  status: NumberStatus;
}

export interface ReservationWithOrderDto {
  orderId: string;
  lotteryGuid: string;
  totalAmount: number;
  ticketPrice: number;
  expiresAt: string;
  secondsRemaining: number;
  reservations: NumberReservationDto[];
  addedToExistingOrder: boolean;
}

export interface CartItemDto {
  number: number;
  quantity: number;
}
