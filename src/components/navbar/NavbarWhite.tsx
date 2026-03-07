'use client';
import globalNft from '@/../public/images/global/global-nft.png';
import globalNft2 from '@/../public/images/global/global-nft2.png';
import logoWhite from '@/../public/images/logo/logo-black.png';
import { ShoppingCartSimple } from '@phosphor-icons/react';
import { ArrowRight, CaretDown, User } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { navbarData } from '../../../public/data/navbarData';
import AllHomePage from './AllHomePage';

import dynamic from 'next/dynamic';

const Select = dynamic(() => import('react-select'), { ssr: false });
const NavbarWhite = () => {
  const pathName = usePathname();
  const [scrollHeight, setScrollHeight] = useState(0);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isOverflowHidden, setIsOverflowHidden] = useState(false);
  const [dropdownId, setDropdownId] = useState('');
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

  const options = [
    { value: 'En', label: 'En' },
    { value: 'Bn', label: 'Bn' },
    { value: 'Hn', label: 'Hn' },
  ];
  return (
    <header
      className={`header-section-v4 custom-fixed header-position ${scrollHeight > 50 ? 'animated fadeInDown header-fixed' : ''}`}
    >
      {/* desktop header */}
      <div className="container-header">
        <div className="main-navbar main-navbar-black">
          <nav className="navbar-custom">
            <div className="d-flex align-items-center justify-content-between">
              <Link href="" className="nav-brand d-xl-none">
                <Image className="w-100" src={logoWhite} width={243} alt="logo" />
              </Link>
              <div className="d-flex gap-6">
                <button
                  className={`navbar-toggle-btn navbar-toggle-black d-block d-xl-none ${isNavOpen ? 'open' : ''}`}
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
                  <Image className="w-100" src={logoWhite} width={243} alt="logo" />
                </Link>
                <ul className="custom-nav d-xl-flex d-grid gap-4 gap-xl-5 gap-xxl-10">
                  <AllHomePage handleDropDown={handleDropDown} dropdownId={dropdownId} />

                  {navbarData.map(({ id, menuTitle, path, menuItems }) => {
                    let isActive = menuItems?.some(path => pathName == path.menuItemPath);
                    return menuItems ? (
                      <li key={id} className="menu-item position-relative">
                        <div className="d-flex align-items-center" onClick={() => handleDropDown(id)}>
                          <button className={`position-relative ${isActive ? 'active' : ''}`}>{menuTitle}</button>{' '}
                          <CaretDown />
                        </div>
                        <ul className={`sub-menu ${dropdownId === id ? 'active-sub-menu' : ''}`}>
                          {menuItems.map(({ id, title, menuItemPath }) => (
                            <li
                              key={id}
                              className={`menu-link mb-xxl-2 ${pathName == menuItemPath ? 'menu-active' : ''}`}
                            >
                              <Link href={menuItemPath}>{title}</Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ) : (
                      <li key={id} className={`menu-item position-relative ${pathName === path ? 'active' : ''}`}>
                        <Link href={path}> {menuTitle} </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="d-flex flex-wrap flex-xl-no-wrap align-items-center justify-content-lg-end gap-4">
                  <ul className="d-flex head-card align-items-center gap-3">
                    <li>
                      <Link href="/checkout" className="cmn-circle">
                        <ShoppingCartSimple className="ti ti-shopping-cart-plus"></ShoppingCartSimple>
                      </Link>
                      {cartCount > 0 && <span className="badge-seri">{cartCount.toString().padStart(2, '0')}</span>}
                    </li>
                    <li>
                      <Link href="user-panel" className="cmn-circle">
                        <User className="ti ti-user"></User>
                      </Link>
                    </li>
                  </ul>
                  <div className="head-language">
                    <Select
                      inputId="react-select-lang"
                      defaultValue={options[0]}
                      options={options}
                      classNamePrefix="react-select"
                    />
                  </div>
                  <Link href="contest-details" className="kewta-btn d-inline-flex align-items-center">
                    <span className="kew-text act3-border n4-clr">Explore Now</span>
                    <div className="kew-arrow p1-bg">
                      <div className="kt-one">
                        <ArrowRight className="ti ti-arrow-right n4-clr"></ArrowRight>
                      </div>
                      <div className="kew-arrow act3-bg">
                        <div className="kt-one">
                          <ArrowRight className="ti ti-arrow-right n4-clr"></ArrowRight>
                        </div>
                        <div className="kt-two">
                          <ArrowRight className="ti ti-arrow-right n4-clr"></ArrowRight>
                        </div>
                      </div>
                    </div>
                  </Link>
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

export default NavbarWhite;
