import { BaseService } from './baseService';
import { CoinPaymentCurrency } from '@/interfaces/coinPaymentCurrency';

class CoinPaymentService extends BaseService {
  protected endpoint = 'coinpayments';

  constructor() {
    super('/api/v1');
  }

  async getCurrencies(): Promise<CoinPaymentCurrency[]> {
    return this.getAll<CoinPaymentCurrency>({ path: 'currencies' });
  }
}

export { CoinPaymentService };
