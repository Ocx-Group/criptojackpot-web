import * as signalR from '@microsoft/signalr';
import {
  AvailableNumberDto,
  NumberReservationDto,
  NumberStatusDto,
  ReservationWithOrderDto,
} from '@/interfaces/lotteryHub';
import {
  updateNumberOnReserve,
  updateNumberOnRelease,
  updateNumberOnSold,
  updateNumbersOnBulkRelease,
  updateNumbersOnBulkSold,
} from './numberStateUpdaters';

export interface HubEventCallbacks {
  setAvailableNumbers: React.Dispatch<React.SetStateAction<AvailableNumberDto[]>>;
  setReservations: React.Dispatch<React.SetStateAction<NumberReservationDto[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentOrder: React.Dispatch<React.SetStateAction<ReservationWithOrderDto | null>>;
}

/**
 * Registra todos los event handlers del hub
 */
export const registerHubEventHandlers = (connection: signalR.HubConnection, callbacks: HubEventCallbacks): void => {
  const { setAvailableNumbers, setReservations, setError, setIsConnected, setCurrentOrder } = callbacks;

  // Recibir números disponibles al unirse
  connection.on('ReceiveAvailableNumbers', (_lotteryGuid: string, numbers: AvailableNumberDto[]) => {
    setAvailableNumbers(numbers);
  });

  // Número reservado (individual)
  connection.on(
    'NumberReserved',
    (_lotteryGuid: string, _numberId: number, _numberGuid: string, number: number, series: number) => {
      setAvailableNumbers(prev => updateNumberOnReserve(prev, number));
      console.log(`El servidor asignó la serie ${series} para el número ${number}`);
    }
  );

  // Número liberado (individual)
  connection.on(
    'NumberReleased',
    (_lotteryGuid: string, _numberId: number, _numberGuid: string, number: number, _series: number) => {
      setAvailableNumbers(prev => updateNumberOnRelease(prev, number));
    }
  );

  // Número vendido (individual)
  connection.on(
    'NumberSold',
    (_lotteryGuid: string, _numberId: number, _numberGuid: string, number: number, _series: number) => {
      setAvailableNumbers(prev => updateNumberOnSold(prev, number));
    }
  );

  // Múltiples números liberados
  connection.on('NumbersReleased', (_lotteryGuid: string, numbers: NumberStatusDto[]) => {
    setAvailableNumbers(prev => updateNumbersOnBulkRelease(prev, numbers));
  });

  // Múltiples números vendidos
  connection.on('NumbersSold', (_lotteryGuid: string, numbers: NumberStatusDto[]) => {
    setAvailableNumbers(prev => updateNumbersOnBulkSold(prev, numbers));
  });

  // Confirmación de reserva individual
  connection.on('ReservationConfirmed', (reservation: NumberReservationDto) => {
    setReservations(prev => [...prev, reservation]);
  });

  // Confirmación de múltiples reservas
  connection.on('ReservationsConfirmed', (newReservations: NumberReservationDto[]) => {
    setReservations(prev => [...prev, ...newReservations]);
  });

  // ✨ NUEVO: Confirmación de reserva con información de orden
  connection.on('ReservationWithOrderConfirmed', (reservationWithOrder: ReservationWithOrderDto) => {
    // Agregar las reservaciones al estado
    setReservations(prev => [...prev, ...reservationWithOrder.reservations]);

    // Actualizar/crear la orden actual
    setCurrentOrder(prev => {
      if (prev && reservationWithOrder.addedToExistingOrder) {
        // Si se agregó a una orden existente, acumular
        return {
          ...reservationWithOrder,
          reservations: [...prev.reservations, ...reservationWithOrder.reservations],
          totalAmount: prev.totalAmount + reservationWithOrder.totalAmount,
        };
      }
      // Nueva orden
      return reservationWithOrder;
    });

    console.log(`Orden ${reservationWithOrder.orderId} - Total: $${reservationWithOrder.totalAmount}`);
  });

  // Error del servidor
  connection.on('ReceiveError', (message: string) => {
    setError(message);
  });

  // Eventos de reconexión
  connection.onreconnecting(() => {
    setIsConnected(false);
    console.log('Reconectando a LotteryHub...');
  });

  connection.onreconnected(() => {
    setIsConnected(true);
    console.log('Reconectado a LotteryHub');
  });

  connection.onclose(() => {
    setIsConnected(false);
    console.log('Desconectado de LotteryHub');
  });
};

/**
 * Elimina todos los event handlers del hub
 */
export const unregisterHubEventHandlers = (connection: signalR.HubConnection): void => {
  const events = [
    'ReceiveAvailableNumbers',
    'NumberReserved',
    'NumberReleased',
    'NumberSold',
    'NumbersReleased',
    'NumbersSold',
    'ReservationConfirmed',
    'ReservationsConfirmed',
    'ReservationWithOrderConfirmed',
    'ReceiveError',
  ];

  events.forEach(event => connection.off(event));
};
