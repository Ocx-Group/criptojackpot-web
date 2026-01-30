import { User } from '@/interfaces/user';
import { useUserStore } from '@/store/userStore';
import { injectable } from 'tsyringe';

@injectable()
export class TokenService {
  /**
   * @deprecated Token is now managed by next-auth. Use session.accessToken instead.
   */
  static getToken(): string | null {
    // Token is now handled by next-auth session
    return null;
  }

  static getUser(): User | null {
    return useUserStore.getState().user;
  }

  static isAdmin(): boolean {
    const user = this.getUser();
    return user?.role?.name === 'admin';
  }

  static isClient(): boolean {
    const user = this.getUser();
    return user?.role?.name === 'client';
  }

  /**
   * @deprecated Authentication is now managed by next-auth. Use useSession() hook.
   */
  static isAuthenticated(): boolean {
    // This is deprecated - use useSession() from next-auth/react instead
    return !!this.getUser();
  }
}
