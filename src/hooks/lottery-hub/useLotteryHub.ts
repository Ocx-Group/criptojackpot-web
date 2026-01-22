import { useEffect, useState, useCallback, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import {
  AvailableNumberDto,
  CartItemDto,
  NumberReservationDto,
  ReservationWithOrderDto,
} from '@/interfaces/lotteryHub';
import { createHubConnection, startConnection, stopConnection } from './connectionFactory';
import { registerHubEventHandlers, unregisterHubEventHandlers } from './hubEventHandlers';
import type { LotteryHubReturn } from './types';

export const useLotteryHub = (lotteryId: string, token: string): LotteryHubReturn => {
  const [availableNumbers, setAvailableNumbers] = useState<AvailableNumberDto[]>([]);
  const [reservations, setReservations] = useState<NumberReservationDto[]>([]);
  const [currentOrder, setCurrentOrder] = useState<ReservationWithOrderDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Refs para evitar conexiones duplicadas
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const isConnectingRef = useRef(false);
  const isMountedRef = useRef(false);

  useEffect(() => {
    // Marcar como montado
    isMountedRef.current = true;

    // No conectar si no hay token o lotteryId
    if (!token || !lotteryId) {
      console.log('⚠️ LotteryHub: No hay token o lotteryId, omitiendo conexión');
      return;
    }

    // Evitar conexiones duplicadas
    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      console.log('✅ LotteryHub: Ya conectado, omitiendo reconexión');
      return;
    }

    if (isConnectingRef.current) {
      console.log('⏳ LotteryHub: Conexión en progreso, omitiendo');
      return;
    }

    // Limpiar conexión anterior si existe (sabemos que no está Connected por el early return anterior)
    if (connectionRef.current) {
      console.log('🔄 LotteryHub: Limpiando conexión anterior con estado:', connectionRef.current.state);
      unregisterHubEventHandlers(connectionRef.current);
      connectionRef.current = null;
    }

    const connection = createHubConnection(token);
    connectionRef.current = connection;

    // Registrar event handlers
    registerHubEventHandlers(connection, {
      setAvailableNumbers,
      setReservations,
      setError,
      setIsConnected,
      setCurrentOrder,
    });

    // Handler especial para reconexión (necesita lotteryId)
    connection.onreconnected(() => {
      if (isMountedRef.current) {
        setIsConnected(true);
        console.log('🔄 Reconectado a LotteryHub');
        connection.invoke('JoinLottery', lotteryId).catch(console.error);
      }
    });

    connection.onclose(() => {
      if (isMountedRef.current) {
        setIsConnected(false);
        console.log('❌ Desconectado de LotteryHub');
      }
    });

    // Iniciar conexión
    const initConnection = async () => {
      if (!isMountedRef.current) return;

      isConnectingRef.current = true;

      try {
        await startConnection(connection, lotteryId);
        if (isMountedRef.current) {
          setIsConnected(true);
          console.log('✅ Conectado a LotteryHub');
        }
      } catch (err) {
        console.error('❌ Error al iniciar conexión SignalR:', err);
        if (isMountedRef.current) {
          setError('Error al conectar con el servidor');
        }
      } finally {
        isConnectingRef.current = false;
      }
    };

    initConnection();

    // Cleanup
    return () => {
      isMountedRef.current = false;

      if (connectionRef.current) {
        console.log('🧹 LotteryHub: Limpiando conexión en cleanup');
        unregisterHubEventHandlers(connectionRef.current);
        stopConnection(connectionRef.current, lotteryId);
        connectionRef.current = null;
      }
    };
  }, [token, lotteryId]);

  // ========== MÉTODOS DEL HUB ==========

  /**
   * Reservar números Y crear/agregar a orden automáticamente (MÉTODO PRINCIPAL)
   * NOTA: El método ReserveNumber individual NO existe en el backend.
   * Use siempre ReserveNumbersWithOrder.
   *
   * @param items - Lista de items del carrito (número y cantidad de series)
   * @param existingOrderId - (Opcional) ID de orden existente para agregar números
   */
  const reserveNumbersWithOrder = useCallback(
    async (items: CartItemDto[], existingOrderId?: string) => {
      const connection = connectionRef.current;

      if (connection?.state !== signalR.HubConnectionState.Connected) {
        const errorMsg = 'No hay conexión con el servidor';
        setError(errorMsg);
        console.error('❌ SignalR connection is not in the Connected state. Current state:', connection?.state);
        throw new Error(errorMsg);
      }

      if (!items || items.length === 0) {
        const errorMsg = 'Debe seleccionar al menos un número';
        setError(errorMsg);
        console.error('❌ No items provided to reserve.');
        throw new Error(errorMsg);
      }

      try {
        setError(null);
        console.log('📤 Invoking ReserveNumbersWithOrder with:', {
          lotteryId,
          items,
          existingOrderId: existingOrderId ?? null,
        });
        await connection.invoke('ReserveNumbersWithOrder', lotteryId, items, existingOrderId ?? null);
        console.log('✅ ReserveNumbersWithOrder invoked successfully. Waiting for server confirmation...');
      } catch (e) {
        console.error('❌ Error in ReserveNumbersWithOrder:', e);
        setError('Error al reservar los números');
        throw e;
      }
    },
    [lotteryId]
  );

  /**
   * Reservar un solo número (wrapper de ReserveNumbersWithOrder)
   * @param number - El número a reservar
   * @param quantity - Cantidad de series a reservar (default: 1)
   * @param existingOrderId - (Opcional) ID de orden existente
   */
  const reserveNumber = useCallback(
    async (number: number, quantity: number = 1, existingOrderId?: string) => {
      const items: CartItemDto[] = [{ number, quantity }];
      await reserveNumbersWithOrder(items, existingOrderId);
    },
    [reserveNumbersWithOrder]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearReservations = useCallback(() => {
    setReservations([]);
  }, []);

  const clearCurrentOrder = useCallback(() => {
    setCurrentOrder(null);
  }, []);

  return {
    availableNumbers,
    reservations,
    currentOrder,
    error,
    isConnected,
    reserveNumber,
    reserveNumbersWithOrder,
    clearError,
    clearReservations,
    clearCurrentOrder,
  };
};
