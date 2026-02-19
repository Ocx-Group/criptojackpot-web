import { BaseService } from './baseService';
import { Response } from '@/interfaces/response';
import {
  TwoFactorSetupResponse,
  TwoFactorStatusResponse,
  Confirm2FaRequest,
  Confirm2FaResponse,
  Disable2FaRequest,
  Regenerate2FaRecoveryCodesRequest,
} from '@/features/user-panel/types/twoFactor';

class TwoFactorService extends BaseService {
  protected override endpoint = '2fa';

  constructor() {
    super('/api/v1');
  }

  async getStatus(): Promise<TwoFactorStatusResponse> {
    const url = `${this.servicePrefix}/${this.endpoint}/status`;
    const response = await this.apiClient.get<Response<TwoFactorStatusResponse>>(url);
    return this.handleResponse(response);
  }

  async setup(): Promise<TwoFactorSetupResponse> {
    const url = `${this.servicePrefix}/${this.endpoint}/setup`;
    const response = await this.apiClient.post<Response<TwoFactorSetupResponse>>(url);
    return this.handleResponse(response);
  }

  async confirm(request: Confirm2FaRequest): Promise<Confirm2FaResponse> {
    const url = `${this.servicePrefix}/${this.endpoint}/confirm`;
    const response = await this.apiClient.post<Response<Confirm2FaResponse>>(url, request);
    return this.handleResponse(response);
  }

  async disable(request: Disable2FaRequest): Promise<void> {
    const url = `${this.servicePrefix}/${this.endpoint}/disable`;
    await this.apiClient.post(url, request);
  }

  async regenerateRecoveryCodes(request: Regenerate2FaRecoveryCodesRequest): Promise<Confirm2FaResponse> {
    const url = `${this.servicePrefix}/${this.endpoint}/recovery-codes/regenerate`;
    const response = await this.apiClient.post<Response<Confirm2FaResponse>>(url, request);
    return this.handleResponse(response);
  }
}

export { TwoFactorService };
