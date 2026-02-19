import { BaseService } from './baseService';
import {
  TwoFactorSetupResponse,
  TwoFactorStatusResponse,
  Enable2FaRequest,
  Enable2FaResponse,
  Disable2FaRequest,
} from '@/features/user-panel/types/twoFactor';

class TwoFactorService extends BaseService {
  protected override endpoint = 'auth/2fa';

  constructor() {
    super('/api/v1');
  }

  async getStatus(): Promise<TwoFactorStatusResponse> {
    const url = `${this.servicePrefix}/${this.endpoint}/status`;
    const response = await this.apiClient.get<TwoFactorStatusResponse>(url);
    return response.data;
  }

  async setup(): Promise<TwoFactorSetupResponse> {
    const url = `${this.servicePrefix}/${this.endpoint}/setup`;
    const response = await this.apiClient.post<TwoFactorSetupResponse>(url);
    return response.data;
  }

  async enable(request: Enable2FaRequest): Promise<Enable2FaResponse> {
    const url = `${this.servicePrefix}/${this.endpoint}/enable`;
    const response = await this.apiClient.post<Enable2FaResponse>(url, request);
    return response.data;
  }

  async disable(request: Disable2FaRequest): Promise<void> {
    const url = `${this.servicePrefix}/${this.endpoint}/disable`;
    await this.apiClient.post(url, request);
  }

  async getRecoveryCodes(): Promise<string[]> {
    const url = `${this.servicePrefix}/${this.endpoint}/recovery-codes`;
    const response = await this.apiClient.post<string[]>(url);
    return response.data;
  }
}

export { TwoFactorService };
