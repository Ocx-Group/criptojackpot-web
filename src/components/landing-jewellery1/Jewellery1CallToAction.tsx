'use client';
import callSum from '@/../public/images/global/call-sun.png';
import globalPicon from '@/../public/images/global/global-picon.png';
import jewelryCallto from '@/../public/images/global/jewelry-callto.png';
import { ArrowUpRightIcon, CheckIcon } from '@phosphor-icons/react/dist/ssr';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MotionFadeDownToTop from '../motionEffect/MotionFadeDownToTop';
type Props = {
  image?: StaticImageData;
  title?: string;
};

const Jewellery1CallToAction = ({ image, title }: Props) => {
  const [isChecked, setIsChecked] = useState(true);
  const { t } = useTranslation();
  return (
    <section className="call-tosectionv7 overflow-hidden n4-bg pt-120 pb-120 position-relative call-custom-space call-custom-spacev4">
      <div className="container">
        <div className="call-to-wrapper1 call-to-wrapperv4 pt-6 position-relative">
          <div className="row g-xl-0 g-0 justify-content-between">
            <div className="col-xl-5 col-lg-5 col-md-7">
              <div className="section__title text-sm-start text-center">
                <div
                  className="subtitle-head mb-xxl-20 mb-xl-15 mb-lg-10 mb-md-5 mb-0 pb-7 d-flex flex-wrap justify-content-sm-start justify-content-center align-items-center gap-3"
                  data-aos="zoom-in-down"
                  data-aos-duration="1200"
                >
                  <Image src={globalPicon} alt="img" />
                  <h5 className="p1-clr fw_700">{t('CALL_TO_ACTION.sectionLabel')}</h5>
                </div>
                <div className="callany">
                  <span className="fs20 fw_700 n0-clr text-uppercase d-block mb-lg-3 mb-2">
                    {' '}
                    {t('CALL_TO_ACTION.callAnytime')}{' '}
                  </span>
                  <Link href="#" className="fs-seven fw_700 n0-clr">
                    (629) 555-0129
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-7 col-lg-7" data-aos="zoom-in-down" data-aos-duration="1600">
              <div className="callto-action-v4 text-sm-start text-center pt-120 mt-xxl-4 mt-0">
                <span className="display-four d-block n0-clr">
                  {t('CALL_TO_ACTION.titleLine1')}
                  <span className="d-flex flex-wrap justify-content-sm-start justify-content-center align-items-center gap-2">
                    <span className="d-block" data-aos="zoom-in-right" data-aos-duration="1200">
                      {' '}
                      {title ?? t('CALL_TO_ACTION.titleLine2')}{' '}
                    </span>
                    <span className="act4-clr act4-underline" data-aos="zoom-in-left" data-aos-duration="1000">
                      {' '}
                      {t('CALL_TO_ACTION.titleHighlight')}{' '}
                    </span>
                  </span>
                </span>
                <div className="listing-checkwrap pt-120">
                  <Link href="#0" className="listing-box position-relative">
                    <span className="text-uppercase fs-six fw_600 n0-clr"> {t('CALL_TO_ACTION.listing')} </span>
                    <span className="listing-arrow cmn-48 s1-bg radius-circle d-flex align-items-center justify-content-center">
                      <ArrowUpRightIcon weight="bold" className="ph-bold ph-arrow-up-right n0-clr"></ArrowUpRightIcon>
                    </span>
                  </Link>
                  <div className="listing-right">
                    <Link href="#" className="cruz-expm d-inline-flex">
                      {' '}
                      support@criptojackpot.com{' '}
                    </Link>
                    <div className="listing-submit mt-xxl-6 mt-xl-5 mt-lg-4 mt-3 pt-xxl-6 pt-xl-5 pt-lg-4 pt-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
                      <label className="checkbox-single">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" checked={!isChecked} onChange={() => setIsChecked(!isChecked)} />
                          <span className="checkmark d-center">{isChecked && <CheckIcon />} </span>
                        </span>
                        <span className="nw2-clr text-check text-start">
                          {t('CALL_TO_ACTION.agreeWith')}{' '}
                          <Link href="#" className="p1-clr">
                            {t('CALL_TO_ACTION.privacyPolicy')}
                          </Link>{' '}
                          {t('CALL_TO_ACTION.and')}
                          <Link href="#" className="p1-clr">
                            {t('CALL_TO_ACTION.termsOfConditions')}
                          </Link>
                        </span>
                      </label>
                      <button type="submit" className="kewta-btn s1-bg radius100 py-xxl-4 py-2 px-xxl-10 px-6">
                        <span className="fs-seven fw_700 n0-clr"> {t('CALL_TO_ACTION.submit')} </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <MotionFadeDownToTop className="jewelary-callto">
            <Image src={image ?? jewelryCallto} alt="img" />
          </MotionFadeDownToTop>
        </div>
      </div>
      <div className="call-sun">
        <Image src={callSum} alt="call-sun" />
      </div>
    </section>
  );
};

export default Jewellery1CallToAction;
