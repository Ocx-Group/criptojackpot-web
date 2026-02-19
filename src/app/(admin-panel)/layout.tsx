import React from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import AdminPanelSidebar from '@/features/admin-panel/components/AdminPanelSidebar';
import Breadcrumbs from '@/components/about/Breadcrumbs';
import Footer from '@/components/home-one/Footer';
import NavbarBlack from '@/components/navbar/NavbarBlack';

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <AuthGuard requireAuth={true} requiredRole="admin">
      <div>
        <NavbarBlack />
        <Breadcrumbs pageName="Panel de Administración" />
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
