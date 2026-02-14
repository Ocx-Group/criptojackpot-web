import { useEffect, useCallback, useRef } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useLotteryHub } from '@/hooks/lottery-hub';

interface UseCartReservationOptions {
  lotteryId: string;
  onReservationSuccess?: (itemId: string) => void;
  onReservationError?: (itemId: string, error: string) => void;
  onItemExpired?: (itemId: string) => void;
}

interface UseCartReservationReturn {
  reserveCartItem: (itemId: string) => Promise<void>;
  isConnected: boolean;
  hubError: string | null;
  clearHubError: () => void;
}

/**
 * Hook para manejar reservas de items del carrito vía SignalR
 * Conecta el carrito con el LotteryHub para hacer reservas en tiempo real
 */
export const useCartReservation = ({
  lotteryId,
  onReservationSuccess,
  onReservationError,
  onItemExpired,
}: UseCartReservationOptions): UseCartReservationReturn => {
  const { items, markAsReserved, removeItem, isItemExpired } = useCartStore();

  // Conexión al hub de lotería (auth via HttpOnly cookies)
  const {
    isConnected,
    error: hubError,
    reserveNumbersWithOrder,
    clearError,
    reservations,
  } = useLotteryHub(lotteryId);

  // Referencia para tracking de reservas pendientes
  const pendingReservationsRef = useRef<Map<string, string>>(new Map());

  // Manejar confirmaciones de reserva del hub
  useEffect(() => {
    if (reservations.length > 0) {
      // Buscar si hay un item pendiente para esta reserva
      pendingReservationsRef.current.forEach((itemId, _key) => {
        const item = items.find(i => i.id === itemId && !i.isReserved);
        if (item) {
          // Extraer IDs de reservas (convertir a string para compatibilidad)
          const reservationIds = reservations.filter(r => r.lotteryGuid === lotteryId).map(r => r.lotteryNumberGuid);

          if (reservationIds.length > 0) {
            markAsReserved(itemId, reservationIds);
            pendingReservationsRef.current.delete(itemId);
            onReservationSuccess?.(itemId);
          }
        }
      });
    }
  }, [reservations, items, lotteryId, markAsReserved, onReservationSuccess]);

  // Timer para verificar expiración de items
  useEffect(() => {
    const intervalId = setInterval(() => {
      items
        .filter(item => item.lotteryId === lotteryId)
        .forEach(item => {
          if (isItemExpired(item.id)) {
            onItemExpired?.(item.id);
            removeItem(item.id);
          }
        });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [items, lotteryId, isItemExpired, removeItem, onItemExpired]);

  // Reservar un item del carrito
  const reserveCartItem = useCallback(
    async (itemId: string) => {
      const item = items.find(i => i.id === itemId);

      if (!item) {
        onReservationError?.(itemId, 'Item no encontrado en el carrito');
        return;
      }

      if (item.isReserved) {
        console.log('Item ya está reservado:', itemId);
        return;
      }

      if (!isConnected) {
        onReservationError?.(itemId, 'No hay conexión con el servidor');
        return;
      }

      try {
        // Marcar como pendiente
        pendingReservationsRef.current.set(itemId, itemId);

        // Enviar todos los números del item en una sola transacción
        const numbersToReserve = item.numbers.map(numData => ({
          number: numData.number,
          quantity: numData.quantity,
        }));

        await reserveNumbersWithOrder(numbersToReserve);

        console.log('✅ Reservas enviadas para item:', itemId);
      } catch (error) {
        pendingReservationsRef.current.delete(itemId);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        onReservationError?.(itemId, errorMessage);
      }
    },
    [items, isConnected, reserveNumbersWithOrder, onReservationError]
  );

  return {
    reserveCartItem,
    isConnected,
    hubError,
    clearHubError: clearError,
  };
};

/**
 * Hook simple para obtener el tiempo restante de un item del carrito
 */
export const useCartItemTimer = (itemId: string) => {
  const getTimeRemaining = useCartStore(state => state.getTimeRemaining);
  const isItemExpired = useCartStore(state => state.isItemExpired);

  const getFormattedTime = useCallback(() => {
    const seconds = getTimeRemaining(itemId);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, [itemId, getTimeRemaining]);

  return {
    getTimeRemaining: () => getTimeRemaining(itemId),
    getFormattedTime,
    isExpired: () => isItemExpired(itemId),
  };
};
