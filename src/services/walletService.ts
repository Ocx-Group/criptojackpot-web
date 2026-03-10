import { BaseService } from '@/services/baseService';
import { Response } from '@/interfaces/response';
import { PaginatedResponse } from '@/interfaces/paginatedResponse';
import { WalletBalance, WalletTransaction, WalletTransactionType } from '@/interfaces/walletTransaction';

export interface ReferralEarnings {
  totalEarnings: number;
  lastMonthEarnings: number;
}

class WalletService extends BaseService {
  protected endpoint: string = 'wallets';

  constructor() {
    super('/api/v1');
  }

  async getReferralEarnings(): Promise<ReferralEarnings> {
    try {
      const response = await this.apiClient.get<Response<ReferralEarnings>>(
        `${this.servicePrefix}/${this.endpoint}/referral-earnings`
      );
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getBalance(): Promise<WalletBalance> {
    try {
      const response = await this.apiClient.get<Response<WalletBalance>>(
        `${this.servicePrefix}/${this.endpoint}/balance`
      );
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTransactions(
    page: number = 1,
    pageSize: number = 10,
    type?: WalletTransactionType
  ): Promise<PaginatedResponse<WalletTransaction>> {
    try {
      const params: Record<string, string> = {
        page: page.toString(),
        pageSize: pageSize.toString(),
      };
      if (type !== undefined) {
        params.type = type.toString();
      }
      const response = await this.apiClient.get<PaginatedResponse<WalletTransaction>>(
        `${this.servicePrefix}/${this.endpoint}/transactions`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export { WalletService };
