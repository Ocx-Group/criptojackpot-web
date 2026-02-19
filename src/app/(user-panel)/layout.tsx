import React from 'react';

import Breadcrumbs from '@/components/about/Breadcrumbs';
import { AuthGuard } from '@/components/AuthGuard';
import Footer from '@/components/home-one/Footer';
import NavbarBlack from '@/components/navbar/NavbarBlack';
import UserPanelSidebar from '@/features/user-panel/components/UserPanelSidebar';

const UserPanelLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <AuthGuard requireAuth={true} requiredRole="client">
      <div>
        <NavbarBlack />
        <Breadcrumbs pageName="User Panel" />
        <div className="userpanel-section pt-120 pb-120">
          <div className="container">
            <div className="row g-6 justify-content-center">
              <UserPanelSidebar />
              {children}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </AuthGuard>
  );
};

export default UserPanelLayout;
