import { BaseService } from './baseService';
import { PayOrderResponse, OrderDto } from '@/interfaces/order';
import { CoinPaymentCurrency } from '@/interfaces/coinPaymentCurrency';
import { PaginatedResponse } from '@/interfaces/paginatedResponse';

class OrderService extends BaseService {
  protected endpoint = 'orders';

  constructor() {
    super('/api/v1');
  }

  async payOrder(orderId: string): Promise<PayOrderResponse> {
    return this.create<Record<string, never>, PayOrderResponse>({}, `${orderId}/pay`);
  }

  async payOrderWithBalance(orderId: string): Promise<void> {
    return this.create<Record<string, never>, void>({}, `${orderId}/pay-with-balance`);
  }

  async getCurrencies(): Promise<CoinPaymentCurrency[]> {
    return this.getAll<CoinPaymentCurrency>({ path: 'currencies' });
  }

  async getAllOrders(
    page: number = 1,
    pageSize: number = 10,
    status?: number
  ): Promise<PaginatedResponse<OrderDto>> {
    const params: Record<string, string> = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };
    if (status !== undefined) {
      params.status = status.toString();
    }
    return this.getAllPaginated<OrderDto>({ path: 'admin/all', params });
  }
}

export { OrderService };
