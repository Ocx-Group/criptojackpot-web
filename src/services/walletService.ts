import { BaseService } from '@/services/baseService';
import { Response } from '@/interfaces/response';

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
}

export { WalletService };
