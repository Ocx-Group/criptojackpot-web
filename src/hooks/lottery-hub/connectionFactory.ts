import * as signalR from '@microsoft/signalr';

const getHubUrl = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  // Remover /api si existe al final para construir la URL del hub
  const cleanBaseUrl = baseUrl.replace(/\/api\/?$/, '');
  return `${cleanBaseUrl}/hubs/lottery`;
};

/**
 * Crea una nueva conexión al LotteryHub
 */
export const createHubConnection = (token: string): signalR.HubConnection => {
  return new signalR.HubConnectionBuilder()
    .withUrl(getHubUrl(), {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();
};

/**
 * Inicia la conexión y se une al grupo de la lotería
 */
export const startConnection = async (connection: signalR.HubConnection, lotteryId: string): Promise<void> => {
  await connection.start();
  console.log('Conectado a LotteryHub');
  await connection.invoke('JoinLottery', lotteryId);
};

/**
 * Detiene la conexión y abandona el grupo de la lotería
 */
export const stopConnection = async (connection: signalR.HubConnection, lotteryId: string): Promise<void> => {
  try {
    await connection.invoke('LeaveLottery', lotteryId);
  } catch {
    // Ignorar errores al salir del grupo
  } finally {
    await connection.stop();
  }
};
