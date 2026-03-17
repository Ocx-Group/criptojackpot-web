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
  series: number;
  prizeName?: string;
  prizeEstimatedValue?: number;
  prizeImageUrl?: string;
}
