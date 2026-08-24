'use client';

import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import MotionFade from '../../../components/motionEffect/MotionFade';
import LotteryCard from '@/components/lottery/LotteryCard';
import { useWishlist } from '../hooks/useWishlist';

const ITEMS_PER_PAGE = 4;

const WishListSection = () => {
  const { t } = useTranslation();
  const { lotteries, isLoading } = useWishlist();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(lotteries.length / ITEMS_PER_PAGE)), [lotteries.length]);

  const paginatedLotteries = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return lotteries.slice(start, start + ITEMS_PER_PAGE);
  }, [lotteries, currentPage]);

  if (isLoading) {
    return (
      <div className="col-xxl-9 col-xl-8 col-lg-8">
        <div className="cmn-box-addingbg win40-ragba border radius24 py-xxl-10 py-xl-8 py-lg-6 py-5 px-xxl-8 px-xl-6 px-sm-5 px-4">
          <h3 className="user-title n4-clr mb-xxl-10 mb-xl-8 mb-lg-6 mb-5">{t('WISH_LIST.title')}</h3>
          <div className="d-flex justify-content-center py-10">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">{t('WISH_LIST.loading')}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-xxl-9 col-xl-8 col-lg-8">
      <div
        className="cmn-box-addingbg win40-ragba border radius24 py-xxl-10 py-xl-8 py-lg-6 py-5 px-xxl-8 px-xl-6 px-sm-5 px-4"
        style={{ background: 'var(--bg1)' }}
      >
        <h3 className="user-title n4-clr mb-xxl-10 mb-xl-8 mb-lg-6 mb-5">{t('WISH_LIST.title')}</h3>

        {lotteries.length === 0 ? (
          <div className="text-center py-10">
            <p className="n3-clr fs-five">{t('WISH_LIST.empty')}</p>
            <Link href="/landing-page" className="cmn-btn secondary-alt third-alt d-center gap-2 mt-4">
              {t('WISH_LIST.browseLotteries')}
            </Link>
          </div>
        ) : (
          <>
            <div className="row g-xl-6 g-4">
              {paginatedLotteries.map((lottery, index) => (
                <MotionFade
                  className="col-lg-6 col-md-6 d-flex"
                  data-aos="zoom-in-up"
                  data-aos-duration={String(1400 + index * 200)}
                  key={lottery.lotteryGuid}
                >
                  <LotteryCard lottery={lottery} />
                </MotionFade>
              ))}
            </div>

            {totalPages > 1 && (
              <ul className="custom-pagination pt-xxl-15 pt-xl-10 pt-8 d-flex align-items-center justify-content-center gap-xxl-3 gap-2">
                <li>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="cmn-60 d-center radius-circle nw1-clr n2-bg border-0"
                    style={{ cursor: currentPage === 1 ? 'default' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
                    aria-label={t('COMMON.previous_page', 'Página anterior')}
                    title={t('COMMON.previous_page', 'Página anterior')}
                  >
                    <CaretLeftIcon className="ph ph-caret-left nw1-clr fs20" aria-hidden="true" />
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <li key={page}>
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`cmn-60 d-center radius-circle nw1-clr n2-bg fs20 fw_700 border-0 ${currentPage === page ? 'active' : ''}`}
                      style={{ cursor: 'pointer' }}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="cmn-60 d-center radius-circle nw1-clr n2-bg border-0"
                    style={{
                      cursor: currentPage === totalPages ? 'default' : 'pointer',
                      opacity: currentPage === totalPages ? 0.5 : 1,
                    }}
                    aria-label={t('COMMON.next_page', 'Página siguiente')}
                    title={t('COMMON.next_page', 'Página siguiente')}
                  >
                    <CaretRightIcon className="ph ph-caret-right nw1-clr fs20" aria-hidden="true" />
                  </button>
                </li>
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WishListSection;
