'use client';
import { CalendarBlankIcon, HandHeartIcon, LinkSimpleIcon, UsersFourIcon } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import React, { useRef } from 'react';
import { useReferralProgram } from '@/features/user-panel/hooks/useReferralProgram';
import MotionFade from '@/components/motionEffect/MotionFade';
import MotionFadeDownToTop from '@/components/motionEffect/MotionFadeDownToTop';
import MotionFadeTopToDown from '@/components/motionEffect/MotionFadeTopToDown';
import { useTranslation } from 'react-i18next';
import Table from "@/components/table/Table";
import {Referral} from "@/features/user-panel/types";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
  });
};

const ReferalProgram = () => {
  const { t } = useTranslation();
  const textAreaRef = useRef<HTMLInputElement>(null);
  const {
    referralLink,
    copyToClipboard: copyReferralLink,
    hasSecurityCode,
    referralData,
    isReferralsLoading,
    referralEarnings,
    isEarningsLoading,
  } = useReferralProgram();

  function copyToClipboard(e: React.MouseEvent<HTMLInputElement, MouseEvent>) {
    copyReferralLink();
    e.currentTarget.focus();
  }

  const columns = [
    { key: 'registerDate', header: t('REFERRAL_PROGRAM.table.date') },
    { key: 'fullName', header: t('REFERRAL_PROGRAM.table.username') },
    { key: 'email', header: t('REFERRAL_PROGRAM.table.email') },
    { key: 'usedSecurityCode', header: t('REFERRAL_PROGRAM.table.securityCode') },
  ];

  const tableData = React.useMemo(() => {
    if (!referralData?.referrals) return [];
    return referralData.referrals.map((ref: Referral) => ({
      ...ref,
      registerDate: formatDate(ref.registerDate),
    }));
  }, [referralData]);

  return (
      <div className="col-xxl-9 col-xl-8 col-lg-8">
        <MotionFadeTopToDown className="cmn-box-addingbg mb-6 win40-ragba border radius24 py-xxl-10 py-xl-8 py-lg-6 py-5 px-xxl-10 px-xl-8 px-lg-6 px-5">
          <h3 className="user-title n4-clr mb-lg-6 mb-5">{t('REFERRAL_PROGRAM.partners')}</h3>
          <div className="copy-codearea">
            {!hasSecurityCode && (
                <div className="alert alert-warning mb-3" role="alert">
                  {t('REFERRAL_PROGRAM.noSecurityCode')}
                </div>
            )}
            <div
                className="copy-form d-flex border flex-sm-nowrap flex-wrap radius100 p-2 align-items-center justify-content-sm-between justify-content-center text-sm-start text-center w-100"
                data-copy="true"
            >
              <div className="d-flex align-items-center gap-3 icon-text">
              <span className="c-icon s1-bg radius-circle d-center cmn-48">
                <LinkSimpleIcon weight="bold" className="ph-bold ph-link nw1-clr fs-four"></LinkSimpleIcon>
              </span>
                <span className="n4-clr fw_600">{t('REFERRAL_PROGRAM.referralLink')}</span>
              </div>
              <span className="minput">
              <input
                  type="text"
                  value={referralLink}
                  readOnly
                  data-click-select-all
                  className="in-input"
                  ref={textAreaRef}
              />
            </span>
              <input
                  type="submit"
                  value={t('REFERRAL_PROGRAM.copyLink')}
                  className="btn-copy d-center"
                  onClick={e => {
                    copyToClipboard(e);
                  }}
              />
            </div>
          </div>
        </MotionFadeTopToDown>
        <MotionFadeDownToTop className="cmn-box-addingbg mb-6 win40-ragba border radius24 py-xxl-10 py-xl-8 py-5 px-xxl-10 px-xl-8 px-5">
          <div className="d-flex flex-wrap align-items-center justify-content-center gap-xl-6 gap-4">
            <Link
                href="#0"
                className="deposit-box h-100 w-auto text-center d-center border radius24 d-center py-xxl-8 py-6 px-xxl-18 px-xl-15 px-lg-10 px-6"
            >
            <span className="box">
              <span className="icon m-auto mb-xxl-5 mb-xl-4 mb-lg-3 mb-2 s1-bg radius-circle d-center">
                <UsersFourIcon className="ph ph-users-four fs-two n0-clr"></UsersFourIcon>
              </span>
              <span className="n4-clr fs-three mb-2">
                {isEarningsLoading ? '...' : `$${referralEarnings?.totalEarnings ?? 0}`}
              </span>
              <span className="n3-clr fw_600 d-block"> {t('REFERRAL_PROGRAM.earnedReferral')} </span>
            </span>
            </Link>
            <Link
                href="#0"
                className="deposit-box h-100 w-auto text-center d-center border radius24 d-center py-xxl-8 py-6 px-xxl-18 px-xl-15 px-lg-10 px-6"
            >
            <span className="box">
              <span className="icon m-auto mb-xxl-5 mb-xl-4 mb-lg-3 mb-2 s1-bg radius-circle d-center">
                <HandHeartIcon className="ph ph-hand-heart fs-two n0-clr"></HandHeartIcon>
              </span>
              <span className="n4-clr fs-three mb-2">
                {isEarningsLoading ? '...' : `$${referralEarnings?.lastMonthEarnings ?? 0}`}
              </span>
              <span className="n3-clr fw_600 d-block"> {t('REFERRAL_PROGRAM.lastMonth')} </span>
            </span>
            </Link>
          </div>
        </MotionFadeDownToTop>
        <MotionFade className="cmn-box-addingbg win40-ragba border radius24 pt-xxl-10 pt-xl-8 pt-lg-6 pt-5 pb-5">
          <div className="mb-xxl-10 mb-xl-8 mb-lg-6 mb-5 d-flex align-items-center justify-content-between flex-wrap gap-3 px-xxl-10 px-xl-8 px-5">
            <h3 className="user-title n4-clr">{t('REFERRAL_PROGRAM.yourPartners')}</h3>
            <form
                action="#0"
                className="min-maxdate d-flex align-items-center justify-content-between border radius100 py-xxl-3 py-2 px-xxl-6 px-5"
            >
              <input type="text" placeholder={t('REFERRAL_PROGRAM.dateRangeFilter')} />
              <CalendarBlankIcon weight="bold" className="ph-bold ph-calendar-blank"></CalendarBlankIcon>
            </form>
          </div>
          {isReferralsLoading ? (
              <div className="text-center p-5 n4-clr">Loading partners...</div>
          ) : (
              <Table columns={columns} data={tableData} />
          )}
        </MotionFade>
      </div>
  );
};

export default ReferalProgram;