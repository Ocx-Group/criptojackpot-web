import { AuthRequest, AuthResponse, GoogleLoginRequest, Verify2FaRequest } from '@/features/auth/types/authRequest';
import { BaseService } from './baseService';

class AuthService extends BaseService {
  protected override endpoint = 'auth';

  constructor() {
    super('/api/v1');
  }

  async login(credentials: AuthRequest): Promise<AuthResponse> {
    const url = `${this.servicePrefix}/${this.endpoint}/login`;
    const response = await this.apiClient.post<AuthResponse>(url, credentials);
    return response.data;
  }

  async googleLogin(request: GoogleLoginRequest): Promise<AuthResponse> {
    const url = `${this.servicePrefix}/${this.endpoint}/google`;
    const response = await this.apiClient.post<AuthResponse>(url, request);
    return response.data;
  }

  async verify2Fa(request: Verify2FaRequest): Promise<AuthResponse> {
    const url = `${this.servicePrefix}/${this.endpoint}/2fa/verify`;
    const response = await this.apiClient.post<AuthResponse>(url, request);
    return response.data;
  }

  async refreshToken(): Promise<void> {
    const url = `${this.servicePrefix}/${this.endpoint}/refresh`;
    await this.apiClient.post(url, {});
  }

  async logout(): Promise<void> {
    const url = `${this.servicePrefix}/${this.endpoint}/logout`;
    await this.apiClient.post(url, {});
  }

  async logoutAllDevices(reason?: string): Promise<void> {
    const url = `${this.servicePrefix}/${this.endpoint}/logout-all`;
    await this.apiClient.post(url, reason ? { reason } : {});
  }

  async confirmEmail(token: string): Promise<{ message: string }> {
    return this.create<object, { message: string }>({}, `confirm-email/${token}`);
  }
}

export { AuthService };
