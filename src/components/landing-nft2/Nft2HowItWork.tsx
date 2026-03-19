'use client';
import icon from '@/../public/images/global/section-icon.png';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import MotionFade from '../motionEffect/MotionFade';
import MotionFadeDownToTop from '../motionEffect/MotionFadeDownToTop';

const Nft2HowItWork = () => {
  const { t } = useTranslation();
  return (
    <section className="howit-work-section howit-work-sectionv9 position-relative n0-bg pt-120 pb-120" id="down-scroll">
      {/* <!--Section Header--> */}
      <div className="container mb-xxl-20 mb-xl-16 mb-14">
        <div className="row g-xl-4 g-3 justify-content-center">
          <div className="col-lg-6">
            <div className="section__title text-center ">
              <div
                className="subtitle-head mb-xxl-4 mb-sm-4 mb-3 d-flex justify-content-center flex-wrap align-items-center gap-3"
                data-aos="zoom-in-up"
                data-aos-duration="1400"
              >
                <Image src={icon} alt="img" />
                <h5 className="s1-clr fw_700">{t('HOW_IT_WORK.sectionLabel')}</h5>
              </div>
              <MotionFadeDownToTop>
                <h2 className="display-four d-block n4-clr" data-aos="fade-down-left" data-aos-duration="1600">
                  <span className="d-block">{t('HOW_IT_WORK.sectionTitle1')}</span>
                  <span className="d-flex justify-content-center align-items-center gap-4">
                    {t('HOW_IT_WORK.sectionTitle2')}
                    <span className="act4-clr act4-underline">{t('HOW_IT_WORK.sectionTitleHighlight')}</span>
                  </span>
                </h2>
              </MotionFadeDownToTop>
            </div>
          </div>
        </div>
      </div>
      {/* <!--Section Header--> */}

      {/* <!--Work Body--> */}
      <div className="container">
        <div className="row g-6">
          <MotionFade className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration="1000">
            <div className="work-item1 work-itemv14 position-relative">
              <h2 className="n1-clr mb-xxl-11 mb-xl-8 mb-lg-6 mb-5">
                <span className="d-block">{t('HOW_IT_WORK.step1Title1')}</span>
                <span>{t('HOW_IT_WORK.step1Title2')}</span>
              </h2>
              <p className="fs18 n3-clr">{t('HOW_IT_WORK.step1Desc')}</p>
              <span className="number-shadow">1</span>
            </div>
          </MotionFade>
          <MotionFade className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration="1500">
            <div className="work-item1 work-itemv14 position-relative">
              <h2 className="n1-clr mb-xxl-11 mb-xl-8 mb-lg-6 mb-5">
                <span className="d-block">{t('HOW_IT_WORK.step2Title1')}</span>
                <span>{t('HOW_IT_WORK.step2Title2')}</span>
              </h2>
              <p className="fs18 n3-clr">{t('HOW_IT_WORK.step2Desc')}</p>
              <span className="number-shadow">2</span>
            </div>
          </MotionFade>
          <MotionFade className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration="1800">
            <div className="work-item1 work-itemv14 position-relative">
              <h2 className="n1-clr mb-xxl-11 mb-xl-8 mb-lg-6 mb-md-5 mb-2">
                <span className="d-block">{t('HOW_IT_WORK.step3Title1')}</span>
                <span>{t('HOW_IT_WORK.step3Title2')}</span>
              </h2>
              <p className="fs18 n3-clr">{t('HOW_IT_WORK.step3Desc')}</p>
              <span className="number-shadow">3</span>
            </div>
          </MotionFade>
        </div>
      </div>
      {/* <!--Work Body--> */}
    </section>
  );
};

export default Nft2HowItWork;
