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
  series: number;
  lotteryNumberId?: string;
  isGift: boolean;
  giftSenderId?: number;
  createdAt: string;
}
