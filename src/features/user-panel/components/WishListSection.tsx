'use client';

import defaultImage from 'public/images/man-global/nf1.png';
import {
  ArrowUpRightIcon,
  BarbellIcon,
  BookmarkSimpleIcon,
  CaretLeftIcon,
  CaretRightIcon,
  ClockIcon,
  LinkIcon,
} from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import MotionFade from '../../../components/motionEffect/MotionFade';
import Link from 'next/link';
import { useWishlist } from '../hooks/useWishlist';
import { Lottery } from '@/interfaces/lottery';
import { toast } from 'react-toastify';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ITEMS_PER_PAGE = 4;

const WishListSection = () => {
  const { t } = useTranslation();
  const { lotteries, isLoading, removeFromWishlist, isRemoving } = useWishlist();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(lotteries.length / ITEMS_PER_PAGE)), [lotteries.length]);

  const paginatedLotteries = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return lotteries.slice(start, start + ITEMS_PER_PAGE);
  }, [lotteries, currentPage]);

  const handleCopyLink = (lottery: Lottery) => {
    const url = `${window.location.origin}/lottery/${lottery.lotteryGuid}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success(t('WISH_LIST.linkCopied'));
      })
      .catch(() => {
        toast.error(t('WISH_LIST.copyError'));
      });
  };

  const handleRemove = (lotteryGuid: string) => {
    removeFromWishlist(lotteryGuid);
  };

  const calculateDaysRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return Math.max(days, 0);
  };

  const getDrawStatus = (lottery: Lottery) => {
    const days = calculateDaysRemaining(lottery.endDate);
    if (days === 0) return t('WISH_LIST.drawToday');
    if (days === 1) return t('WISH_LIST.drawTomorrow');
    return t('WISH_LIST.drawInDays', { days });
  };

  const getSoldPercentage = (lottery: Lottery) => {
    if (lottery.maxTickets === 0) return 0;
    return parseFloat(((lottery.soldTickets / lottery.maxTickets) * 100).toFixed(1));
  };

  const getImageSrc = (lottery: Lottery) => {
    return lottery.prizes?.[0]?.mainImageUrl || defaultImage;
  };

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
      <div className="cmn-box-addingbg win40-ragba border radius24 py-xxl-10 py-xl-8 py-lg-6 py-5 px-xxl-8 px-xl-6 px-sm-5 px-4">
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
              {paginatedLotteries.map((lottery, index) => {
                const soldPct = getSoldPercentage(lottery);
                const daysLeft = calculateDaysRemaining(lottery.endDate);
                const remaining = lottery.maxTickets - lottery.soldTickets;

                return (
                  <MotionFade
                    className="col-lg-6 col-md-6"
                    data-aos="zoom-in-up"
                    data-aos-duration={String(1400 + index * 200)}
                    key={lottery.lotteryGuid}
                  >
                    <div className="current-lottery-item cmn-cartborder current-bg position-relative radius24">
                      <div className="current-l-badge position-relative cus-z1 mb-xxl-10 mb-xl-8 mb-lg-6 mb-4 d-flex align-items-center justify-content-between pt-xxl-5 pt-4 pe-xxl-5 pe-4">
                        <span className="draw-badge n4-clr">
                          <span className="n4-clr position-relative fw_700 fs-eight">{getDrawStatus(lottery)}</span>
                        </span>
                        <button
                          onClick={() => handleCopyLink(lottery)}
                          className="cmn-40 n0-bg radius-circle n0-hover border-0"
                          title={t('WISH_LIST.copyLink')}
                          style={{ cursor: 'pointer' }}
                        >
                          <LinkIcon weight="bold" className="ph-bold ph-link n4-clr fs-six" />
                        </button>
                      </div>
                      <div className="thumb cus-z1 position-relative px-3 mb-xxl-10 mb-xl-8 mb-lg-6 mb-4">
                        {typeof getImageSrc(lottery) === 'string' ? (
                          <Image
                            src={getImageSrc(lottery) as string}
                            alt={lottery.title}
                            width={400}
                            height={300}
                            className="w-100"
                            style={{ objectFit: 'cover', height: '300px', borderRadius: '12px' }}
                          />
                        ) : (
                          <Image src={defaultImage} alt={lottery.title} className="w-100" />
                        )}
                      </div>
                      <div className="content-middle">
                        <div className="cmn-prrice-range px-xxl-6 px-xl-5 px-lg-4 px-3 d-flex align-items-center gap-2">
                          <div className="range-custom position-relative">
                            <span className="curs-range" style={{ width: `${soldPct}%` }}></span>
                          </div>
                          <span className="n4-clr soldout fw_700 fs-eight">
                            {soldPct}% {t('WISH_LIST.sold')}
                          </span>
                        </div>
                        <div className="d-flex px-xxl-6 px-xl-5 px-lg-4 px-3 nw4-bb py-xxl-5 py-sm-4 py-3 flex-wrap gap-3 align-items-center justify-content-between">
                          <div className="box">
                            <h4 className="mb-xxl-3 mb-2">
                              <Link href={`/lottery/${lottery.lotteryGuid}`} className="n4-clr">
                                {lottery.title}
                              </Link>
                            </h4>
                          </div>
                          <button
                            onClick={() => handleRemove(lottery.lotteryGuid)}
                            disabled={isRemoving}
                            className="cmn-40 radius-circle act4-border n0-fillhover border-0 bg-transparent"
                            title={t('WISH_LIST.removeFromWishlist')}
                            style={{ cursor: 'pointer' }}
                          >
                            <BookmarkSimpleIcon weight="fill" className="ph-fill ph-bookmark-simple act4-clr" />
                          </button>
                        </div>
                        <ul className="remaining-info px-xxl-6 px-xl-5 px-lg-4 px-3 py-xxl-5 py-xl-3 py-2 nw4-bb d-flex align-items-center gap-xxl-5 gap-lg-3 gap-2">
                          <li className="d-flex align-items-center gap-2">
                            <ClockIcon className="ph ph-clock fs-five n3-clr" />
                            <span className="n3-clr fw_600">
                              {daysLeft} {daysLeft === 1 ? t('WISH_LIST.day') : t('WISH_LIST.days')}
                            </span>
                          </li>
                          <li className="vline-remaing"></li>
                          <li className="d-flex align-items-center gap-2">
                            <BarbellIcon className="ph ph-barbell fs-five n3-clr" />
                            <span className="n3-clr fw_600">
                              {remaining} {t('WISH_LIST.remaining')}
                            </span>
                          </li>
                        </ul>
                        <div className="d-flex px-xxl-6 px-xl-5 px-lg-4 px-3 py-xxl-8 py-xl-6 py-lg-4 py-3 align-items-center justify-content-between">
                          <h3 className="d-flex align-items-center gap-3 n4-clr">
                            <span className="pr">${lottery.ticketPrice.toFixed(2)}</span>
                            <span className="fs-six text-uppercase">{t('WISH_LIST.perEntry')}</span>
                          </h3>
                          <Link
                            href={`/lottery/${lottery.lotteryGuid}`}
                            className="cmn-40 radius-circle s1-bg s1-hover"
                          >
                            <span>
                              <ArrowUpRightIcon weight="bold" className="ph-bold ph-arrow-up-right n0-clr lh" />
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </MotionFade>
                );
              })}
            </div>

            {totalPages > 1 && (
              <ul className="custom-pagination pt-xxl-15 pt-xl-10 pt-8 d-flex align-items-center justify-content-center gap-xxl-3 gap-2">
                <li>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="cmn-60 d-center radius-circle nw1-clr n2-bg border-0"
                    style={{ cursor: currentPage === 1 ? 'default' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
                  >
                    <CaretLeftIcon className="ph ph-caret-left nw1-clr fs20" />
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
                  >
                    <CaretRightIcon className="ph ph-caret-right nw1-clr fs20" />
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
