import {
  AvailableNumberDto,
  CartItemDto,
  NumberReservationDto,
  ReservationWithOrderDto,
} from '@/interfaces/lotteryHub';

export interface LotteryHubState {
  availableNumbers: AvailableNumberDto[];
  reservations: NumberReservationDto[];
  currentOrder: ReservationWithOrderDto | null;
  error: string | null;
  isConnected: boolean;
}

export interface LotteryHubActions {
  reserveNumber: (number: number, quantity?: number) => Promise<void>;
  reserveNumbersWithOrder: (items: CartItemDto[], existingOrderId?: string) => Promise<void>;
  clearError: () => void;
  clearReservations: () => void;
  clearCurrentOrder: () => void;
}

export type LotteryHubReturn = LotteryHubState & LotteryHubActions;
