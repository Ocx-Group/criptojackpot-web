export enum WinnerStatus {
  Announced = 'Announced',
  Claimed = 'Claimed',
  Delivered = 'Delivered',
}

export interface Winner {
  winnerGuid: string;
  lotteryId: string;
  lotteryTitle: string;
  number: number;
  /** Número con ceros a la izquierda tal como se mostró al usuario (ej. "0007"). Null solo en filas legacy. */
  displayNumber?: string | null;
  series: number;
  ticketGuid: string;
  purchaseAmount: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  prizeName?: string;
  prizeEstimatedValue?: number;
  prizeImageUrl?: string;
  status: WinnerStatus;
  wonAt: string;
  createdAt: string;
}

export interface DetermineWinnerRequest {
  lotteryId: string;
  lotteryTitle: string;
  number: number;
  /** Representación con ceros del número ganador (ej. "0007"), calculada con el tipo y rango de la promoción. */
  numberDisplay?: string;
  series: number;
  prizeName?: string;
  prizeEstimatedValue?: number;
  prizeImageUrl?: string;
  lotteryType?: number;
}
