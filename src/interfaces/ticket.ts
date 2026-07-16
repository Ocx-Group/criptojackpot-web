export enum TicketStatus {
  Active = 0,
  Won = 1,
  Lost = 2,
  Refunded = 3,
}

export interface Ticket {
  id: number;
  ticketGuid: string;
  orderDetailId: number;
  lotteryId: string;
  userId: number;
  purchaseAmount: number;
  purchaseDate: string;
  status: TicketStatus;
  transactionId: string;
  number: number;
  /** Número con ceros a la izquierda tal como se generó en BD (ej. "0007"). Null solo en filas legacy. */
  displayNumber?: string | null;
  series: number;
  lotteryNumberId?: string;
  isGift: boolean;
  giftSenderId?: number;
  createdAt: string;
}
