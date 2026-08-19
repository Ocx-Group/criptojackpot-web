/**
 * SINPE Móvil: transferencia manual a un número de teléfono.
 * No hay confirmación automática, así que el usuario adjunta el comprobante
 * y un admin lo aprueba o rechaza.
 */

/** Debe coincidir con SinpePaymentStatus del backend (serializado como número). */
export enum SinpePaymentStatus {
  PendingReview = 0,
  Approved = 1,
  Rejected = 2,
}

/** Datos de destino que ve el comprador en el checkout. */
export interface SinpeConfig {
  isEnabled: boolean;
  phoneNumber?: string | null;
  holderName?: string | null;
  exchangeRate: number;
  instructions?: string | null;
}

export interface SinpeConfigAdmin extends SinpeConfig {
  updatedByUserId?: number | null;
  updatedAt: string;
}

export interface SinpeUploadUrl {
  uploadUrl: string;
  storageKey: string;
}

export interface SinpePayment {
  sinpePaymentGuid: string;
  orderGuid: string;
  status: SinpePaymentStatus;
  amountUsd: number;
  amountCrc: number;
  exchangeRate: number;
  senderPhone?: string | null;
  referenceNumber?: string | null;
  submittedAt: string;
  reviewedAt?: string | null;
  adminNotes?: string | null;
}

export interface SinpePaymentNumber {
  number: number;
  displayNumber?: string | null;
  series: number;
  subtotal: number;
}

export interface SinpePaymentAdmin extends SinpePayment {
  userId: number;
  userGuid: string;
  userEmail: string;
  userName: string;
  lotteryTitle: string;
  lotteryNo: string;
  /** OrderStatus del backend. 4 = PendingReview (expiración congelada). */
  orderStatus: number;
  /** URL prefirmada de corta duración para ver el comprobante. No persistir. */
  receiptUrl?: string | null;
  numbers: SinpePaymentNumber[];
}

export interface SubmitSinpePaymentPayload {
  storageKey: string;
  contentType: string;
  senderPhone?: string;
  referenceNumber?: string;
}

export interface UpdateSinpeConfigPayload {
  isEnabled: boolean;
  phoneNumber?: string;
  holderName?: string;
  exchangeRate: number;
  instructions?: string;
}
