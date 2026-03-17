'use client';

import React from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import AdminPanelSidebar from '@/features/admin-panel/components/AdminPanelSidebar';
import Breadcrumbs from '@/components/about/Breadcrumbs';
import Footer from '@/components/home-one/Footer';
import NavbarBlack from '@/components/navbar/NavbarBlack';
import { useUserStore } from '@/store/userStore';

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = useUserStore(state => state.user);
  const displayName = user
    ? `${user.name || ''} ${user.lastName || ''}`.trim() || user.email
    : 'Panel de Administración';

  return (
    <AuthGuard requireAuth={true} requiredRole="admin">
      <div>
        <NavbarBlack />
        <Breadcrumbs pageName={displayName} />
        <div className="userpanel-section pt-120 pb-120">
          <div className="container">
            <div className="row g-6 justify-content-center">
              <AdminPanelSidebar />
              {children}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </AuthGuard>
  );
};

export default AdminLayout;
