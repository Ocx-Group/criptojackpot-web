import { BaseService } from './baseService';
import { injectable } from 'tsyringe';

interface AvailableNumbersResponse {
  lotteryId: string;
  numbers: Array<{
    number: number;
    series: string;
  }>;
}

interface CheckNumberResponse {
  isAvailable: boolean;
  number: number;
  series: string;
}

interface NumberStatsResponse {
  lotteryId: string;
  totalNumbers: number;
  availableNumbers: number;
  reservedNumbers: number;
  soldNumbers: number;
}

@injectable()
class LotteryNumberService extends BaseService {
  protected endpoint = 'lottery-numbers';

  /**
   * Constructor - Define el prefijo del microservicio de números de lotería
   * Apunta a la ruta definida en ingress.yaml para lottery-api (/api/v1/lottery-numbers)
   */
  constructor() {
    super('/api/v1');
  }

  /**
   * Obtener números disponibles para una lotería
   * GET /api/v1/lottery-numbers/{lotteryId}/available?count=10
   */
  async getAvailableNumbers(lotteryId: string, count: number = 10): Promise<AvailableNumbersResponse> {
    return this.getAll<AvailableNumbersResponse>({
      path: `${lotteryId}/available`,
      params: { count: count.toString() },
    }) as any;
  }

  /**
   * Verificar si un número está disponible
   * GET /api/v1/lottery-numbers/{lotteryId}/check?number={n}&series={s}
   */
  async checkNumberAvailability(lotteryId: string, number: number, series: string): Promise<CheckNumberResponse> {
    return this.getAll<CheckNumberResponse>({
      path: `${lotteryId}/check`,
      params: { number: number.toString(), series },
    }) as any;
  }

  /**
   * Liberar números reservados por ticket
   * DELETE /api/v1/lottery-numbers/release/{ticketId}
   */
  async releaseNumbers(ticketId: string): Promise<void> {
    return this.delete(`release/${ticketId}` as any);
  }

  /**
   * Obtener estadísticas de números de una lotería
   * GET /api/v1/lottery-numbers/{lotteryId}/stats
   */
  async getNumberStats(lotteryId: string): Promise<NumberStatsResponse> {
    return this.getAll<NumberStatsResponse>({
      path: `${lotteryId}/stats`,
    }) as any;
  }
}

export { LotteryNumberService };
