'use client';

import defaultImage from '@/../public/images/man-global/nf1.png';
import { ArrowRightIcon, BarbellIcon, BookmarkSimpleIcon, LinkIcon } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { Lottery, LotteryType } from '@/interfaces/lottery';
import { useWishlist } from '@/features/user-panel/hooks/useWishlist';
import { useNotificationStore } from '@/store/notificationStore';
import { getLotteryText } from '@/utils/localizedContent';

interface LotteryCardProps {
  lottery: Lottery;
}

/**
 * Tarjeta de promoción — única fuente de verdad para mostrar un sorteo/promoción.
 * Usada en el landing (LotteryList) y en la página /sorteos.
 * El contenedor de columna/animación lo aporta el componente padre.
 */
const LotteryCard = ({ lottery }: LotteryCardProps) => {
  const { t, i18n } = useTranslation();
  const showNotification = useNotificationStore(state => state.show);
  const { isInWishlist, toggleWishlist, isAdding, isRemoving, isAuthenticated } = useWishlist();

  const lotteryTitle = getLotteryText(lottery, 'title', i18n.language);
  const isPick3 = lottery.type === LotteryType.Pick3;
  const soldPercent =
    lottery.maxTickets === 0 ? 0 : Number.parseFloat(((lottery.soldTickets / lottery.maxTickets) * 100).toFixed(1));
  const remaining = lottery.maxTickets - lottery.soldTickets;
  const typeLabel = isPick3 ? 'Pick 3' : t('SORTEOS.typeStandard', 'Promoción');

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      showNotification(
        'warning',
        t('COMMON.login_required', 'Inicia sesión'),
        t('WISHLIST.login_to_add', 'Inicia sesión para agregar a favoritos')
      );
      return;
    }
    toggleWishlist(lottery.lotteryGuid);
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`${globalThis.location.origin}/lottery/${lottery.lotteryGuid}`);
      showNotification('success', t('WISHLIST.link_copied', '¡Enlace copiado!'), '');
    } catch {
      showNotification('error', t('COMMON.error', 'Error'), '');
    }
  };

  return (
    <div className="current-lottery-itemv13 current-lottery-v13before position-relative radius24 bg2-color p-xxl-6 p-xl-4 p-3 d-flex flex-column w-100">
      {/* Image */}
      <div className="thumb cus-z1 position-relative radius24 overflow-hidden">
        {/* Type badge */}
        <span
          className="position-absolute fw_700 n0-clr"
          style={{
            top: '12px',
            right: '12px',
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '11px',
            background: isPick3 ? 'var(--act4)' : 'var(--s1)',
            zIndex: 2,
          }}
        >
          {typeLabel}
        </span>

        {/* Action buttons */}
        <div className="cart-added d-grid align-items-center gap-xxl-3 gap-2">
          <button
            onClick={handleWishlistToggle}
            disabled={isAdding || isRemoving}
            className="cmn-60 act3-bg d-center radius-circle n0-hover border-0"
            style={{ cursor: 'pointer' }}
          >
            <BookmarkSimpleIcon weight={isInWishlist(lottery.lotteryGuid) ? 'fill' : 'bold'} className="ph-bold fs-five" />
          </button>
          <button
            onClick={handleCopyLink}
            className="cmn-60 act3-bg d-center radius-circle n0-hover border-0"
            style={{ cursor: 'pointer' }}
          >
            <LinkIcon weight="bold" className="ph-bold fs-five" />
          </button>
        </div>

        {lottery.prizes?.[0]?.mainImageUrl ? (
          <Image
            src={lottery.prizes[0].mainImageUrl}
            alt={lotteryTitle}
            width={400}
            height={300}
            className="w-100"
            style={{ objectFit: 'cover', height: '300px' }}
          />
        ) : (
          <Image
            src={defaultImage}
            alt={lotteryTitle}
            className="w-100"
            style={{ objectFit: 'cover', height: '300px' }}
          />
        )}
      </div>

      {/* Content */}
      <div className="content-middle pt-xxl-6 pt-sm-4 pt-4 d-flex flex-column flex-grow-1">
        {/* Title & arrow */}
        <div className="d-flex flex-wrap align-items-center justify-content-between pb-xxl-3 pb-sm-3 pb-2 gap-3">
          <h4>
            <Link href={`/lottery/${lottery.lotteryGuid}`} className="nw1-clr fw_700 act4-texthover">
              {lotteryTitle}
            </Link>
          </h4>
          <Link href={`/lottery/${lottery.lotteryGuid}`} className="kewta-btn kewta-44 d-inline-flex align-items-center">
            <div className="kew-arrow kew-rotate s1-bg">
              <div className="kt-one">
                <ArrowRightIcon className="ti ti-arrow-right n0-clr" />
              </div>
              <div className="kt-two">
                <ArrowRightIcon className="ti ti-arrow-right n0-clr" />
              </div>
            </div>
          </Link>
        </div>

        {/* Price */}
        <h3 className="d-flex align-items-center gap-3 nw1-clr mb-xxl-4 mb-3">
          <span className="pr fw_700">${lottery.ticketPrice.toFixed(2)}</span>
          <span className="fs-six text-uppercase">{t('LOTTERY_LIST.perTicket')}</span>
        </h3>

        <div className="border-top" />

        {/* Tickets info */}
        <ul className="remaining-info py-xxl-3 py-3 d-flex align-items-center gap-xxl-5 gap-lg-3 gap-2">
          <li className="d-flex align-items-center gap-2">
            <BarbellIcon className="ph ph-barbell fs-five nw3-clr" />
            <span className="nw3-clr fw_600">
              {remaining} {t('LOTTERY_LIST.remaining')}
            </span>
          </li>
        </ul>

        <div className="border-top" />

        {/* Progress bar */}
        <div className="cmn-prrice-range mt-xxl-4 mt-3 d-grid align-items-center gap-2 mt-auto">
          <span className="nw1-clr soldout fw_700 fs-eight mb-1">
            {soldPercent}% {t('LOTTERY_LIST.sold')}
          </span>
          <div
            className="position-relative"
            style={{
              background: 'rgba(0, 229, 255, 0.2)',
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
                background: soldPercent > 75 ? 'var(--act4)' : 'var(--s1)',
                borderRadius: '4px',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LotteryCard;
