import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/interfaces/cart';

/**
 * Métodos de pago disponibles
 */
export type PaymentMethod = 'card' | 'crypto' | 'paypal' | 'bank_transfer';

/**
 * Estado del proceso de checkout
 */
export type CheckoutStatus = 'pending' | 'processing' | 'success' | 'error' | 'expired';

/**
 * Item del checkout (heredado del carrito)
 */
export interface CheckoutItem extends CartItem {
  orderId?: string; // ID de la orden del backend
}

/**
 * Estado del checkout
 */
export interface CheckoutState {
  items: CheckoutItem[];
  expiresAt: number | null; // Timestamp de expiración más cercano
  selectedPaymentMethod: PaymentMethod | null;
  status: CheckoutStatus;
  orderId: string | null;
  totalAmount: number;
  isProcessing: boolean;
  error: string | null;
}

/**
 * Acciones del checkout
 */
export interface CheckoutActions {
  // Inicializar checkout desde el carrito
  initFromCart: (items: CartItem[], orderId?: string) => void;

  // Seleccionar método de pago
  setPaymentMethod: (method: PaymentMethod) => void;

  // Estados del proceso
  setStatus: (status: CheckoutStatus) => void;
  setProcessing: (isProcessing: boolean) => void;
  setError: (error: string | null) => void;

  // Limpiar checkout
  clearCheckout: () => void;

  // Calcular tiempo restante (en segundos)
  getTimeRemaining: () => number;

  // Verificar si expiró
  isExpired: () => boolean;

  // Obtener cantidad total de tickets
  getTotalTickets: () => number;
}

export type CheckoutStore = CheckoutState & CheckoutActions;

const initialState: CheckoutState = {
  items: [],
  expiresAt: null,
  selectedPaymentMethod: null,
  status: 'pending',
  orderId: null,
  totalAmount: 0,
  isProcessing: false,
  error: null,
};

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      initFromCart: (cartItems, orderId) => {
        if (cartItems.length === 0) return;

        // Encontrar la fecha de expiración más cercana
        const minExpiration = Math.min(...cartItems.map(item => item.expiresAt));

        // Calcular el total
        const total = cartItems.reduce((acc, item) => {
          const itemTotal = item.numbers.reduce((sum, n) => sum + n.quantity, 0);
          return acc + itemTotal * item.ticketPrice;
        }, 0);

        set({
          items: cartItems.map(item => ({ ...item, orderId })),
          expiresAt: minExpiration,
          orderId: orderId || null,
          totalAmount: total,
          status: 'pending',
          error: null,
          isProcessing: false,
        });
      },

      setPaymentMethod: method => {
        set({ selectedPaymentMethod: method, error: null });
      },

      setStatus: status => {
        set({ status });
      },

      setProcessing: isProcessing => {
        set({ isProcessing });
      },

      setError: error => {
        set({ error, isProcessing: false });
      },

      clearCheckout: () => {
        set(initialState);
      },

      getTimeRemaining: () => {
        const { expiresAt } = get();
        if (!expiresAt) return 0;

        const remaining = Math.max(0, expiresAt - Date.now());
        return Math.floor(remaining / 1000);
      },

      isExpired: () => {
        const { expiresAt } = get();
        if (!expiresAt) return true;

        return Date.now() >= expiresAt;
      },

      getTotalTickets: () => {
        return get().items.reduce((total, item) => {
          const itemTotal = item.numbers.reduce((sum, n) => sum + n.quantity, 0);
          return total + itemTotal;
        }, 0);
      },
    }),
    {
      name: 'checkout-storage',
      partialize: state => ({
        items: state.items,
        expiresAt: state.expiresAt,
        selectedPaymentMethod: state.selectedPaymentMethod,
        orderId: state.orderId,
        totalAmount: state.totalAmount,
        status: state.status,
      }),
      // Al rehidratar, verificar si ya expiró
      onRehydrateStorage: () => state => {
        if (state) {
          if (state.expiresAt && Date.now() >= state.expiresAt) {
            // Si expiró, limpiar el checkout
            state.items = [];
            state.expiresAt = null;
            state.status = 'expired';
          }
        }
      },
    }
  )
);
