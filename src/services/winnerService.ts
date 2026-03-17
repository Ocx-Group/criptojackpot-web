import { BaseService } from './baseService';
import { Winner, DetermineWinnerRequest } from '@/interfaces/winner';

class WinnerService extends BaseService {
  protected override endpoint = 'winners';

  constructor() {
    super('/api/v1');
  }

  async determineWinner(data: DetermineWinnerRequest): Promise<Winner> {
    return this.create<DetermineWinnerRequest, Winner>(data, 'determine');
  }

  async getAllWinners(): Promise<Winner[]> {
    return this.getAll<Winner>();
  }
}

export { WinnerService };
