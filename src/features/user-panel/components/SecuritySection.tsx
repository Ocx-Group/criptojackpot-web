'use client';

import { ShieldCheckIcon, CopyIcon, ArrowLeftIcon, WarningIcon } from '@phosphor-icons/react';
import OtpInput from 'react-otp-input';
import { useTranslation } from 'react-i18next';
import { useSetup2Fa, TwoFactorStep } from '@/features/user-panel/hooks/useSetup2Fa';
import MotionFade from '@/components/motionEffect/MotionFade';
import { useNotificationStore } from '@/store/notificationStore';
import { TwoFactorSetupResponse } from '@/features/user-panel/types/twoFactor';

/* ─── Shared helpers ─── */

const copyText = (text: string, onCopied: () => void) => {
  navigator.clipboard.writeText(text);
  onCopied();
};

const OtpField = ({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  disabled: boolean;
}) => (
  <OtpInput
    value={value}
    onChange={onChange}
    numInputs={6}
    shouldAutoFocus
    inputType="number"
    renderInput={props => (
      <input
        {...props}
        disabled={disabled}
        style={{
          width: '48px',
          height: '56px',
          margin: '0 4px',
          fontSize: '20px',
          fontWeight: 700,
          borderRadius: '12px',
          border: '2px solid rgba(255,255,255,0.2)',
          background: 'rgba(255,255,255,0.05)',
          color: '#ffffff',
          textAlign: 'center',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => {
          e.target.style.borderColor = 'var(--s1)';
        }}
        onBlur={e => {
          e.target.style.borderColor = 'rgba(255,255,255,0.2)';
        }}
      />
    )}
  />
);

const PageShell = ({ children }: { children: React.ReactNode }) => (
  <MotionFade className="col-xxl-9 col-xl-8 col-lg-8">
    <div className="cmn-box-addingbg win40-ragba border radius24 py-xxl-10 py-xl-8 py-lg-6 py-5 px-xxl-8 px-xl-6 px-sm-5 px-4">
      {children}
    </div>
  </MotionFade>
);

const BackHeader = ({ onBack, title }: { onBack: () => void; title: string }) => (
  <div className="d-flex align-items-center gap-3 mb-xxl-8 mb-xl-6 mb-5">
    <button
      type="button"
      onClick={onBack}
      className="d-center"
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--n3)' }}
    >
      <ArrowLeftIcon weight="bold" size={22} />
    </button>
    <h3 className="user-title n4-clr">{title}</h3>
  </div>
);

/* ─── Status View ─── */

const StatusView = ({
  isEnabled,
  recoveryCodesRemaining,
  isSetupLoading,
  onStartSetup,
  onShowDisable,
  onShowRegenerate,
}: {
  isEnabled: boolean;
  recoveryCodesRemaining: number | null;
  isSetupLoading: boolean;
  onStartSetup: () => void;
  onShowDisable: () => void;
  onShowRegenerate: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <PageShell>
      <h3 className="user-title n4-clr mb-xxl-10 mb-xl-8 mb-lg-6 mb-5">{t('SECURITY.title')}</h3>

      <div
        className="radius16 p-xxl-8 p-xl-6 p-4 mb-6"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="d-flex align-items-center gap-4 mb-4">
          <div
            className="d-center radius-circle"
            style={{
              width: '56px',
              height: '56px',
              background: isEnabled ? 'rgba(52, 168, 83, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              flexShrink: 0,
            }}
          >
            <ShieldCheckIcon weight="bold" size={28} style={{ color: isEnabled ? '#34A853' : 'var(--n3)' }} />
          </div>
          <div>
            <h5 className="n4-clr fw_700 mb-1">{t('SECURITY.twoFactorAuth')}</h5>
            <span className="fs-seven fw_600" style={{ color: isEnabled ? '#34A853' : 'var(--n3)' }}>
              {isEnabled ? t('SECURITY.status.enabled') : t('SECURITY.status.disabled')}
            </span>
          </div>
        </div>

        <p className="n3-clr fs-seven mb-6" style={{ lineHeight: '1.6' }}>
          {t('SECURITY.description')}
        </p>

        {isEnabled ? (
          <div>
            {recoveryCodesRemaining !== null && (
              <p className="n3-clr fs-eight mb-4" style={{ lineHeight: '1.5' }}>
                {t('SECURITY.recoveryCodesRemaining', { count: recoveryCodesRemaining })}
              </p>
            )}
            <div className="d-flex gap-3 flex-wrap">
              <button
                type="button"
                onClick={onShowRegenerate}
                className="cmn-btn radius12 fw_600 d-inline-flex align-items-center gap-2 py-3 px-5"
                style={{ background: 'var(--bg2)', border: '1px solid var(--borderd)', color: 'var(--n0)' }}
              >
                {t('SECURITY.regenerateCodes')}
              </button>
              <button
                type="button"
                onClick={onShowDisable}
                className="cmn-btn radius12 fw_600 d-inline-flex align-items-center gap-2 py-3 px-5"
                style={{
                  background: 'rgba(254, 68, 69, 0.1)',
                  border: '1px solid rgba(254, 68, 69, 0.3)',
                  color: 'var(--act1)',
                }}
              >
                {t('SECURITY.disable2Fa')}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={onStartSetup}
            disabled={isSetupLoading}
            className="cmn-btn s1-bg radius12 fw_600 d-inline-flex align-items-center gap-2 py-3 px-5 n0-clr"
          >
            {isSetupLoading ? t('SECURITY.settingUp') : t('SECURITY.enable2Fa')}
          </button>
        )}
      </div>

      <div
        className="radius12 p-4 d-flex gap-3"
        style={{ background: 'rgba(85, 74, 255, 0.08)', border: '1px solid rgba(85, 74, 255, 0.2)' }}
      >
        <ShieldCheckIcon weight="bold" size={20} style={{ color: 'var(--s1)', flexShrink: 0, marginTop: '2px' }} />
        <p className="n3-clr fs-eight" style={{ lineHeight: '1.5' }}>
          {t('SECURITY.infoBox')}
        </p>
      </div>
    </PageShell>
  );
};

/* ─── Setup View ─── */

const SetupView = ({
  setupData,
  verifyCode,
  isEnabling,
  onBack,
  onCodeComplete,
  onVerify,
  onCopy,
}: {
  setupData: TwoFactorSetupResponse | null;
  verifyCode: string;
  isEnabling: boolean;
  onBack: () => void;
  onCodeComplete: (val: string) => void;
  onVerify: (e?: React.FormEvent) => void;
  onCopy: (text: string) => void;
}) => {
  const { t } = useTranslation();

  return (
    <PageShell>
      <BackHeader onBack={onBack} title={t('SECURITY.setup.title')} />

      {/* Step 1 */}
      <div className="mb-6">
        <div className="d-flex align-items-center gap-3 mb-3">
          <span
            className="d-center radius-circle fw_700 fs-seven"
            style={{ width: '32px', height: '32px', background: 'var(--s1)', color: '#fff', flexShrink: 0 }}
          >
            1
          </span>
          <h5 className="n4-clr fw_600">{t('SECURITY.setup.step1Title')}</h5>
        </div>
        <p className="n3-clr fs-seven ms-5 ps-3" style={{ lineHeight: '1.6' }}>
          {t('SECURITY.setup.step1Description')}
        </p>
      </div>

      {/* Step 2 */}
      <div className="mb-6">
        <div className="d-flex align-items-center gap-3 mb-4">
          <span
            className="d-center radius-circle fw_700 fs-seven"
            style={{ width: '32px', height: '32px', background: 'var(--s1)', color: '#fff', flexShrink: 0 }}
          >
            2
          </span>
          <h5 className="n4-clr fw_600">{t('SECURITY.setup.step2Title')}</h5>
        </div>
        <div className="ms-5 ps-3">
          {setupData?.qrCodeUri && (
            <div className="d-inline-block radius16 p-4 mb-4" style={{ background: '#ffffff' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(setupData.qrCodeUri)}`}
                alt="QR Code"
                width={200}
                height={200}
                style={{ display: 'block' }}
              />
            </div>
          )}
          {setupData?.secret && (
            <div className="mb-4">
              <p className="n3-clr fs-eight mb-2">{t('SECURITY.setup.manualEntry')}</p>
              <div
                className="radius12 p-3 d-inline-flex align-items-center gap-3"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <code
                  className="fw_700 fs-six"
                  style={{ color: 'var(--s1)', letterSpacing: '2px', wordBreak: 'break-all' }}
                >
                  {setupData.secret}
                </code>
                <button
                  type="button"
                  onClick={() => onCopy(setupData.secret)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--n3)' }}
                  title={t('SECURITY.copy')}
                >
                  <CopyIcon weight="bold" size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step 3 */}
      <div className="mb-6">
        <div className="d-flex align-items-center gap-3 mb-4">
          <span
            className="d-center radius-circle fw_700 fs-seven"
            style={{ width: '32px', height: '32px', background: 'var(--s1)', color: '#fff', flexShrink: 0 }}
          >
            3
          </span>
          <h5 className="n4-clr fw_600">{t('SECURITY.setup.step3Title')}</h5>
        </div>
        <div className="ms-5 ps-3">
          <p className="n3-clr fs-seven mb-4" style={{ lineHeight: '1.6' }}>
            {t('SECURITY.setup.step3Description')}
          </p>
          <form onSubmit={onVerify}>
            <div className="d-flex justify-content-start mb-4">
              <OtpField value={verifyCode} onChange={onCodeComplete} disabled={isEnabling} />
            </div>
            <button
              type="submit"
              disabled={isEnabling || verifyCode.length !== 6}
              className="cmn-btn s1-bg radius12 fw_600 d-inline-flex align-items-center gap-2 py-3 px-5 n0-clr"
            >
              <span className="fw_600 n0-clr">
                {isEnabling ? t('SECURITY.verifying') : t('SECURITY.verifyAndEnable')}
              </span>
            </button>
          </form>
        </div>
      </div>
    </PageShell>
  );
};

/* ─── Recovery Codes View ─── */

const RecoveryCodesView = ({
  codes,
  onBack,
  onCopy,
  onCopyAll,
}: {
  codes: string[];
  onBack: () => void;
  onCopy: (text: string) => void;
  onCopyAll: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <PageShell>
      <h3 className="user-title n4-clr mb-4">{t('SECURITY.recoveryCodes.title')}</h3>

      <div
        className="radius12 p-4 d-flex gap-3 mb-6"
        style={{ background: 'rgba(254, 201, 47, 0.1)', border: '1px solid rgba(254, 201, 47, 0.3)' }}
      >
        <WarningIcon weight="bold" size={22} style={{ color: 'var(--act3)', flexShrink: 0, marginTop: '2px' }} />
        <p className="fs-seven" style={{ color: 'var(--act3)', lineHeight: '1.5' }}>
          {t('SECURITY.recoveryCodes.warning')}
        </p>
      </div>

      <div
        className="radius16 p-xxl-6 p-4 mb-6"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="row g-3">
          {codes.map(code => (
            <div key={code} className="col-lg-4 col-md-6 col-6">
              <div
                className="radius8 py-2 px-3 d-flex align-items-center justify-content-between"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <code className="fw_600 fs-seven" style={{ color: 'var(--n0)', letterSpacing: '1px' }}>
                  {code}
                </code>
                <button
                  type="button"
                  onClick={() => onCopy(code)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--n3)', padding: '2px' }}
                >
                  <CopyIcon weight="bold" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="d-flex gap-3 flex-wrap">
        <button
          type="button"
          onClick={onCopyAll}
          className="cmn-btn radius12 fw_600 d-inline-flex align-items-center gap-2 py-3 px-5"
          style={{ background: 'var(--bg2)', border: '1px solid var(--borderd)', color: 'var(--n0)' }}
        >
          <CopyIcon weight="bold" size={18} />
          {t('SECURITY.recoveryCodes.copyAll')}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="cmn-btn s1-bg radius12 fw_600 d-inline-flex align-items-center gap-2 py-3 px-5 n0-clr"
        >
          <span className="fw_600 n0-clr">{t('SECURITY.recoveryCodes.done')}</span>
        </button>
      </div>
    </PageShell>
  );
};

/* ─── Disable View ─── */

const DisableView = ({
  disableCode,
  isDisabling,
  onBack,
  onCodeComplete,
  onDisable,
}: {
  disableCode: string;
  isDisabling: boolean;
  onBack: () => void;
  onCodeComplete: (val: string) => void;
  onDisable: (e?: React.FormEvent) => void;
}) => {
  const { t } = useTranslation();

  return (
    <PageShell>
      <BackHeader onBack={onBack} title={t('SECURITY.disable.title')} />

      <div
        className="radius12 p-4 d-flex gap-3 mb-6"
        style={{ background: 'rgba(254, 68, 69, 0.08)', border: '1px solid rgba(254, 68, 69, 0.2)' }}
      >
        <WarningIcon weight="bold" size={22} style={{ color: 'var(--act1)', flexShrink: 0, marginTop: '2px' }} />
        <p className="fs-seven" style={{ color: 'var(--act1)', lineHeight: '1.5' }}>
          {t('SECURITY.disable.warning')}
        </p>
      </div>

      <p className="n3-clr fs-seven mb-6" style={{ lineHeight: '1.6' }}>
        {t('SECURITY.disable.enterCode')}
      </p>

      <form onSubmit={onDisable}>
        <div className="d-flex justify-content-start mb-5">
          <OtpField value={disableCode} onChange={onCodeComplete} disabled={isDisabling} />
        </div>
        <div className="d-flex gap-3 flex-wrap">
          <button
            type="button"
            onClick={onBack}
            className="cmn-btn radius12 fw_600 d-inline-flex align-items-center gap-2 py-3 px-5"
            style={{ background: 'var(--bg2)', border: '1px solid var(--borderd)', color: 'var(--n0)' }}
          >
            {t('SECURITY.cancel')}
          </button>
          <button
            type="submit"
            disabled={isDisabling || disableCode.length !== 6}
            className="cmn-btn radius12 fw_600 d-inline-flex align-items-center gap-2 py-3 px-5"
            style={{
              background: 'rgba(254, 68, 69, 0.15)',
              border: '1px solid rgba(254, 68, 69, 0.3)',
              color: 'var(--act1)',
            }}
          >
            {isDisabling ? t('SECURITY.disabling') : t('SECURITY.confirmDisable')}
          </button>
        </div>
      </form>
    </PageShell>
  );
};

/* ─── Regenerate Recovery Codes View ─── */

const RegenerateView = ({
  regenerateCode,
  isRegenerating,
  onBack,
  onCodeComplete,
  onRegenerate,
}: {
  regenerateCode: string;
  isRegenerating: boolean;
  onBack: () => void;
  onCodeComplete: (val: string) => void;
  onRegenerate: (e?: React.FormEvent) => void;
}) => {
  const { t } = useTranslation();

  return (
    <PageShell>
      <BackHeader onBack={onBack} title={t('SECURITY.regenerate.title')} />

      <div
        className="radius12 p-4 d-flex gap-3 mb-6"
        style={{ background: 'rgba(254, 201, 47, 0.1)', border: '1px solid rgba(254, 201, 47, 0.3)' }}
      >
        <WarningIcon weight="bold" size={22} style={{ color: 'var(--act3)', flexShrink: 0, marginTop: '2px' }} />
        <p className="fs-seven" style={{ color: 'var(--act3)', lineHeight: '1.5' }}>
          {t('SECURITY.regenerate.warning')}
        </p>
      </div>

      <p className="n3-clr fs-seven mb-6" style={{ lineHeight: '1.6' }}>
        {t('SECURITY.regenerate.enterCode')}
      </p>

      <form onSubmit={onRegenerate}>
        <div className="d-flex justify-content-start mb-5">
          <OtpField value={regenerateCode} onChange={onCodeComplete} disabled={isRegenerating} />
        </div>
        <div className="d-flex gap-3 flex-wrap">
          <button
            type="button"
            onClick={onBack}
            className="cmn-btn radius12 fw_600 d-inline-flex align-items-center gap-2 py-3 px-5"
            style={{ background: 'var(--bg2)', border: '1px solid var(--borderd)', color: 'var(--n0)' }}
          >
            {t('SECURITY.cancel')}
          </button>
          <button
            type="submit"
            disabled={isRegenerating || regenerateCode.length !== 6}
            className="cmn-btn s1-bg radius12 fw_600 d-inline-flex align-items-center gap-2 py-3 px-5 n0-clr"
          >
            <span className="fw_600 n0-clr">
              {isRegenerating ? t('SECURITY.regenerating') : t('SECURITY.regenerate.confirm')}
            </span>
          </button>
        </div>
      </form>
    </PageShell>
  );
};

/* ─── Main Component ─── */

const SecuritySection = () => {
  const { t } = useTranslation();
  const showNotification = useNotificationStore(state => state.show);

  const twoFa = useSetup2Fa();

  const handleCopy = (text: string) => {
    copyText(text, () => showNotification('success', t('SECURITY.notifications.copied'), ''));
  };

  const handleCopyAll = () => {
    copyText(twoFa.recoveryCodes.join('\n'), () =>
      showNotification('success', t('SECURITY.notifications.allCodesCopied'), '')
    );
  };

  if (twoFa.isStatusLoading) {
    return (
      <PageShell>
        <div className="d-flex justify-content-center align-items-center py-10">
          <div className="spinner-border" style={{ color: 'var(--s1)' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </PageShell>
    );
  }

  const views: Record<TwoFactorStep, React.ReactNode> = {
    status: (
      <StatusView
        isEnabled={twoFa.isEnabled}
        recoveryCodesRemaining={twoFa.recoveryCodesRemaining}
        isSetupLoading={twoFa.isSetupLoading}
        onStartSetup={twoFa.handleStartSetup}
        onShowDisable={twoFa.handleShowDisable}
        onShowRegenerate={twoFa.handleShowRegenerate}
      />
    ),
    setup: (
      <SetupView
        setupData={twoFa.setupData}
        verifyCode={twoFa.verifyCode}
        isEnabling={twoFa.isEnabling}
        onBack={twoFa.handleBackToStatus}
        onCodeComplete={twoFa.handleCodeComplete}
        onVerify={twoFa.handleVerifyAndEnable}
        onCopy={handleCopy}
      />
    ),
    verify: (
      <SetupView
        setupData={twoFa.setupData}
        verifyCode={twoFa.verifyCode}
        isEnabling={twoFa.isEnabling}
        onBack={twoFa.handleBackToStatus}
        onCodeComplete={twoFa.handleCodeComplete}
        onVerify={twoFa.handleVerifyAndEnable}
        onCopy={handleCopy}
      />
    ),
    'recovery-codes': (
      <RecoveryCodesView
        codes={twoFa.recoveryCodes}
        onBack={twoFa.handleBackToStatus}
        onCopy={handleCopy}
        onCopyAll={handleCopyAll}
      />
    ),
    disable: (
      <DisableView
        disableCode={twoFa.disableCode}
        isDisabling={twoFa.isDisabling}
        onBack={twoFa.handleBackToStatus}
        onCodeComplete={twoFa.handleDisableCodeComplete}
        onDisable={twoFa.handleDisable}
      />
    ),
    regenerate: (
      <RegenerateView
        regenerateCode={twoFa.regenerateCode}
        isRegenerating={twoFa.isRegenerating}
        onBack={twoFa.handleBackToStatus}
        onCodeComplete={twoFa.handleRegenerateCodeComplete}
        onRegenerate={twoFa.handleRegenerateCodes}
      />
    ),
  };

  return views[twoFa.step] ?? null;
};

export default SecuritySection;
