export interface OrderDetailDto {
  id: number;
  number: number;
  /** Número con ceros a la izquierda tal como se generó en BD (ej. "0007"). Null solo en filas legacy. */
  displayNumber?: string | null;
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
  userGuid: string;
  userEmail: string;
  userName: string;
  lotteryId: string;
  lotteryTitle: string;
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
