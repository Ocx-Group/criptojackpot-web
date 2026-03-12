import { useQuery } from '@tanstack/react-query';
import {
  dashboardService,
  UserStatsResponse,
  OrderStatsResponse,
  AuditLogItem,
} from '@/services/dashboardService';

export function useAdminDashboard() {
  const userStats = useQuery<UserStatsResponse>({
    queryKey: ['admin', 'userStats'],
    queryFn: () => dashboardService.getUserStats(),
    staleTime: 60_000,
  });

  const orderStats = useQuery<OrderStatsResponse>({
    queryKey: ['admin', 'orderStats'],
    queryFn: () => dashboardService.getOrderStats(),
    staleTime: 60_000,
  });

  const recentActivity = useQuery<AuditLogItem[]>({
    queryKey: ['admin', 'recentActivity'],
    queryFn: () => dashboardService.getRecentActivity(10),
    staleTime: 30_000,
  });

  return {
    userStats,
    orderStats,
    recentActivity,
    isLoading: userStats.isLoading || orderStats.isLoading || recentActivity.isLoading,
  };
}
