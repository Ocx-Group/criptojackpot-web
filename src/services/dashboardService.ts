import { BaseService } from './baseService';
import { Response } from '@/interfaces/response';

export interface UserStatsResponse {
  totalUsers: number;
  usersThisMonth: number;
  usersLastMonth: number;
  percentageChange: number;
}

export interface OrderStatsResponse {
  totalTicketsSold: number;
  ticketsThisMonth: number;
  ticketsLastMonth: number;
  ticketsPercentageChange: number;
  totalRevenue: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  revenuePercentageChange: number;
  conversionRate: number;
  conversionRateLastMonth: number;
  conversionRateChange: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  eventType: string;
  source: string;
  status: string;
  correlationId?: string;
  userId?: string;
  username?: string;
  action: string;
  description?: string;
  resourceType?: string;
  resourceId?: string;
}

class DashboardService extends BaseService {
  protected endpoint = 'dashboard';

  constructor() {
    super('/api/v1');
  }

  async getUserStats(): Promise<UserStatsResponse> {
    const response = await this.apiClient.get<Response<UserStatsResponse>>(
      '/api/v1/users/admin/stats'
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error fetching user stats');
    }
    return response.data.data;
  }

  async getOrderStats(): Promise<OrderStatsResponse> {
    const response = await this.apiClient.get<Response<OrderStatsResponse>>(
      '/api/v1/orders/admin/stats'
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error fetching order stats');
    }
    return response.data.data;
  }

  async getRecentActivity(pageSize: number = 10): Promise<AuditLogItem[]> {
    const response = await this.apiClient.get<Response<AuditLogItem[]>>(
      '/api/v1/audit',
      { params: { PageSize: pageSize, Page: 1 } }
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error fetching activity');
    }
    return response.data.data;
  }
}

export const dashboardService = new DashboardService();
