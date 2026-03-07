import { BaseService } from './baseService';
import { PayOrderResponse } from '@/interfaces/order';
import { CoinPaymentCurrency } from '@/interfaces/coinPaymentCurrency';

class OrderService extends BaseService {
  protected endpoint = 'orders';

  constructor() {
    super('/api/v1');
  }

  async payOrder(orderId: string): Promise<PayOrderResponse> {
    return this.create<Record<string, never>, PayOrderResponse>({}, `${orderId}/pay`);
  }

  async getCurrencies(): Promise<CoinPaymentCurrency[]> {
    return this.getAll<CoinPaymentCurrency>({ path: 'currencies' });
  }
}

export { OrderService };
