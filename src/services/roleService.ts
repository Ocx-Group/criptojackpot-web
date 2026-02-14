import { Role } from '@/interfaces/role';
import { BaseService } from './baseService';

class RoleService extends BaseService {
  protected endpoint: string = 'roles';

  /**
   * Constructor - Define el prefijo del microservicio de roles
   * Apunta a la ruta definida en ingress.yaml para identity-api (/api/v1/roles)
   */
  constructor() {
    super('/api/v1');
  }

  async getAllRoles(): Promise<Role[]> {
    return this.getAll<Role>();
  }
}

export { RoleService };
