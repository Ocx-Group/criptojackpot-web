'use client';

import QuickActions from '@/features/admin-panel/components/QuickActions';
import RecentActivityTable from '@/features/admin-panel/components/RecentActivityTable';
import StatsSection from '@/features/admin-panel/components/StatsSection';
import { useAdminDashboard } from '@/features/admin-panel/hooks';

const AdminDashboard = () => {
  const { userStats, orderStats, recentActivity, isLoading } = useAdminDashboard();

  return (
    <div className="col-lg-9">
      <div className="user-panel-wrapper">
        <h3 className="n4-clr fw_700 mb-xxl-10 mb-6">Dashboard de Administración</h3>
        <StatsSection
          userStats={userStats.data}
          orderStats={orderStats.data}
          isLoading={userStats.isLoading || orderStats.isLoading}
        />
        <RecentActivityTable
          activities={recentActivity.data}
          isLoading={recentActivity.isLoading}
        />
        <QuickActions />
      </div>
    </div>
  );
};

export default AdminDashboard;
