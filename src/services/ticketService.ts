import { Ticket } from '@/interfaces/ticket';
import { BaseService } from './baseService';

class TicketService extends BaseService {
  protected override endpoint = 'tickets';

  constructor() {
    super('/api/v1');
  }

  async getMyTickets(): Promise<Ticket[]> {
    return this.getAll<Ticket>({ path: 'my' });
  }
}

export { TicketService };
