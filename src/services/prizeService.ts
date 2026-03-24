import { PaginationRequest } from '@/interfaces/pagination';
import { BaseService } from './baseService';
import { Prize, CreatePrizeRequest, UpdatePrizeRequest } from '@/interfaces/prize';
import { PaginatedResponse } from '@/interfaces/paginatedResponse';

class PrizeService extends BaseService {
  protected endpoint = 'prizes';

  /**
   * Constructor - Define el prefijo del microservicio de premios
   * Apunta a la ruta definida en ingress.yaml para lottery-api (/api/v1/prizes)
   */
  constructor() {
    super('/api/v1');
  }

  async createPrize(request: CreatePrizeRequest): Promise<Prize> {
    return this.create<CreatePrizeRequest, Prize>(request);
  }

  async getAllPrizes(pagination?: PaginationRequest, availableOnly?: boolean): Promise<PaginatedResponse<Prize>> {
    const params: Record<string, string> = {};
    if (pagination?.pageNumber) params.pageNumber = pagination.pageNumber.toString();
    if (pagination?.pageSize) params.pageSize = pagination.pageSize.toString();
    if (availableOnly) params.availableOnly = 'true';

    return this.getAllPaginated<Prize>({ params });
  }

  async getPrizeById(id: string): Promise<Prize> {
    return this.getById<Prize>(id);
  }

  async updatePrize(id: string | number, request: UpdatePrizeRequest): Promise<Prize> {
    return this.update<UpdatePrizeRequest, Prize>(id, request);
  }

  async deletePrize(id: string | number): Promise<void> {
    return this.delete(id);
  }
}

export { PrizeService };
