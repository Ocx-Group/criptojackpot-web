import { User } from '@/interfaces/user';
import { BaseService } from './baseService';
import { UpdateImageProfileRequest } from '@/features/user-panel/types/updateImageProfileRequest';
import { GenerateNewSecurityCodeRequest } from '@/features/user-panel/types/generateNewSecurityCodeRequest';
import { UpdateUserRequest } from '@/features/user-panel/types/updateUserRequest';
import { RequestPasswordResetRequest } from '@/features/auth/types/requestPasswordResetRequest';
import { ResetPasswordWithCodeRequest } from '@/features/auth/types/resetPasswordWithCodeRequest';
import { injectable } from 'tsyringe';

@injectable()
class UserService extends BaseService {
  protected endpoint: string = 'users';

  /**
   * Constructor - Define el prefijo del microservicio de usuarios
   * Apunta a la ruta definida en ingress.yaml para identity-api (/api/v1/users)
   */
  constructor() {
    super('/api/v1');
  }

  async createUser(user: User): Promise<User> {
    return this.create<User, User>(user);
  }

  async updateImageProfile(request: UpdateImageProfileRequest): Promise<User> {
    return this.patch<User>(`users/update-image-profile`, request);
  }

  async generateNewSecurityCode(request: GenerateNewSecurityCodeRequest): Promise<User> {
    return this.patch<User>(`users/generate-new-security-code`, request);
  }

  async updateUserAsync(userId: number, updateUser: UpdateUserRequest): Promise<User> {
    return this.update<UpdateUserRequest, User>(userId, updateUser);
  }

  async getUserById(userId: number): Promise<User> {
    return this.getById<User>(userId);
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.getAll<User>({ path: 'by-email', params: { email } }).then(users => users[0]);
  }

  async getCurrentUser(): Promise<User> {
    // Get current authenticated user's profile from backend
    const response = await this.apiClient.get<{ success: boolean; data: User }>(
      `${this.servicePrefix}/${this.endpoint}/me`
    );
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to get current user');
    }
    return response.data.data;
  }

  async getAllUsers(excludeUserId?: number): Promise<User[]> {
    return this.getAll<User>({ path: 'get-all-users/', params: { excludeUserId } });
  }

  async requestPasswordReset(request: RequestPasswordResetRequest): Promise<void> {
    return this.create<RequestPasswordResetRequest, void>(request, 'request-password-reset');
  }

  async resetPassword(request: ResetPasswordWithCodeRequest): Promise<void> {
    return this.create<ResetPasswordWithCodeRequest, void>(request, 'reset-password-with-code');
  }
}

export { UserService };
