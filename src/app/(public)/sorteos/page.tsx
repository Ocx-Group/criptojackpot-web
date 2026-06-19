'use client';

import defaultImage from '@/../public/images/man-global/nf1.png';
import {
  ArrowRightIcon,
  BookmarkSimpleIcon,
  ClockIcon,
  BarbellIcon,
  FunnelIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  GameControllerIcon,
  TicketIcon,
  HashIcon,
} from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { lotteryService } from '@/services';
import { Lottery, LotteryType, LotteryStatus } from '@/interfaces/lottery';
import { PaginatedResponse } from '@/interfaces/paginatedResponse';
import NavbarBlack from '@/components/navbar/NavbarBlack';
import Jewellery1Footer from '@/components/landing-jewellery1/Jewellery1Footer';
import { useWishlist } from '@/features/user-panel/hooks/useWishlist';
import { useNotificationStore } from '@/store/notificationStore';
import { CartButton, CartSidebar } from '@/components/cart';

type FilterType = 'all' | 'standard' | 'pick3';
type FilterStatus = 'all' | 'active' | 'completed' | 'upcoming';
type SortBy = 'newest' | 'ending_soon' | 'price_low' | 'price_high' | 'most_sold';

const SorteosPage = () => {
  const { t, i18n } = useTranslation();
  const showNotification = useNotificationStore(state => state.show);
  const { isInWishlist, toggleWishlist, isAdding, isRemoving, isAuthenticated } = useWishlist();

  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const { data: lotteriesResponse, isLoading } = useQuery<PaginatedResponse<Lottery>, Error>({
    queryKey: ['sorteos-all', page],
    queryFn: () => lotteryService.getAllLotteries({ pageNumber: page, pageSize: 100 }),
  });

  const allLotteries = useMemo(() => lotteriesResponse?.data?.items || [], [lotteriesResponse]);

  const filteredLotteries = useMemo(() => {
    let result = [...allLotteries];

    if (filterType === 'standard') {
      result = result.filter(l => l.type !== LotteryType.Pick3);
    } else if (filterType === 'pick3') {
      result = result.filter(l => l.type === LotteryType.Pick3);
    }

    if (filterStatus === 'active') {
      result = result.filter(l => l.status === LotteryStatus.Active);
    } else if (filterStatus === 'completed') {
      result = result.filter(l => l.status === LotteryStatus.Completed);
    } else if (filterStatus === 'upcoming') {
      result = result.filter(l => l.status === LotteryStatus.Draft || new Date(l.startDate) > new Date());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        l =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.lotteryNo.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'ending_soon':
        result.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
        break;
      case 'price_low':
        result.sort((a, b) => a.ticketPrice - b.ticketPrice);
        break;
      case 'price_high':
        result.sort((a, b) => b.ticketPrice - a.ticketPrice);
        break;
      case 'most_sold':
        result.sort((a, b) => b.soldTickets / b.maxTickets - a.soldTickets / a.maxTickets);
        break;
    }

    return result;
  }, [allLotteries, filterType, filterStatus, sortBy, searchQuery]);

  const totalPages = Math.ceil(filteredLotteries.length / pageSize);
  const paginatedLotteries = filteredLotteries.slice((page - 1) * pageSize, page * pageSize);

  const stats = useMemo(
    () => ({
      total: allLotteries.length,
      standard: allLotteries.filter(l => l.type !== LotteryType.Pick3).length,
      pick3: allLotteries.filter(l => l.type === LotteryType.Pick3).length,
      active: allLotteries.filter(l => l.status === LotteryStatus.Active).length,
    }),
    [allLotteries]
  );

  const getDaysRemaining = (endDate: string) => {
    const days = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days < 0) return t('LOTTERY_LIST.ended');
    if (days === 0) return t('LOTTERY_LIST.today');
    if (days === 1) return t('LOTTERY_LIST.oneDay');
    return t('LOTTERY_LIST.days', { count: days });
  };

  const getSoldPercentage = (sold: number, max: number) => {
    if (max === 0) return 0;
    return Number.parseFloat(((sold / max) * 100).toFixed(1));
  };

  const getDrawTime = (endDate: string) => {
    const date = new Date(endDate);
    const dayName = date.toLocaleDateString(i18n.language, { weekday: 'short' });
    const time = date.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' });
    return `${dayName} ${time}`;
  };

  const getTypeLabel = (type: LotteryType) => {
    return type === LotteryType.Pick3 ? 'Pick 3' : t('SORTEOS.typeStandard', 'Rifa');
  };

  const handleWishlistToggle = (e: React.MouseEvent, lotteryGuid: string) => {
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
    toggleWishlist(lotteryGuid);
  };

  const handleCopyLink = async (e: React.MouseEvent, lotteryGuid: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`${globalThis.location.origin}/lottery/${lotteryGuid}`);
      showNotification('success', t('WISHLIST.link_copied', '¡Enlace copiado!'), '');
    } catch {
      showNotification('error', t('COMMON.error', 'Error'), '');
    }
  };

  const renderTypeFilterButtons = () => {
    const types: { key: FilterType; icon: React.ReactNode; label: string; count: number }[] = [
      {
        key: 'all',
        icon: <GameControllerIcon weight="bold" className="fs-five" />,
        label: t('SORTEOS.filterAll', 'Todos'),
        count: stats.total,
      },
      {
        key: 'standard',
        icon: <TicketIcon weight="bold" className="fs-five" />,
        label: t('SORTEOS.filterStandard', 'Rifas'),
        count: stats.standard,
      },
      { key: 'pick3', icon: <HashIcon weight="bold" className="fs-five" />, label: 'Pick 3', count: stats.pick3 },
    ];

    return (
      <div className="d-flex flex-wrap gap-2">
        {types.map(({ key, icon, label, count }) => (
          <button
            key={key}
            onClick={() => {
              setFilterType(key);
              setPage(1);
            }}
            className={`d-flex align-items-center gap-2 px-3 py-2 border-0 fw_600 ${
              filterType === key ? 's1-bg n0-clr' : 'nw3-border n3-clr'
            }`}
            style={{
              borderRadius: '12px',
              fontSize: '13px',
              background: filterType === key ? 'var(--s1)' : 'var(--bg1)',
              color: filterType === key ? 'var(--n0)' : 'var(--nw2)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
          >
            {icon}
            {label}
            <span
              style={{
                background: filterType === key ? 'rgba(255,255,255,0.25)' : 'rgba(0,229,255,0.1)',
                color: filterType === key ? '#fff' : 'var(--s1)',
                padding: '1px 8px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              {count}
            </span>
          </button>
        ))}
      </div>
    );
  };

  const renderCard = (lottery: Lottery) => {
    const soldPercent = getSoldPercentage(lottery.soldTickets, lottery.maxTickets);
    const remaining = lottery.maxTickets - lottery.soldTickets;
    const isPick3 = lottery.type === LotteryType.Pick3;

    return (
      <div key={lottery.lotteryGuid} className="col-xl-3 col-lg-4 col-md-6 d-flex">
        <div className="current-lottery-itemv13 current-lottery-v13before nw3-border position-relative radius24 n0-bg p-xxl-6 p-xl-4 p-3 d-flex flex-column w-100">
          {/* Image */}
          <div className="thumb cus-z1 position-relative radius24 overflow-hidden">
            {/* Draw time badge */}
            <div className="current-l-badge cus-z1 d-flex align-items-center justify-content-between pe-xxl-5 pe-4">
              <span className="cmn-draw-badge d-inline-block act3-bg py-2 ps-xxl-5 ps-3 pe-8">
                <span className="n4-clr position-relative fw_700 fs-eight">{getDrawTime(lottery.endDate)}</span>
              </span>
            </div>

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
              {getTypeLabel(lottery.type)}
            </span>

            {/* Action buttons */}
            <div className="cart-added d-grid align-items-center gap-xxl-3 gap-2">
              <button
                onClick={e => handleWishlistToggle(e, lottery.lotteryGuid)}
                disabled={isAdding || isRemoving}
                className="cmn-60 act3-bg d-center radius-circle n0-hover border-0"
                style={{ cursor: 'pointer' }}
              >
                <BookmarkSimpleIcon
                  weight={isInWishlist(lottery.lotteryGuid) ? 'fill' : 'bold'}
                  className="ph-bold fs-five"
                />
              </button>
              <button
                onClick={e => handleCopyLink(e, lottery.lotteryGuid)}
                className="cmn-60 act3-bg d-center radius-circle n0-hover border-0"
                style={{ cursor: 'pointer' }}
              >
                <LinkIcon weight="bold" className="ph-bold fs-five" />
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
              <Image
                src={defaultImage}
                alt={lottery.title}
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

            {/* Price */}
            <h3 className="d-flex align-items-center gap-3 n4-clr mb-xxl-4 mb-3">
              <span className="pr fw_700">${lottery.ticketPrice.toFixed(2)}</span>
              <span className="fs-six text-uppercase">{t('LOTTERY_LIST.perTicket')}</span>
            </h3>

            <div className="border-top" />

            {/* Time remaining & tickets info */}
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

            {/* Progress bar */}
            <div className="cmn-prrice-range mt-xxl-4 mt-3 d-grid align-items-center gap-2 mt-auto">
              <span className="n4-clr soldout fw_700 fs-eight mb-1">
                {soldPercent}% {t('LOTTERY_LIST.sold')}
              </span>
              <div
                style={{
                  background: 'rgba(0, 229, 255, 0.2)',
                  height: '4px',
                  borderRadius: '4px',
                  width: '100%',
                  maxWidth: '296px',
                  position: 'relative',
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
      </div>
    );
  };

  return (
    <div>
      <NavbarBlack forceDark />
      <CartSidebar />
      <CartButton />

      <section className="current-lotteryv13 bg1-color pt-120 pb-120" style={{ minHeight: '100vh' }}>
        <div className="container">
          {/* Header */}
          <div className="row g-xl-4 g-3 align-items-center justify-content-between mb-xxl-15 mb-xl-10 mb-8">
            <div className="col-lg-8">
              <div className="section__title">
                <h5 className="s1-clr fw_700">
                  {t('SORTEOS.subtitle', 'Explora todas nuestras rifas y juegos disponibles')}
                </h5>
                <h3 className="display-four d-block nw1-clr">
                  {t('SORTEOS.title', 'Promociones')}{' '}
                  <span className="act4-clr act4-underline">{t('SORTEOS.titleHighlight', '& Pick 3')}</span>
                </h3>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="nw3-border radius24 bg2-color p-xxl-5 p-4 mb-xxl-10 mb-8">
            <div className="row g-3 align-items-center">
              <div className="col-12 col-lg-5">{renderTypeFilterButtons()}</div>

              <div className="col-6 col-lg-2">
                <select
                  value={filterStatus}
                  onChange={e => {
                    setFilterStatus(e.target.value as FilterStatus);
                    setPage(1);
                  }}
                  className="form-select fw_600 nw1-clr"
                  style={{
                    borderRadius: '12px',
                    fontSize: '13px',
                    height: '44px',
                    background: 'var(--bg1)',
                    border: '1px solid var(--nw4)',
                  }}
                >
                  <option value="all">{t('SORTEOS.statusAll', 'Estado: Todos')}</option>
                  <option value="active">{t('SORTEOS.statusActive', 'Activos')}</option>
                  <option value="completed">{t('SORTEOS.statusCompleted', 'Completados')}</option>
                  <option value="upcoming">{t('SORTEOS.statusUpcoming', 'Próximos')}</option>
                </select>
              </div>

              <div className="col-6 col-lg-2">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as SortBy)}
                  className="form-select fw_600 nw1-clr"
                  style={{
                    borderRadius: '12px',
                    fontSize: '13px',
                    height: '44px',
                    background: 'var(--bg1)',
                    border: '1px solid var(--nw4)',
                  }}
                >
                  <option value="newest">{t('SORTEOS.sortNewest', 'Más recientes')}</option>
                  <option value="ending_soon">{t('SORTEOS.sortEndingSoon', 'Por terminar')}</option>
                  <option value="price_low">{t('SORTEOS.sortPriceLow', 'Menor precio')}</option>
                  <option value="price_high">{t('SORTEOS.sortPriceHigh', 'Mayor precio')}</option>
                  <option value="most_sold">{t('SORTEOS.sortMostSold', 'Más vendidos')}</option>
                </select>
              </div>

              <div className="col-12 col-lg-3">
                <div className="position-relative">
                  <MagnifyingGlassIcon
                    weight="bold"
                    className="position-absolute n3-clr"
                    style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    placeholder={t('SORTEOS.searchPlaceholder', 'Buscar promoción...')}
                    className="form-control fw_600 nw1-clr"
                    style={{
                      borderRadius: '12px',
                      fontSize: '13px',
                      height: '44px',
                      background: 'var(--bg1)',
                      border: '1px solid var(--nw4)',
                      paddingLeft: '40px',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <span className="nw2-clr fw_600 fs-eight">
              {filteredLotteries.length} {t('SORTEOS.results', 'resultados')}
              {searchQuery && <span> — &quot;{searchQuery}&quot;</span>}
            </span>
            {(filterType !== 'all' || filterStatus !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setFilterType('all');
                  setFilterStatus('all');
                  setSearchQuery('');
                  setSortBy('newest');
                  setPage(1);
                }}
                className="border-0 fw_600 s1-clr"
                style={{ background: 'transparent', fontSize: '13px', cursor: 'pointer' }}
              >
                <FunnelIcon weight="bold" className="me-1" />
                {t('SORTEOS.clearFilters', 'Limpiar filtros')}
              </button>
            )}
          </div>

          {/* Grid */}
          {isLoading && (
            <div className="row g-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="col-xl-3 col-lg-4 col-md-6">
                  <div className="current-lottery-itemv13 nw3-border position-relative radius24 n0-bg p-xxl-6 p-xl-4 p-3">
                    <div className="lottery-skeleton-block radius24" style={{ height: '300px', width: '100%' }} />
                    <div className="pt-xxl-6 pt-sm-4 pt-4">
                      <div className="d-flex align-items-center justify-content-between pb-xxl-3 pb-sm-3 pb-2 gap-3">
                        <div className="lottery-skeleton-block" style={{ height: '28px', width: '65%' }} />
                        <div
                          className="lottery-skeleton-block"
                          style={{ height: '44px', width: '44px', borderRadius: '50%' }}
                        />
                      </div>
                      <div className="lottery-skeleton-block mb-3" style={{ height: '24px', width: '40%' }} />
                      <div className="lottery-skeleton-block mb-3" style={{ height: '1px', width: '100%' }} />
                      <div className="lottery-skeleton-block mb-3" style={{ height: '20px', width: '80%' }} />
                      <div
                        className="lottery-skeleton-block"
                        style={{ height: '4px', width: '100%', borderRadius: '4px' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && paginatedLotteries.length === 0 && (
            <div className="text-center py-5">
              <GameControllerIcon weight="thin" className="nw3-clr" style={{ fontSize: '64px', marginBottom: '16px' }} />
              <h4 className="nw1-clr">{t('SORTEOS.noResults', 'No se encontraron promociones')}</h4>
              <p className="nw3-clr" style={{ fontSize: '14px' }}>
                {t('SORTEOS.noResultsDesc', 'Intenta con otros filtros o busca algo diferente')}
              </p>
            </div>
          )}

          {!isLoading && paginatedLotteries.length > 0 && (
            <div className="row g-6">{paginatedLotteries.map(renderCard)}</div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center gap-2 mt-xxl-10 mt-5">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="border-0 fw_600 px-3 py-2 nw4-border nw1-clr"
                style={{
                  borderRadius: '12px',
                  fontSize: '13px',
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                  background: 'var(--bg2)',
                  opacity: page === 1 ? 0.4 : 1,
                }}
              >
                ← {t('SORTEOS.prev', 'Anterior')}
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className="border-0 fw_700"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    background: page === p ? 'var(--s1)' : 'var(--bg2)',
                    color: page === p ? 'var(--n0)' : 'var(--nw1)',
                    border: page === p ? 'none' : '1px solid var(--nw4)',
                  }}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="border-0 fw_600 px-3 py-2 nw4-border nw1-clr"
                style={{
                  borderRadius: '12px',
                  fontSize: '13px',
                  cursor: page === totalPages ? 'not-allowed' : 'pointer',
                  background: 'var(--bg2)',
                  opacity: page === totalPages ? 0.4 : 1,
                }}
              >
                {t('SORTEOS.next', 'Siguiente')} →
              </button>
            </div>
          )}
        </div>
      </section>

      <Jewellery1Footer />
    </div>
  );
};

export default SorteosPage;
