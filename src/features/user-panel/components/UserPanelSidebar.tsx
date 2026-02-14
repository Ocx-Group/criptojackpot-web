'use client';

import miller from 'public/images/man-global/devid-miller.png';
import {
  HeadsetIcon,
  HeartIcon,
  InfoIcon,
  LightningIcon,
  SignOutIcon,
  TicketIcon,
  UploadIcon,
  WalletIcon,
} from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUserStore } from '@/store/userStore';
import { useProfilePhoto } from '@/hooks/useProfilePhoto';

const UserPanelSidebar = () => {
  const path = usePathname();
  const { user } = useUserStore();
  const { logout } = useAuth();

  const { profileImage, uploading, uploadError, fileInputRef, handleFileSelect, openFileSelector, clearError } =
    useProfilePhoto({
      defaultImage: miller,
      maxFileSize: 10 * 1024 * 1024,
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      onUploadStart: () => {},
      onUploadSuccess: url => {
        console.log('Imagen subida exitosamente:', url);
      },
      onUploadError: error => {
        console.error('Error en upload:', error);
      },
    });

  const handleLogout = () => {
    logout();
  };

  const getFullName = () => {
    if (!user) return 'Usuario';
    return `${user.name || ''} ${user.lastName || ''}`.trim() || 'Usuario';
  };

  return (
    <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-8 relative">
      <div className="user-panel-sidebarwrap sidebar-sticky">
        <div className="user-panel-sideinner win40-ragba border radius24 py-xxl-10 py-xl-8 py-lg-6 py-5 px-xxl-8 px-xl-6 px-5">
          <div className="user-profile-thumb position-relative text-center border-bottom pb-xxl-5 pb-4 mb-xxl-6 mb-5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            <span
              className={`pencil d-center ${uploading ? 'disabled' : ''}`}
              onClick={openFileSelector}
              style={{
                cursor: uploading ? 'not-allowed' : 'pointer',
                opacity: uploading ? 0.6 : 1,
              }}
              title={uploading ? 'Subiendo imagen...' : 'Cambiar foto de perfil'}
            >
              <UploadIcon weight="bold" className="ph-bold ph-upload fs-five" />
            </span>

            <div className="thumb mb-xxl-5 mb-xl-4 mb-4 m-auto position-relative">
              <Image
                src={profileImage}
                alt="Profile Image"
                className="radius-circle"
                width={100}
                height={100}
                style={{ objectFit: 'cover' }}
                priority
              />

              {uploading && (
                <div className="position-absolute inset-0 bg-black bg-opacity-50 d-center radius-circle">
                  <div className="spinner-border text-white" role="status">
                    <span className="visually-hidden">Subiendo...</span>
                  </div>
                </div>
              )}
            </div>

            {uploadError && (
              <div
                className="alert alert-danger mt-2 p-2 d-flex align-items-center justify-content-between"
                style={{ fontSize: '12px', lineHeight: '1.2' }}
              >
                <span>{uploadError}</span>
                <button
                  type="button"
                  className="btn-close btn-close-sm ms-2"
                  onClick={clearError}
                  aria-label="Cerrar error"
                ></button>
              </div>
            )}

            <div className="content">
              <span className="fs20 fw_700 n4-clr d-block mb-1" title={getFullName()}>
                {getFullName()}
              </span>
              <span className="n3-clr" title={user?.email}>
                {user?.email || 'email@ejemplo.com'}
              </span>
            </div>
          </div>

          <nav aria-label="Panel de usuario">
            <ul className="user-sidebar d-grid gap-2">
              {sidebarItems.map(item => (
                <li key={`sidebar-${item.id}`}>
                  <Link
                    href={item.href}
                    className={`${
                      path === item.href ? 'active' : ''
                    } py-xxl-3 py-2 px-xxl-5 px-xl-4 px-3 radius12 n4-clr fw_600 d-flex align-items-center gap-xxl-3 gap-2 user-text-inner`}
                    aria-current={path === item.href ? 'page' : undefined}
                  >
                    {item.icon}
                    {item.text}
                  </Link>
                </li>
              ))}

              <li>
                <button
                  onClick={handleLogout}
                  className="py-xxl-3 py-2 px-xxl-5 px-xl-4 px-3 radius12 n4-clr fw_600 d-flex align-items-center gap-xxl-3 gap-2 user-text-inner w-full border-0 bg-transparent text-start"
                  aria-label="Cerrar sesión"
                >
                  <SignOutIcon weight="bold" className="ph-bold ph-sign-out fs-five" />
                  Log Out
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default UserPanelSidebar;

const sidebarItems = [
  {
    id: 3434652,
    href: '/personal-info',
    icon: <InfoIcon weight="bold" className="ph-bold ph-info fs-five" />,
    text: 'Personal Information',
  },
  {
    id: 1343,
    href: '/user-panel',
    icon: <TicketIcon weight="bold" className="ph-bold ph-ticket fs-five" />,
    text: 'My Tickets',
  },
  {
    id: 334221,
    href: '/transaction',
    icon: <UploadIcon weight="bold" className="ph-bold ph-upload fs-five" />,
    text: 'Transactions',
  },
  {
    id: 4212,
    href: '/referal-program',
    icon: <LightningIcon weight="bold" className="ph-bold ph-lightning fs-five" />,
    text: 'Referral Program',
  },
  {
    id: 51212,
    href: '/wish-list',
    icon: <HeartIcon weight="bold" className="ph-bold ph-heart fs-five" />,
    text: 'Wishlist',
  },
  {
    id: 62342,
    href: '/payment',
    icon: <WalletIcon weight="bold" className="ph-bold ph-wallet fs-five" />,
    text: 'Payment Methods',
  },
  {
    id: 4447,
    href: '/#',
    icon: <HeadsetIcon weight="bold" className="ph-bold ph-headset fs-five" />,
    text: 'Help Center',
  },
];
