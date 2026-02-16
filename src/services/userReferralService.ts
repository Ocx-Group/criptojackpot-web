import { BaseService } from '@/services/baseService';
import { UserReferralStats } from '@/features/user-panel/types';

class UserReferralService extends BaseService {
  protected endpoint: string = 'user-referrals';

  /**
   * Constructor - Define el prefijo del microservicio de referidos
   * Apunta a la ruta definida en ingress.yaml para identity-api (/api/v1/user-referrals)
   */
  constructor() {
    super('/api/v1');
  }

  async getUserReferralsAsync(userId: number): Promise<UserReferralStats> {
    return this.getById<UserReferralStats>(`${userId}`);
  }
}

export { UserReferralService };
