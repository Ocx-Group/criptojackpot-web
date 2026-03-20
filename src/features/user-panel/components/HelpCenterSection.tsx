'use client';

import { EnvelopeSimple, Headset } from '@phosphor-icons/react/dist/ssr';
import { useTranslation } from 'react-i18next';

const HelpCenterSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="user-body-area pt-120 pb-120">
      <div className="cmn-box-addingbg win40-ragba border radius24 p-xxl-10 p-xl-8 p-lg-6 p-5">
        <div className="d-flex align-items-center gap-3 mb-5">
          <Headset size={32} weight="bold" className="act4-clr" />
          <h3 className="user-title n4-clr">{t('HELP_CENTER.title')}</h3>
        </div>

        <p className="n3-clr fs-six mb-5" style={{ maxWidth: '600px' }}>
          {t('HELP_CENTER.description')}
        </p>

        <div
          className="d-flex align-items-center gap-3 p-4 radius16 border"
          style={{ maxWidth: '500px', backgroundColor: 'rgba(var(--act4-rgb), 0.05)' }}
        >
          <div
            className="d-flex align-items-center justify-content-center act4-bg radius-circle"
            style={{ width: '48px', height: '48px', minWidth: '48px' }}
          >
            <EnvelopeSimple size={24} weight="bold" className="n0-clr" />
          </div>
          <div>
            <span className="d-block n3-clr fw_600 mb-1" style={{ fontSize: '13px' }}>
              {t('HELP_CENTER.contactLabel')}
            </span>
            <a href="mailto:support@criptojackpot.com" className="act4-clr fw-bold fs-six">
              support@criptojackpot.com
            </a>
            <p className="n3-clr mb-0 mt-1" style={{ fontSize: '12px' }}>
              {t('HELP_CENTER.contactMessage')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterSection;
