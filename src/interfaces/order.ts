export interface OrderDetailDto {
  id: number;
  number: number;
  series: number;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  lotteryNumberId?: string;
  isGift: boolean;
  giftRecipientId?: number;
  ticketId?: string;
}

export interface OrderDto {
  id: number;
  orderGuid: string;
  userId: number;
  lotteryId: string;
  totalAmount: number;
  totalItems: number;
  status: number;
  expiresAt: string;
  secondsRemaining: number;
  items: OrderDetailDto[];
  createdAt: string;
}

export interface PayOrderResponse {
  orderId: string;
  invoiceId: string;
  checkoutUrl: string;
  statusUrl: string;
  qrCodeUrl: string;
  totalAmount: number;
  secondsRemaining: number;
}
