'use client';
import customer1 from '@/../public/images/banner/customer1.png';
import customer2 from '@/../public/images/banner/customer2.png';
import customer4 from '@/../public/images/banner/customer4.png';
import test1 from '@/../public/images/testimonial/testv11-1.png';
import test2 from '@/../public/images/testimonial/testv11-2.png';
import test3 from '@/../public/images/testimonial/testv11-3.png';
import test4 from '@/../public/images/testimonial/testv11-4.png';
import test5 from '@/../public/images/testimonial/testv11-5.png';
import test6 from '@/../public/images/testimonial/testv11-6.png';
import { Quotes, Star, StarHalf } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import SubTitle from '../SubTitle';

const Nft2Testimonial = () => {
  const { t } = useTranslation();
  return (
    <section className="testimonial-sectionv8 overflow-visible testimonial-v1-before pt-120 pb-120">
      {/* <!--Section Header--> */}
      <div className="container">
        <div className="row g-xl-4 g-3 align-items-center justify-content-between mb-xxl-15 mb-xl-10 mb-8">
          <div className="col-lg-7 col-md-8 col-sm-9">
            <div className="section__title">
              <SubTitle text={t('TESTIMONIALS.sectionLabel')} />
              <div className="display-four testimonial-heading d-block n4-clr">
                <span className="d-flex gap-1 flex-wrap">
                  {t('TESTIMONIALS.titleLine1')}{' '}
                  <span className="act4-clr act4-underline" data-aos="zoom-in-left" data-aos-duration="1000">
                    {t('TESTIMONIALS.titleHighlight')}{' '}
                  </span>
                </span>
                <div className="d-flex flex-wrap align-items-center g-4">
                  <ul className="customer-review testi-people-title cmn-style-flex">
                    <li>
                      <Link
                        href="#"
                        className="customer-revew-item n0-bg d-flex align-items-center justify-content-center"
                      >
                        <Image src={customer1} alt="img" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="customer-revew-item n0-bg d-flex align-items-center justify-content-center"
                      >
                        <Image src={customer2} alt="img" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="customer-revew-item n0-bg d-flex align-items-center justify-content-center"
                      >
                        <Image src={customer4} alt="img" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="customer-revew-item n0-bg d-flex align-items-center justify-content-center"
                      >
                        <span className="d-grid customer-ratting text-center p-2 p1-bg align-items-center justify-content-center">
                          <span className="d-block fs-eight fw_700 n4-clr">10k+</span>
                        </span>
                      </Link>
                    </li>
                  </ul>
                  <span className="d-block ar-talking" data-aos="zoom-in-right" data-aos-duration="1200">
                    {t('TESTIMONIALS.reviews')}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3">
            <div className="testimonial-ratting" data-aos="zoom-in-down" data-aos-duration="1600">
              <span className="n4-clr fw_700 mb-xxl-6 mb-xl-4 mb-3">Trustpilot</span>
              <ul className="ratting d-flex align-items-center gap-1 mb-xxl-3 mb-2">
                <li>
                  <Star weight="fill" className="ph-fill ph-star fs-five act4-clr"></Star>
                </li>
                <li>
                  <Star weight="fill" className="ph-fill ph-star fs-five act4-clr"></Star>
                </li>
                <li>
                  <Star weight="fill" className="ph-fill ph-star fs-five act4-clr"></Star>
                </li>
                <li>
                  <Star weight="fill" className="ph-fill ph-star fs-five act4-clr"></Star>
                </li>
                <li>
                  <StarHalf weight="fill" className="ph-fill ph-star-half fs-five act4-clr"></StarHalf>
                </li>
              </ul>
              <h4 className="n2-clr">
                4.5- <span className="fs-six fw_600">(25,750Reviews)</span>
              </h4>
            </div>
          </div>
        </div>
      </div>
      {/* <!--Section Header--> */}

      {/* <!--Testimonial wap--> */}
      <Swiper
        loop={true}
        slidesPerView={1}
        spaceBetween={24}
        speed={4500}
        centeredSlides
        autoplay={{ delay: 100 }}
        pagination={{
          el: '.swiper-pagination-testi',
          clickable: true,
        }}
        breakpoints={{
          1600: {
            slidesPerView: 4,
            spaceBetween: 24,
          },
          1399: {
            slidesPerView: 4,
            spaceBetween: 14,
          },
          992: {
            slidesPerView: 3,
            spaceBetween: 14,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 14,
          },
          576: {
            slidesPerView: 2,
            spaceBetween: 14,
          },
          500: {
            slidesPerView: 1,
            spaceBetween: 14,
          },
        }}
        className="swiper testimonial-wrapv11"
      >
        <div className="swiper-wrapper">
          <SwiperSlide className="swiper-slide">
            <div className="testimonial-item11 nw4-border radius24">
              <div className="thumb position-relative">
                <Image src={test1} alt="img" className="radius24" />
                <span className="quote-cmn rot160 d-center s1-bg radius-circle">
                  <Quotes weight="light" className="ph-light ph-quotes act4-clr"></Quotes>
                </span>
                <span className="rat-star d-inline-flex align-items-center gap-2 p1-bg py-2 px-4 radius100">
                  <Star weight="fill" className="ph-fill ph-star fs20 n4-clr"></Star>
                  <span className="fs18 fw_600 n4-clr">5/5</span>
                </span>
              </div>
              <div className="content p-xxl-6 p-xl-4 p-4">
                <p className="mb-xxl-7 mb-xl-6 mb-lg-4 mb-md-3 mb-3 n3-clr">{t('TESTIMONIALS.text')}</p>
                <div className="conts d-flex align-items-center gap-xxl-4 gap-xl-3 gap-2">
                  <div className="designation-box">
                    <span className="fs20 mb-0 fw_700 n4-clr d-block">Ralph Edwards</span>
                    <span className="fw_600 n3-clr">United States - March 23, 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="swiper-slide">
            <div className="testimonial-item11 nw4-border radius24">
              <div className="thumb position-relative">
                <Image src={test2} alt="img" className="radius24" />
                <span className="quote-cmn rot160 d-center s1-bg radius-circle">
                  <Quotes weight="light" className="ph-light ph-quotes act4-clr"></Quotes>
                </span>
                <span className="rat-star d-inline-flex align-items-center gap-2 p1-bg py-2 px-4 radius100">
                  <Star weight="fill" className="ph-fill ph-star fs20 n4-clr"></Star>
                  <span className="fs18 fw_600 n4-clr">5/5</span>
                </span>
              </div>
              <div className="content p-xxl-6 p-xl-4 p-4">
                <p className="mb-xxl-7 mb-xl-6 mb-lg-4 mb-md-3 mb-3 n3-clr">{t('TESTIMONIALS.text')}</p>
                <div className="conts d-flex align-items-center gap-xxl-4 gap-xl-3 gap-2">
                  <div className="designation-box">
                    <span className="fs20 mb-0 fw_700 n4-clr d-block">Dianne Russell</span>
                    <span className="fw_600 n3-clr">United States - March 23, 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="swiper-slide">
            <div className="testimonial-item11 nw4-border radius24">
              <div className="thumb position-relative">
                <Image src={test3} alt="img" className="radius24" />
                <span className="quote-cmn rot160 d-center s1-bg radius-circle">
                  <Quotes weight="light" className="ph-light ph-quotes act4-clr"></Quotes>
                </span>
                <span className="rat-star d-inline-flex align-items-center gap-2 p1-bg py-2 px-4 radius100">
                  <Star weight="fill" className="ph-fill ph-star fs20 n4-clr"></Star>
                  <span className="fs18 fw_600 n4-clr">5/5</span>
                </span>
              </div>
              <div className="content p-xxl-6 p-xl-4 p-4">
                <p className="mb-xxl-7 mb-xl-6 mb-lg-4 mb-md-3 mb-3 n3-clr">{t('TESTIMONIALS.text')}</p>
                <div className="conts d-flex align-items-center gap-xxl-4 gap-xl-3 gap-2">
                  <div className="designation-box">
                    <span className="fs20 mb-0 fw_700 n4-clr d-block">Eleanor Pena</span>
                    <span className="fw_600 n3-clr">United States - March 23, 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="swiper-slide">
            <div className="testimonial-item11 nw4-border radius24">
              <div className="thumb position-relative">
                <Image src={test4} alt="img" className="radius24" />
                <span className="quote-cmn rot160 d-center s1-bg radius-circle">
                  <Quotes weight="light" className="ph-light ph-quotes act4-clr"></Quotes>
                </span>
                <span className="rat-star d-inline-flex align-items-center gap-2 p1-bg py-2 px-4 radius100">
                  <Star weight="fill" className="ph-fill ph-star fs20 n4-clr"></Star>
                  <span className="fs18 fw_600 n4-clr">5/5</span>
                </span>
              </div>
              <div className="content p-xxl-6 p-xl-4 p-4">
                <p className="mb-xxl-7 mb-xl-6 mb-lg-4 mb-md-3 mb-3 n3-clr">{t('TESTIMONIALS.text')}</p>
                <div className="conts d-flex align-items-center gap-xxl-4 gap-xl-3 gap-2">
                  <div className="designation-box">
                    <span className="fs20 mb-0 fw_700 n4-clr d-block">Arlene McCoy</span>
                    <span className="fw_600 n3-clr">United States - March 23, 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="swiper-slide">
            <div className="testimonial-item11 nw4-border radius24">
              <div className="thumb position-relative">
                <Image src={test5} alt="img" className="radius24" />
                <span className="quote-cmn rot160 d-center s1-bg radius-circle">
                  <Quotes weight="light" className="ph-light ph-quotes act4-clr"></Quotes>
                </span>
                <span className="rat-star d-inline-flex align-items-center gap-2 p1-bg py-2 px-4 radius100">
                  <Star weight="fill" className="ph-fill ph-star fs20 n4-clr"></Star>
                  <span className="fs18 fw_600 n4-clr">5/5</span>
                </span>
              </div>
              <div className="content p-xxl-6 p-xl-4 p-4">
                <p className="mb-xxl-7 mb-xl-6 mb-lg-4 mb-md-3 mb-3 n3-clr">{t('TESTIMONIALS.text')}</p>
                <div className="conts d-flex align-items-center gap-xxl-4 gap-xl-3 gap-2">
                  <div className="designation-box">
                    <span className="fs20 mb-0 fw_700 n4-clr d-block">Brooklyn Simmons</span>
                    <span className="fw_600 n3-clr">United States - March 23, 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="swiper-slide">
            <div className="testimonial-item11 nw4-border radius24">
              <div className="thumb position-relative">
                <Image src={test6} alt="img" className="radius24" />
                <span className="quote-cmn rot160 d-center s1-bg radius-circle">
                  <Quotes weight="light" className="ph-light ph-quotes act4-clr"></Quotes>
                </span>
                <span className="rat-star d-inline-flex align-items-center gap-2 p1-bg py-2 px-4 radius100">
                  <Star weight="fill" className="ph-fill ph-star fs20 n4-clr"></Star>
                  <span className="fs18 fw_600 n4-clr">5/5</span>
                </span>
              </div>
              <div className="content p-xxl-6 p-xl-4 p-4">
                <p className="mb-xxl-7 mb-xl-6 mb-lg-4 mb-md-3 mb-3 n3-clr">{t('TESTIMONIALS.text')}</p>
                <div className="conts d-flex align-items-center gap-xxl-4 gap-xl-3 gap-2">
                  <div className="designation-box">
                    <span className="fs20 mb-0 fw_700 n4-clr d-block">Arlene McCoy</span>
                    <span className="fw_600 n3-clr">United States - March 23, 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </div>
        <div className="container">
          <div className="swiper-pagination-testi text-start mt-xxl-13 mt-xl-8 mt-lg-6 mt-4"></div>
        </div>
      </Swiper>
      {/* <!--Testimonial wap--> */}
    </section>
  );
};

export default Nft2Testimonial;
