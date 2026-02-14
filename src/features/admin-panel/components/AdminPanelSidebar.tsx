'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { sidebarItems } from 'public/data/sidebarItems';
import { SignOutIcon } from '@phosphor-icons/react';
import { useAuth } from '@/hooks/useAuth';

const AdminPanelSidebar = () => {
  const path = usePathname();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="col-lg-3 pe-lg-10">
      <div className="user-panel-sidebar">
        <div className="user-panel-sidebar-inner">
          {/* Admin Profile Info */}
          <div className="profile-info mb-xxl-10 mb-6 p-xxl-6 p-4 radius16 act4-bg d-flex align-items-center gap-xxl-4 gap-3">
            <div className="content">
              <span className="fs20 fw_700 n4-clr d-block mb-1">Panel de Administración</span>
              <span className="n3-clr">admin@sistema.com</span>
            </div>
          </div>

          {/* Admin Menu */}
          <ul className="user-sidebar d-grid gap-2">
            {sidebarItems.map(item => {
              const Icon = item.Icon;
              return (
                <li key={`sidebar-${item.id}`}>
                  <Link
                    href={item.href}
                    className={`${
                      path === item.href ? 'active' : ''
                    } py-xxl-3 py-2 px-xxl-5 px-xl-4 px-3 radius12 n4-clr fw_600 d-flex align-items-center gap-xxl-3 gap-2 user-text-inner`}
                  >
                    {/* Aquí instanciamos el icono */}
                    <Icon weight="bold" className="ph-bold fs-five me-2" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
            <li>
              <button
                onClick={handleLogout}
                className="py-xxl-3 py-2 px-xxl-5 px-xl-4 px-3 radius12 n4-clr fw_600 d-flex align-items-center gap-xxl-3 gap-2 user-text-inner w-full"
              >
                <SignOutIcon weight="bold" className="ph-bold ph-sign-out fs-five me-2" />
                <span>Cerrar Sesión</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelSidebar;
