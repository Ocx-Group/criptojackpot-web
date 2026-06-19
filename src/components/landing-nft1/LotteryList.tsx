'use client';

import icon from '@/../public/images/global/section-icon.png';
import { ArrowUpRightIcon } from '@phosphor-icons/react/dist/ssr';
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
import LotteryCard from '@/components/lottery/LotteryCard';

const LotteryList = () => {
  const { t } = useTranslation();

  const { data: lotteriesResponse, isLoading } = useQuery<PaginatedResponse<Lottery>, Error>({
    queryKey: ['lotteries-public'],
    queryFn: async () => {
      return lotteryService.getAllLotteries({ pageNumber: 1, pageSize: 6 });
    },
  });

  const lotteries = lotteriesResponse?.data?.items || [];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="row g-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="col-lg-4 col-md-6">
              <div className="current-lottery-itemv13 position-relative radius24 bg2-color p-xxl-6 p-xl-4 p-3">
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
          <h4 className="nw2-clr">{t('LOTTERY_LIST.noLotteries')}</h4>
        </div>
      );
    }

    return (
      <div className="row g-6">
        {lotteries.map(lottery => (
          <MotionFade key={lottery.lotteryGuid} className="col-lg-4 col-md-6 d-flex">
            <LotteryCard lottery={lottery} />
          </MotionFade>
        ))}
      </div>
    );
  };

  return (
    <section className="current-lotteryv13 bg1-color pt-120 pb-120">
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
                <h3 className="display-four d-block nw1-clr">
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
                href="/sorteos"
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
