'use client';

import {
  FunnelIcon,
  MagnifyingGlassIcon,
  GameControllerIcon,
  TicketIcon,
  HashIcon,
} from '@phosphor-icons/react/dist/ssr';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { lotteryService } from '@/services';
import { Lottery, LotteryType, LotteryStatus } from '@/interfaces/lottery';
import { PaginatedResponse } from '@/interfaces/paginatedResponse';
import NavbarBlack from '@/components/navbar/NavbarBlack';
import Jewellery1Footer from '@/components/landing-jewellery1/Jewellery1Footer';
import { CartButton, CartSidebar } from '@/components/cart';
import LotteryCard from '@/components/lottery/LotteryCard';

type FilterType = 'all' | 'standard' | 'pick3';
type FilterStatus = 'all' | 'active' | 'completed' | 'upcoming';
type SortBy = 'newest' | 'ending_soon' | 'price_low' | 'price_high' | 'most_sold';

const SorteosPage = () => {
  const { t } = useTranslation();

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

  const getSoldPercentage = (sold: number, max: number) => {
    if (max === 0) return 0;
    return Number.parseFloat(((sold / max) * 100).toFixed(1));
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
        label: t('SORTEOS.filterStandard', 'Promociones'),
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

  const renderCard = (lottery: Lottery) => (
    <div key={lottery.lotteryGuid} className="col-xl-3 col-lg-4 col-md-6 d-flex">
      <LotteryCard lottery={lottery} />
    </div>
  );

  return (
    <div>
      <NavbarBlack forceDark />
      <CartSidebar />
      <CartButton />

      <section className="current-lotteryv13 sorteos-section bg1-color pt-120 pb-120" style={{ minHeight: '100vh' }}>
        <div className="container">
          {/* Header */}
          <div className="row g-xl-4 g-3 align-items-center justify-content-between mb-xxl-15 mb-xl-10 mb-8">
            <div className="col-lg-8">
              <div className="section__title">
                <h5 className="s1-clr fw_700">
                  {t('SORTEOS.subtitle', 'Explora todas nuestras promociones y juegos disponibles')}
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
                  <div className="current-lottery-itemv13 position-relative radius24 bg2-color p-xxl-6 p-xl-4 p-3">
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
