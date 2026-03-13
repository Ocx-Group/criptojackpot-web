'use client';

import icon from '@/../public/images/global/section-icon.png';
import defaultImage from '@/../public/images/man-global/nf1.png';
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BarbellIcon,
  BookmarkSimpleIcon,
  ClockIcon,
  LinkIcon,
} from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { lotteryService } from '@/services';
import { Lottery } from '@/interfaces/lottery';
import { PaginatedResponse } from '@/interfaces/paginatedResponse';
import MotionFade from '../motionEffect/MotionFade';
import MotionFadeDownToTop from '../motionEffect/MotionFadeDownToTop';
import MotionFadeTopToDown from '../motionEffect/MotionFadeTopToDown';
import { useTranslation } from 'react-i18next';
import { useWishlist } from '@/features/user-panel/hooks/useWishlist';
import { useNotificationStore } from '@/store/notificationStore';
import { useState } from 'react';

const LotteryList = () => {
  const { t, i18n } = useTranslation();
  const showNotification = useNotificationStore(state => state.show);
  const { isInWishlist, toggleWishlist, isAdding, isRemoving, isAuthenticated } = useWishlist();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: lotteriesResponse, isLoading } = useQuery<PaginatedResponse<Lottery>, Error>({
    queryKey: ['lotteries-public'],
    queryFn: async () => {
      return lotteryService.getAllLotteries({ pageNumber: 1, pageSize: 6 });
    },
  });

  const lotteries = lotteriesResponse?.data?.items || [];

  // Calcular días restantes
  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return t('LOTTERY_LIST.ended');
    if (days === 0) return t('LOTTERY_LIST.today');
    if (days === 1) return t('LOTTERY_LIST.oneDay');
    return t('LOTTERY_LIST.days', { count: days });
  };

  // Calcular porcentaje vendido
  const getSoldPercentage = (sold: number, max: number) => {
    if (max === 0) return 0;
    return Number.parseFloat(((sold / max) * 100).toFixed(2));
  };

  // Formatear fecha del sorteo
  const getDrawTime = (endDate: string) => {
    const date = new Date(endDate);
    const dayName = date.toLocaleDateString(i18n.language, { weekday: 'long' });
    const time = date.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' });
    return `${t('LOTTERY_LIST.draw')} ${dayName} ${time}`;
  };

  const handleWishlistToggle = (e: React.MouseEvent, lotteryGuid: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      showNotification('warning', t('COMMON.login_required', 'Inicia sesión'), t('WISHLIST.login_to_add', 'Inicia sesión para agregar a favoritos'));
      return;
    }
    toggleWishlist(lotteryGuid);
  };

  const handleCopyLink = async (e: React.MouseEvent, lotteryGuid: string) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/lottery/${lotteryGuid}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(lotteryGuid);
      showNotification('success', t('WISHLIST.link_copied', '¡Enlace copiado!'), '');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      showNotification('error', t('COMMON.error', 'Error'), t('WISHLIST.copy_failed', 'No se pudo copiar el enlace'));
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="row g-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="col-lg-4 col-md-6">
              <div className="current-lottery-itemv13 nw3-border position-relative radius24 n0-bg p-xxl-6 p-xl-4 p-3">
                {/* Image area */}
                <div className="lottery-skeleton-block radius24" style={{ height: '300px', width: '100%' }} />
                {/* Content area */}
                <div className="pt-xxl-6 pt-sm-4 pt-4">
                  <div className="d-flex align-items-center justify-content-between pb-xxl-3 pb-sm-3 pb-2 gap-3">
                    <div className="lottery-skeleton-block" style={{ height: '28px', width: '65%' }} />
                    <div
                      className="lottery-skeleton-block"
                      style={{ height: '44px', width: '44px', borderRadius: '50%' }}
                    />
                  </div>
                  <div className="lottery-skeleton-block mb-3" style={{ height: '24px', width: '45%' }} />
                  <div className="border-top opacity-25 mb-3" />
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="lottery-skeleton-block" style={{ height: '18px', width: '80px' }} />
                    <div className="lottery-skeleton-block" style={{ height: '18px', width: '100px' }} />
                  </div>
                  <div className="border-top opacity-25 mb-3" />
                  <div className="lottery-skeleton-block mb-2" style={{ height: '14px', width: '40%' }} />
                  <div
                    className="lottery-skeleton-block"
                    style={{ height: '4px', width: '100%', maxWidth: '296px', borderRadius: '4px' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (lotteries.length === 0) {
      return (
        <div className="text-center py-5">
          <h4 className="n3-clr">{t('LOTTERY_LIST.noLotteries')}</h4>
        </div>
      );
    }

    return (
      <div className="row g-6">
        {lotteries.map(lottery => {
          const soldPercent = getSoldPercentage(lottery.soldTickets, lottery.maxTickets);
          const remaining = lottery.maxTickets - lottery.soldTickets;

          return (
            <MotionFade key={lottery.lotteryGuid} className="col-lg-4 col-md-6">
              <div className="current-lottery-itemv13 current-lottery-v13before nw3-border position-relative radius24 n0-bg p-xxl-6 p-xl-4 p-3">
                <div className="thumb cus-z1 position-relative radius24 overflow-hidden">
                  <div className="current-l-badge cus-z1 d-flex align-items-center justify-content-between pe-xxl-5 pe-4">
                    <span className="cmn-draw-badge d-inline-blog act3-bg py-2 ps-xxl-5 ps-3 pe-8">
                      <span className="n4-clr position-relative fw_700 fs-eight">{getDrawTime(lottery.endDate)}</span>
                    </span>
                  </div>
                  <div className="cart-added d-grid align-items-center gap-xxl-3 gap-2">
                    <button
                      onClick={(e) => handleWishlistToggle(e, lottery.lotteryGuid)}
                      disabled={isAdding || isRemoving}
                      className="cmn-60 act3-bg d-center radius-circle n0-hover border-0"
                      style={{ cursor: 'pointer' }}
                      title={isInWishlist(lottery.lotteryGuid) ? t('WISHLIST.remove', 'Quitar de favoritos') : t('WISHLIST.add', 'Agregar a favoritos')}
                    >
                      <BookmarkSimpleIcon
                        weight={isInWishlist(lottery.lotteryGuid) ? 'fill' : 'bold'}
                        className={`ph-bold ph-bookmark-simple fs-five ${isInWishlist(lottery.lotteryGuid) ? 'act4-clr' : 'n4-clr'}`}
                      />
                    </button>
                    <button
                      onClick={(e) => handleCopyLink(e, lottery.lotteryGuid)}
                      className="cmn-60 act3-bg d-center radius-circle n0-hover border-0"
                      style={{ cursor: 'pointer' }}
                      title={t('WISHLIST.copy_link', 'Copiar enlace')}
                    >
                      <LinkIcon
                        weight="bold"
                        className={`ph-bold fs-five ${copiedId === lottery.lotteryGuid ? 'act4-clr' : 'n4-clr'}`}
                      />
                    </button>
                  </div>
                  {lottery.prizes?.[0]?.mainImageUrl ? (
                    <Image
                      src={lottery.prizes[0].mainImageUrl}
                      alt={lottery.title}
                      width={400}
                      height={300}
                      className="w-100"
                      style={{ objectFit: 'cover', height: '300px' }}
                    />
                  ) : (
                    <Image src={defaultImage} alt={lottery.title} className="w-100" />
                  )}
                </div>
                <div className="content-middle pt-xxl-6 pt-sm-4 pt-4">
                  <div className="d-flex flex-wrap align-items-center justify-content-between pb-xxl-3 pb-sm-3 pb-2 gap-3">
                    <h4>
                      <Link href={`/lottery/${lottery.lotteryGuid}`} className="n4-clr fw_700 act4-texthover">
                        {lottery.title}
                      </Link>
                    </h4>
                    <Link
                      href={`/lottery/${lottery.lotteryGuid}`}
                      className="kewta-btn kewta-44 d-inline-flex align-items-center"
                    >
                      <div className="kew-arrow kew-rotate n4-bg">
                        <div className="kt-one">
                          <ArrowRightIcon className="ti ti-arrow-right n0-clr" />
                        </div>
                        <div className="kt-two">
                          <ArrowRightIcon className="ti ti-arrow-right n0-clr" />
                        </div>
                      </div>
                    </Link>
                  </div>
                  <h3 className="d-flex align-items-center gap-3 n4-clr mb-xxl-4 mb-3">
                    <span className="pr fw_700">${lottery.ticketPrice.toFixed(2)}</span>
                    <span className="fs-six text-uppercase">{t('LOTTERY_LIST.perTicket')}</span>
                  </h3>
                  <div className="border-top" />
                  <ul className="remaining-info py-xxl-3 py-3 d-flex align-items-center gap-xxl-5 gap-lg-3 gap-2">
                    <li className="d-flex align-items-center gap-2">
                      <ClockIcon className="ph ph-clock fs-five n3-clr" />
                      <span className="n3-clr fw_600">{getDaysRemaining(lottery.endDate)}</span>
                    </li>
                    <li className="vline-remaing" />
                    <li className="d-flex align-items-center gap-2">
                      <BarbellIcon className="ph ph-barbell fs-five n3-clr" />
                      <span className="n3-clr fw_600">
                        {remaining} {t('LOTTERY_LIST.remaining')}
                      </span>
                    </li>
                  </ul>
                  <div className="border-top" />
                  <div className="cmn-prrice-range mt-xxl-4 mt-3 d-grid align-items-center gap-2">
                    <span className="n4-clr soldout fw_700 fs-eight mb-1">
                      {soldPercent}% {t('LOTTERY_LIST.sold')}
                    </span>
                    <div
                      className="position-relative"
                      style={{
                        background: 'rgba(85, 74, 255, 0.2)',
                        height: '4px',
                        borderRadius: '4px',
                        width: '100%',
                        maxWidth: '296px',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          height: '100%',
                          width: `${soldPercent}%`,
                          background: 'var(--s1)',
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </MotionFade>
          );
        })}
      </div>
    );
  };

  return (
    <section className="current-lotteryv13 pt-120 pb-120">
      <div className="container">
        {/* <!--Section Header--> */}
        <div className="row g-xl-4 g-3 align-items-center justify-content-between mb-xxl-15 mb-xl-10 mb-8">
          <div className="col-lg-6 col-md-8 col-sm-8">
            <div className="section__title text-sm-start text-center mb-lg-0 mb-4">
              <MotionFadeTopToDown className="subtitle-head mb-xxl-4 mb-sm-4 mb-3 d-flex flex-wrap align-items-center justify-content-sm-start justify-content-center gap-3">
                <Image src={icon} alt="img" />
                <h5 className="s1-clr fw_700">{t('LOTTERY_LIST.sectionLabel')}</h5>
              </MotionFadeTopToDown>
              <MotionFadeDownToTop>
                <h3 className="display-four d-block n4-clr">
                  {t('LOTTERY_LIST.titleMain')}{' '}
                  <span className="act4-clr act4-underline" data-aos="zoom-in-left" data-aos-duration="1000">
                    {t('LOTTERY_LIST.titleHighlight')}{' '}
                  </span>
                  <span className="d-block" data-aos="zoom-in-right" data-aos-duration="1200">
                    {t('LOTTERY_LIST.titleEnd')}
                  </span>
                </h3>
              </MotionFadeDownToTop>
            </div>
          </div>
          <div className="col-xl-2 col-lg-2 col-md-2 col-sm-2">
            <div className="browse-more" data-aos="zoom-in" data-aos-duration="2000">
              <Link
                href="contest"
                className="cmn__collection radius-circle act3-bg d-center position-relative ms-lg-auto"
              >
                <span className="cmn-cont-box text-center position-relative">
                  <span className="icon mb-1">
                    <ArrowUpRightIcon
                      weight="bold"
                      className="ph-bold ph-arrow-up-right n4-clr fs-three"
                    ></ArrowUpRightIcon>
                  </span>
                  <span className="d-block n4-clr fw_700">{t('LOTTERY_LIST.viewMore')}</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
        {/* <!--Section Header--> */}

        {/* <!--win lottery body--> */}
        {renderContent()}
        {/* <!--win lottery body--> */}
      </div>
    </section>
  );
};

export default LotteryList;
