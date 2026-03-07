'use client';
import globalNft from '@/../public/images/global/global-nft.png';
import globalNft2 from '@/../public/images/global/global-nft2.png';
import logoWhite from '@/../public/images/logo/BlackOrange.png';

import { ShoppingCartSimpleIcon, SignOutIcon } from '@phosphor-icons/react';
import { ArrowRightIcon, CaretDownIcon, UserIcon } from '@phosphor-icons/react/dist/ssr';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { navbarData } from 'public/data/navbarData';
import AllHomePage from './AllHomePage';
import LanguageSelector from '../languageSelector/LanguageSelector';
import { useAuth } from '@/hooks/useAuth';
import { useCartStore } from '@/store/cartStore';
dynamic(() => import('react-select'), { ssr: false });
const NavbarBlack = () => {
  const { t } = useTranslation();
  const pathName = usePathname();
  const [scrollHeight, setScrollHeight] = useState(0);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isOverflowHidden, setIsOverflowHidden] = useState(false);
  const [dropdownId, setDropdownId] = useState('');
  const { isAuthenticated, logout } = useAuth();
  const cartCount = useCartStore(state => state.items.length);

  const handleNavToggle = () => {
    setIsNavOpen(!isNavOpen);
    setIsOverflowHidden(!isOverflowHidden);
  };

  const handleScroll = () => {
    const scroll = window.scrollY;
    setScrollHeight(scroll);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleDropDown = (id: string) => {
    if (dropdownId === id) {
      setDropdownId('');
    } else {
      setDropdownId(id);
    }
  };

  return (
    <header
      className={`header-section-v1 custom-fixed header-position ${
        scrollHeight > 50 ? 'animated fadeInDown header-fixed' : ''
      }`}
    >
      {/* desktop header */}
      <div className="container-header">
        <div className="main-navbar main-navbar-white">
          <nav className="navbar-custom">
            <div className="d-flex align-items-center justify-content-between">
              <Link href="" className="nav-brand d-xl-none">
                <Image className="w-100" src={logoWhite} width={243} alt="logo" />
              </Link>
              <div className="d-flex gap-6">
                <button
                  className={`navbar-toggle-btn d-block d-xl-none ${isNavOpen ? 'open' : ''}`}
                  type="button"
                  onClick={handleNavToggle}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
              </div>
            </div>
            <div className={`navbar-toggle-item ${isNavOpen ? 'navbar-toggle-item-active' : ''}`}>
              <div className="d-flex gap-5 flex-column flex-lg-row align-items-start align-items-xl-center justify-content-between mt-2 mt-xl-0">
                <Link href="/" className="nav-brand d-none d-xl-block">
                  <Image className="w-auto" src={logoWhite} width={243} alt="logo" />
                </Link>
                <ul className="custom-nav d-xl-flex d-grid gap-4 gap-xl-5 gap-xxl-10">
                  <AllHomePage handleDropDown={handleDropDown} dropdownId={dropdownId} />

                  {navbarData.map(({ id, menuTitle, menuTitleKey, path, menuItems }) => {
                    let isActive = menuItems?.some(path => pathName == path.menuItemPath);
                    return menuItems ? (
                      <li key={`black-nav-dropdown-menu-title-${id}`} className="menu-item position-relative">
                        <div className="d-flex align-items-center" onClick={() => handleDropDown(id)}>
                          <button className={`position-relative ${isActive ? 'active' : ''}`}>
                            {menuTitleKey ? t(menuTitleKey) : menuTitle}
                          </button>{' '}
                          <CaretDownIcon />
                        </div>
                        <ul className={`sub-menu ${dropdownId === id ? 'active-sub-menu' : ''}`}>
                          {menuItems.map(({ id, title, titleKey, menuItemPath }) => (
                            <li key={id} className={`menu-link mb-xxl-2 `}>
                              <Link href={menuItemPath} className={`${pathName == menuItemPath ? 'menu-active' : ''}`}>
                                {titleKey ? t(titleKey) : title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ) : (
                      <li
                        key={`black-nav-menu-title-${id}`}
                        className={`menu-item position-relative ${pathName === path ? 'active' : ''}`}
                      >
                        <Link href={path}> {menuTitleKey ? t(menuTitleKey) : menuTitle} </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="d-flex flex-nowrap align-items-center justify-content-lg-end gap-2 gap-lg-3 gap-xl-4">
                  <ul className="d-flex head-card align-items-center gap-3">
                    <li>
                      <Link href="/checkout" className="cmn-circle" title={t('NAVBAR-BLACK.Basket')}>
                        <ShoppingCartSimpleIcon className="ti ti-shopping-cart-plus"></ShoppingCartSimpleIcon>
                      </Link>
                      {cartCount > 0 && <span className="badge-seri">{cartCount.toString().padStart(2, '0')}</span>}
                    </li>
                    {isAuthenticated && (
                      <li>
                        <Link href="user-panel" className="cmn-circle" title={t('NAVBAR-BLACK.User Panel')}>
                          <UserIcon className="ti ti-user" />
                        </Link>
                      </li>
                    )}
                  </ul>
                  <div className="head-language">
                    <LanguageSelector />
                  </div>
                  {isAuthenticated ? (
                    <button
                      onClick={logout}
                      className="cmn-circle text-danger border-0 bg-transparent p-0"
                      title={t('NAVBAR-BLACK.Logout')}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                      }}
                    >
                      <SignOutIcon size={24} weight="bold" />
                    </button>
                  ) : (
                    <Link href="/login" className="kewta-btn d-inline-flex align-items-center">
                      <span className="kew-text p1-border n0-clr">{t('NAVBAR-BLACK.Join Now')}</span>
                      <div className="kew-arrow p1-bg">
                        <div className="kt-one">
                          <ArrowRightIcon className="ti ti-arrow-right n4-clr" />
                        </div>
                        <div className="kt-two">
                          <ArrowRightIcon className="ti ti-arrow-right n4-clr" />
                        </div>
                      </div>
                    </Link>
                  )}

                  <div className="invisible-menuthumb d-flex">
                    <Link href="landing-nft1">
                      <Image src={globalNft} width={456} alt="img" />
                    </Link>
                    <Link href="landing-nft2">
                      <Image src={globalNft2} width={456} alt="img" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
      {/* mobile header */}
    </header>
  );
};

export default NavbarBlack;
