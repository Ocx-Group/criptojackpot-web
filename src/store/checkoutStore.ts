import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/interfaces/cart';

/**
 * Metodos de pago disponibles
 */
export type PaymentMethod = 'crypto' | 'balance';

/**
 * Estado del proceso de checkout
 */
export type CheckoutStatus = 'pending' | 'processing' | 'success' | 'error';

/**
 * Item del checkout (heredado del carrito)
 */
export interface CheckoutItem extends CartItem {
  orderId?: string; // ID de la orden del backend
}

// Timer de urgencia: 5 minutos (puramente visual, para apurar al usuario)
const URGENCY_TIMER_MS = 5 * 60 * 1000;

/**
 * Estado del checkout
 */
export interface CheckoutState {
  items: CheckoutItem[];
  displayExpiresAt: number | null; // Timer de urgencia visual (5 min), no expira nada
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

  // Seleccionar metodo de pago
  setPaymentMethod: (method: PaymentMethod) => void;

  // Estados del proceso
  setStatus: (status: CheckoutStatus) => void;
  setProcessing: (isProcessing: boolean) => void;
  setError: (error: string | null) => void;

  // Limpiar checkout
  clearCheckout: () => void;

  // Obtener cantidad total de tickets
  getTotalTickets: () => number;
}

export type CheckoutStore = CheckoutState & CheckoutActions;

const initialState: CheckoutState = {
  items: [],
  displayExpiresAt: null,
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

        // Timer de urgencia visual (5 min desde ahora)
        const displayExpiresAt = Date.now() + URGENCY_TIMER_MS;

        // Calcular el total
        const total = cartItems.reduce((acc, item) => {
          const itemTotal = item.numbers.reduce((sum, n) => sum + n.quantity, 0);
          return acc + itemTotal * item.ticketPrice;
        }, 0);

        set({
          items: cartItems.map(item => ({ ...item, orderId })),
          displayExpiresAt,
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
        displayExpiresAt: state.displayExpiresAt,
        selectedPaymentMethod: state.selectedPaymentMethod,
        orderId: state.orderId,
        totalAmount: state.totalAmount,
        status: state.status,
      }),
    }
  )
);
