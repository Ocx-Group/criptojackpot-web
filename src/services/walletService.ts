import { BaseService } from '@/services/baseService';
import { Response } from '@/interfaces/response';
import { PaginatedResponse } from '@/interfaces/paginatedResponse';
import { WalletBalance, WalletTransaction, WalletTransactionType } from '@/interfaces/walletTransaction';
import { CreateWithdrawalRequest, WithdrawalRequestDto } from '@/features/user-panel/types/withdrawal';
import { AdminWithdrawalRequest, ProcessWithdrawalRequest } from '@/features/admin-panel/types/withdrawal';

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

  async requestWithdrawalCode(): Promise<boolean> {
    try {
      const response = await this.apiClient.post<Response<boolean>>(
        `${this.servicePrefix}/withdrawals/request-code`
      );
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createWithdrawal(request: CreateWithdrawalRequest): Promise<WithdrawalRequestDto> {
    try {
      const response = await this.apiClient.post<Response<WithdrawalRequestDto>>(
        `${this.servicePrefix}/withdrawals`,
        request
      );
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAllTransactions(
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
        `${this.servicePrefix}/${this.endpoint}/admin/transactions`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAdminWithdrawals(
    page: number = 1,
    pageSize: number = 10,
    status?: number
  ): Promise<PaginatedResponse<AdminWithdrawalRequest>> {
    try {
      const params: Record<string, string> = {
        page: page.toString(),
        pageSize: pageSize.toString(),
      };
      if (status !== undefined) {
        params.status = status.toString();
      }
      const response = await this.apiClient.get<PaginatedResponse<AdminWithdrawalRequest>>(
        `${this.servicePrefix}/withdrawals/admin`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async approveWithdrawal(requestGuid: string, request?: ProcessWithdrawalRequest): Promise<AdminWithdrawalRequest> {
    try {
      const response = await this.apiClient.post<Response<AdminWithdrawalRequest>>(
        `${this.servicePrefix}/withdrawals/admin/${requestGuid}/approve`,
        request || {}
      );
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async rejectWithdrawal(requestGuid: string, request?: ProcessWithdrawalRequest): Promise<AdminWithdrawalRequest> {
    try {
      const response = await this.apiClient.post<Response<AdminWithdrawalRequest>>(
        `${this.servicePrefix}/withdrawals/admin/${requestGuid}/reject`,
        request || {}
      );
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export { WalletService };
