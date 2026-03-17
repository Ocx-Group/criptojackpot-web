'use client';

import { Trophy, CalendarBlank } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import SubTitle from '../SubTitle';
import { winnerService } from '@/services';
import { Winner } from '@/interfaces/winner';

const getInitials = (name?: string): string => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (dateString: string, locale: string): string => {
  return new Date(dateString).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const WinnerCard = ({ winner, locale }: { winner: Winner; locale: string }) => {
  const { t } = useTranslation();

  return (
    <div className="testimonial-item11 nw4-border radius24">
      {/* Prize image or gradient placeholder */}
      <div className="thumb position-relative" style={{ height: '200px', overflow: 'hidden' }}>
        {winner.prizeImageUrl ? (
          <Image
            src={winner.prizeImageUrl}
            alt={winner.prizeName || 'Prize'}
            className="radius24"
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div
            className="radius24 d-flex align-items-center justify-content-center w-100 h-100"
            style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
          >
            <Trophy size={64} weight="fill" className="act4-clr" style={{ opacity: 0.6 }} />
          </div>
        )}
        {/* Trophy badge */}
        <span className="rat-star d-inline-flex align-items-center gap-2 p1-bg py-2 px-4 radius100">
          <Trophy weight="fill" className="fs20 n4-clr" />
          <span className="fs18 fw_600 n4-clr">{t('WINNERS_PAGE.prize')}</span>
        </span>
      </div>

      <div className="content p-xxl-6 p-xl-4 p-4">
        {/* Prize name + value in one line */}
        <p className="mb-xxl-7 mb-xl-6 mb-lg-4 mb-md-3 mb-3 n3-clr">
          {winner.prizeName && <span className="fw_700 n4-clr">{winner.prizeName}</span>}
          {winner.prizeEstimatedValue && (
            <span className="act4-clr fw_700 ms-2">${winner.prizeEstimatedValue.toLocaleString()}</span>
          )}
          {!winner.prizeName && !winner.prizeEstimatedValue && <span>{winner.lotteryTitle}</span>}
        </p>

        {/* Lottery + ticket compact line */}
        <p className="n3-clr mb-xxl-7 mb-xl-6 mb-lg-4 mb-md-3 mb-3 fs-six">
          {winner.lotteryTitle} · #{winner.number} · {t('WINNERS_PAGE.series')}: {winner.series}
        </p>

        {/* Winner info */}
        <div className="conts d-flex align-items-center gap-xxl-4 gap-xl-3 gap-2">
          <div
            className="d-flex align-items-center justify-content-center radius-circle flex-shrink-0"
            style={{
              width: 48,
              height: 48,
              background: 'linear-gradient(135deg, #f7931a 0%, #ffb347 100%)',
            }}
          >
            <span className="fw_700 n4-clr" style={{ fontSize: '16px' }}>
              {getInitials(winner.userName)}
            </span>
          </div>
          <div className="designation-box">
            <span className="fs20 mb-0 fw_700 n4-clr d-block">{winner.userName || 'Anonymous'}</span>
            <span className="fw_600 n3-clr d-flex align-items-center gap-1">
              <CalendarBlank size={14} />
              {formatDate(winner.wonAt, locale)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const WinnersSection = () => {
  const { t, i18n } = useTranslation();

  const { data: winners = [], isLoading } = useQuery({
    queryKey: ['winners'],
    queryFn: () => winnerService.getAllWinners(),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <section className="testimonial-sectionv8 overflow-visible pt-120 pb-120">
        <div className="container text-center">
          <div className="spinner-border act4-clr" role="status">
            <span className="visually-hidden">{t('WINNERS_PAGE.loading')}</span>
          </div>
        </div>
      </section>
    );
  }

  if (winners.length === 0) {
    return (
      <section className="testimonial-sectionv8 overflow-visible pt-120 pb-120">
        <div className="container text-center">
          <Trophy size={80} weight="thin" className="n3-clr mb-4" />
          <h3 className="n3-clr">{t('WINNERS_PAGE.noWinners')}</h3>
        </div>
      </section>
    );
  }

  return (
    <section className="testimonial-sectionv8 overflow-visible pt-120 pb-120">
      {/* Section Header */}
      <div className="container">
        <div className="row g-xl-4 g-3 align-items-center justify-content-between mb-xxl-15 mb-xl-10 mb-8">
          <div className="col-lg-8 col-md-9">
            <div className="section__title">
              <SubTitle text={t('WINNERS_PAGE.sectionLabel')} />
              <div className="display-four testimonial-heading d-block n4-clr">
                <span className="d-flex gap-1 flex-wrap">
                  {t('WINNERS_PAGE.title')}{' '}
                  <span className="act4-clr act4-underline" data-aos="zoom-in-left" data-aos-duration="1000">
                    {t('WINNERS_PAGE.titleHighlight')}
                  </span>
                </span>
              </div>
              <p className="n3-clr fs-six mt-3" data-aos="fade-up" data-aos-duration="1200">
                {t('WINNERS_PAGE.subtitle')}
              </p>
            </div>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-3">
            <div className="testimonial-ratting" data-aos="zoom-in-down" data-aos-duration="1600">
              <div className="d-flex align-items-center gap-3">
                <Trophy size={48} weight="fill" className="act4-clr" />
                <div>
                  <h2 className="n4-clr fw_700">{winners.length}</h2>
                  <span className="n3-clr fw_600">{t('WINNERS_PAGE.sectionLabel')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Winners carousel */}
      {winners.length >= 4 ? (
        <Swiper
          loop={true}
          slidesPerView={1}
          spaceBetween={24}
          speed={4500}
          centeredSlides
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          modules={[Autoplay]}
          breakpoints={{
            1600: { slidesPerView: 4, spaceBetween: 24 },
            1399: { slidesPerView: 4, spaceBetween: 14 },
            992: { slidesPerView: 3, spaceBetween: 14 },
            768: { slidesPerView: 2, spaceBetween: 14 },
            576: { slidesPerView: 2, spaceBetween: 14 },
            500: { slidesPerView: 1, spaceBetween: 14 },
          }}
          className="swiper testimonial-wrapv11"
        >
          <div className="swiper-wrapper">
            {winners.map(winner => (
              <SwiperSlide key={winner.winnerGuid} className="swiper-slide">
                <WinnerCard winner={winner} locale={i18n.language} />
              </SwiperSlide>
            ))}
          </div>
        </Swiper>
      ) : (
        <div className="container">
          <div className="row g-4 justify-content-center">
            {winners.map(winner => (
              <div key={winner.winnerGuid} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                <WinnerCard winner={winner} locale={i18n.language} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default WinnersSection;
