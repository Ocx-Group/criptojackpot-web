'use client';

import AdminWinnersList from '@/features/admin-panel/components/AdminWinnersList';

const AdminWinnersPage = () => {
  return (
    <div className="col-lg-9">
      <div className="user-panel-wrapper">
        <h3 className="n4-clr fw_700 mb-xxl-10 mb-6">Ganadores</h3>
        <AdminWinnersList />
      </div>
    </div>
  );
};

export default AdminWinnersPage;
