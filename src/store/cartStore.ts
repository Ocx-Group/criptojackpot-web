import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartStore, CartItem } from '@/interfaces/cart';

// Tiempo de expiración de reservas: 5 minutos
const RESERVATION_TIMEOUT_MS = 5 * 60 * 1000;

/**
 * Genera un UUID simple para identificar items del carrito
 */
const generateId = (): string => {
  return `cart-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      items: [],
      isOpen: false,
      reservationTimeoutMs: RESERVATION_TIMEOUT_MS,

      // Agregar item al carrito
      addItem: itemData => {
        const id = generateId();
        const now = Date.now();

        const newItem: CartItem = {
          ...itemData,
          id,
          addedAt: now,
          expiresAt: now + RESERVATION_TIMEOUT_MS,
          isReserved: false,
        };

        set(state => ({
          items: [...state.items, newItem],
        }));

        return id;
      },

      // Remover item del carrito
      removeItem: itemId => {
        set(state => ({
          items: state.items.filter(item => item.id !== itemId),
        }));
      },

      // Actualizar números de un item
      updateItemNumbers: (itemId, numbers) => {
        set(state => ({
          items: state.items.map(item => (item.id === itemId ? { ...item, numbers } : item)),
        }));
      },

      // Limpiar carrito completo
      clearCart: () => {
        set({ items: [] });
      },

      // Limpiar items expirados
      clearExpiredItems: () => {
        const now = Date.now();
        set(state => ({
          items: state.items.filter(item => item.expiresAt > now),
        }));
      },

      // Marcar item como reservado (después de llamar al hub)
      markAsReserved: (itemId, reservationIds) => {
        set(state => ({
          items: state.items.map(item => (item.id === itemId ? { ...item, isReserved: true, reservationIds } : item)),
        }));
      },

      // Abrir/cerrar sidebar del carrito
      setIsOpen: isOpen => {
        set({ isOpen });
      },

      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }));
      },

      // Obtener items por lotería
      getItemsByLottery: lotteryId => {
        return get().items.filter(item => item.lotteryId === lotteryId);
      },

      // Obtener total de items (suma de todas las cantidades)
      getTotalItems: () => {
        return get().items.reduce((total, item) => {
          const itemTotal = item.numbers.reduce((sum, n) => sum + n.quantity, 0);
          return total + itemTotal;
        }, 0);
      },

      // Obtener precio total
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const itemTotal = item.numbers.reduce((sum, n) => sum + n.quantity, 0);
          return total + itemTotal * item.ticketPrice;
        }, 0);
      },

      // Obtener tiempo restante en segundos
      getTimeRemaining: itemId => {
        const item = get().items.find(i => i.id === itemId);
        if (!item) return 0;

        const remaining = Math.max(0, item.expiresAt - Date.now());
        return Math.floor(remaining / 1000);
      },

      // Verificar si un item expiró
      isItemExpired: itemId => {
        const item = get().items.find(i => i.id === itemId);
        if (!item) return true;

        return Date.now() >= item.expiresAt;
      },
    }),
    {
      name: 'cart-storage',
      partialize: state => ({
        items: state.items,
      }),
      // Al rehidratar, limpiar items expirados
      onRehydrateStorage: () => state => {
        if (state) {
          const now = Date.now();
          state.items = state.items.filter(item => item.expiresAt > now);
        }
      },
    }
  )
);
