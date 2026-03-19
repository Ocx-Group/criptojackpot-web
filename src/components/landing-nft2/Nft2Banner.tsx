'use client';
import bannerV14 from '@/../public/images/banner/banner-v14-simble.png';
import banner14 from '@/../public/images/banner/bitcoin-banner5.png';
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { lotteryService } from '@/services';
import { Lottery } from '@/interfaces/lottery';
import { PaginatedResponse } from '@/interfaces/paginatedResponse';
import Counter from '../Counter';
import MotionFade from '../motionEffect/MotionFade';
import MotionStaggerEffectUl from '../motionEffect/MotionStaggerEffectUl';

const Nft2Banner = () => {
  const { t } = useTranslation();

  const { data: lotteriesResponse } = useQuery<PaginatedResponse<Lottery>, Error>({
    queryKey: ['lotteries-banner'],
    queryFn: () => lotteryService.getAllLotteries({ pageNumber: 1, pageSize: 10 }),
  });

  const bannerImages = useMemo(() => {
    return (lotteriesResponse?.data?.items || [])
      .filter(l => l.prizes?.[0]?.mainImageUrl)
      .map(l => ({ src: l.prizes[0].mainImageUrl, alt: l.title }));
  }, [lotteriesResponse]);

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (bannerImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannerImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  return (
    <div className="banner-section-v14 pt-70-fixed position-relative overflow-hidden">
      {/* <!--Banner Content --> */}
      <div className="banner-v14wraper pb-20 pt-xxl-6">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-8">
              <div className="banner-content-v14 pt-xxl-20 pt-12 mt-xl-6 mt-md-6 mt-0 position-relative">
                <div className="d-flex mb-sm-4 mb-4 align-items-center gap-xxl-8 gap-lg-6 gap-4 flex-wrap">
                  <ul className="entry-win d-flex align-items-center gap-3">
                    <MotionStaggerEffectUl
                      id={1}
                      className="entry-win-item"
                      data-aos="fade-down-right"
                      data-aos-duration="1000"
                    >
                      <Link href="#" className="fs-four p1-clr">
                        {t('BANNER.step1')}
                      </Link>
                    </MotionStaggerEffectUl>
                    <MotionStaggerEffectUl
                      id={2}
                      className="entry-win-item"
                      data-aos="fade-down-right"
                      data-aos-duration="1200"
                    >
                      <ArrowRightIcon className="ti ti-arrow-right fs-four p1-clr"></ArrowRightIcon>
                    </MotionStaggerEffectUl>
                    <MotionStaggerEffectUl
                      id={3}
                      className="entry-win-item"
                      data-aos="fade-down-right"
                      data-aos-duration="1400"
                    >
                      <Link href="#" className="fs-four p1-clr">
                        {t('BANNER.step2')}
                      </Link>
                    </MotionStaggerEffectUl>
                    <MotionStaggerEffectUl
                      id={4}
                      className="entry-win-item"
                      data-aos="fade-down-right"
                      data-aos-duration="1600"
                    >
                      <ArrowRightIcon className="ti ti-arrow-right fs-four p1-clr"></ArrowRightIcon>
                    </MotionStaggerEffectUl>
                    <MotionStaggerEffectUl
                      id={5}
                      className="entry-win-item"
                      data-aos="fade-down-right"
                      data-aos-duration="2000"
                    >
                      <Link href="#" className="fs-four p1-clr">
                        {t('BANNER.step3')}
                      </Link>
                    </MotionStaggerEffectUl>
                  </ul>
                  <Link href="/landing-page" className="custom-bigarrow">
                    <span className="icon">
                      <svg width="137" height="16" viewBox="0 0 137 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M136.707 8.70712C137.098 8.31659 137.098 7.68343 136.707 7.29291L130.343 0.928944C129.953 0.538419 129.319 0.538419 128.929 0.928943C128.538 1.31947 128.538 1.95263 128.929 2.34316L134.586 8.00001L128.929 13.6569C128.538 14.0474 128.538 14.6806 128.929 15.0711C129.319 15.4616 129.953 15.4616 130.343 15.0711L136.707 8.70712ZM-8.74228e-08 9L136 9.00001L136 7.00001L8.74228e-08 7L-8.74228e-08 9Z"
                          fill="white"
                        />
                      </svg>
                    </span>
                  </Link>
                </div>
                <div className="bn-content-box">
                  <MotionFade className="display-one position-relative cus-z1 fw_800 text-capitalize nw1-clr mb-xxl-6 mb-lg-4 mb-3">
                    <span className="fw_800 text-capitalize d-block" data-aos="zoom-in" data-aos-duration="1800">
                      {t('BANNER.titleLine1')}{' '}
                    </span>
                    <span className="d-flex align-items-center gap-xxl-4 gap-3 fw_800 text-capitalize">
                      {t('BANNER.titleLine2')}
                      <span className="nft-text position-relative text-uppercase act4-clr">
                        {t('BANNER.titleHighlight')}
                        <span className="nft-border">
                          <svg
                            width="141"
                            height="6"
                            viewBox="0 0 141 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M1 5C22.8731 2.55684 81.2954 -1.30336 140 2.80115" stroke="#FF650E" />
                          </svg>
                        </span>
                      </span>
                    </span>
                  </MotionFade>
                  <p
                    className="nw2-clr fs20 max-520 mb-xxl-10 mb-lg-8 mb-5"
                    data-aos="fade-down-right"
                    data-aos-duration="1500"
                  >
                    {t('BANNER.description')}
                  </p>
                  <Link
                    href="/login"
                    className="kewta-btn kewta-alt d-inline-flex align-items-center"
                    data-aos="zoom-in-right"
                    data-aos-duration="1000"
                  >
                    <span className="kew-text n4-clr act3-bg">{t('BANNER.joinNow')}</span>
                    <div className="kew-arrow act3-bg">
                      <div className="kt-one">
                        <ArrowRightIcon className="ti ti-arrow-right n4-clr"></ArrowRightIcon>
                      </div>
                      <div className="kt-two">
                        <ArrowRightIcon className="ti ti-arrow-right n4-clr"></ArrowRightIcon>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="bn1-odometer mt-xxl-16 mt-xl-10 mt-6 pt-0 d-flex align-items-center gap-xxl-10 gap-sm-8 gap-4">
                  <div className="odometer__items" data-aos="zoom-in-down" data-aos-duration="1000">
                    <div className="cont d-flex align-items-center">
                      <span className="odometer display-four p1-clr fw_800">
                        <Counter value={100} />
                      </span>
                      <span className="plus__icon display-four p1-clr fw_800">k</span>
                      <span className="plus__icon display-four p1-clr fw_800">+</span>
                    </div>
                  </div>
                  <div className="odometer__items" data-aos="zoom-in-down" data-aos-duration="1000">
                    <div className="cont d-flex align-items-center">
                      <span className="odometer display-four p1-clr fw_800">
                        <Counter value={32} />
                      </span>
                      <span className="plus__icon display-four p1-clr fw_800">k</span>
                      <span className="plus__icon display-four p1-clr fw_800">+</span>
                    </div>
                  </div>
                  <div className="odometer__items" data-aos="zoom-in-down" data-aos-duration="1000">
                    <div className="cont d-flex align-items-center">
                      <span className="odometer display-four p1-clr fw_800">
                        <Counter value={12} />
                      </span>
                      <span className="plus__icon display-four p1-clr fw_800">k</span>
                      <span className="plus__icon display-four p1-clr fw_800">+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-4">
              <div className="banner-v14-thumb position-relative" data-aos="zoom-in" data-aos-duration="2000">
                <MotionFade>
                  {bannerImages.length > 0 ? (
                    <div
                      className="position-relative w-100"
                      style={{ aspectRatio: '1 / 1', borderRadius: '16px', overflow: 'hidden' }}
                    >
                      {bannerImages.map((img, index) => (
                        <div
                          key={img.src}
                          className="position-absolute w-100 h-100"
                          style={{
                            opacity: index === currentSlide ? 1 : 0,
                            transition: 'opacity 0.6s ease-in-out',
                          }}
                        >
                          <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Image src={banner14} alt="img" />
                  )}
                </MotionFade>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!--Banner Content --> */}

      {/* <!--Scroll Top --> */}
      <Link
        href="#down-scroll"
        className="scroll-bn1 act3-bg radius100 d-flex justify-content-center align-items-center justify-content-center"
      >
        <span className="d-grid gap-xxl-5 gap-xl-4 gap-3 justify-content-center text-center m-auto">
          <span className="n4-clr fs18 d-block fw_600">{t('BANNER.scroll')}</span>
          <span className="scroll-iconrarea">
            <svg width="16" height="65" viewBox="0 0 16 65" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.29289 64.7071C7.68341 65.0976 8.31658 65.0976 8.7071 64.7071L15.0711 58.3431C15.4616 57.9526 15.4616 57.3195 15.0711 56.9289C14.6805 56.5384 14.0474 56.5384 13.6569 56.9289L8 62.5858L2.34314 56.9289C1.95262 56.5384 1.31945 56.5384 0.92893 56.9289C0.538405 57.3195 0.538405 57.9526 0.92893 58.3431L7.29289 64.7071ZM7 -4.37121e-08L7 64L9 64L9 4.37121e-08L7 -4.37121e-08Z"
                fill="black"
              />
            </svg>
          </span>
        </span>
      </Link>
      {/* <!--Scroll Top --> */}

      {/* <!--shape --> */}

      <Image src={bannerV14} alt="img" className="ladnig-vnft" />

      {/* <!--shape --> */}
    </div>
  );
};

export default Nft2Banner;
