/**
 * Interfaces para el carrito de compras de loterías
 */

import { LotteryTranslation } from './lottery';

export interface CartItemNumber {
  number: number;
  quantity: number; // Cantidad de series para este número
}

export interface CartItem {
  id: string; // UUID único del item en el carrito
  lotteryId: string;
  lotteryName: string;
  lotteryTranslations?: Record<string, LotteryTranslation> | null; // Título traducido por idioma (snapshot)
  lotteryImage?: string;
  lotteryType?: number;
  lotteryMaxNumber?: number; // Para formatear los números con los dígitos correctos (ej. 9999 → 4 dígitos)
  ticketPrice: number;
  numbers: CartItemNumber[];
  addedAt: number; // Timestamp cuando se agregó
  expiresAt: number; // Timestamp cuando expira la reserva (5 min, para display en carrito)
  orderExpiresAt?: number; // Timestamp cuando expira la orden real (30 min, del backend)
  isReserved: boolean; // Si ya se llamó a reserveNumber
  reservationIds?: string[]; // IDs de reservas del backend
  orderId?: string; // ID de la orden creada via WebSocket
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  reservationTimeoutMs: number; // 5 minutos = 300000ms
}

export interface CartActions {
  addItem: (item: Omit<CartItem, 'id' | 'addedAt' | 'expiresAt' | 'isReserved'>) => string;
  removeItem: (itemId: string) => void;
  updateItemNumbers: (itemId: string, numbers: CartItemNumber[]) => void;
  clearCart: () => void;
  clearExpiredItems: () => void;
  markAsReserved: (itemId: string, reservationIds: string[]) => void;
  setIsOpen: (isOpen: boolean) => void;
  toggleCart: () => void;
  getItemsByLottery: (lotteryId: string) => CartItem[];
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getTimeRemaining: (itemId: string) => number; // Segundos restantes
  isItemExpired: (itemId: string) => boolean;
}

export type CartStore = CartState & CartActions;
