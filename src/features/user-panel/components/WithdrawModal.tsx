'use client';

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import OtpInput from 'react-otp-input';
import { useWithdraw, WithdrawStep } from '@/features/user-panel/hooks/useWithdraw';
import { CheckCircle } from '@phosphor-icons/react/dist/ssr';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const withdraw = useWithdraw(onClose);
  const { handleClose } = withdraw;

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 9999, backdropFilter: 'blur(4px)' }}
      onClick={e => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="radius24 p-xxl-8 p-xl-6 p-4 position-relative"
        style={{
          maxWidth: '480px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--bg2)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Close button */}
        <button
          type="button"
          className="position-absolute top-0 end-0 mt-3 me-3 border-0 bg-transparent n0-clr fs-three"
          onClick={withdraw.handleClose}
          aria-label="Close"
        >
          ✕
        </button>

        {withdraw.step === 'amount' && <AmountStep withdraw={withdraw} t={t} />}
        {withdraw.step === 'verification' && <VerificationStep withdraw={withdraw} t={t} />}
        {withdraw.step === 'success' && <SuccessStep withdraw={withdraw} t={t} />}
      </div>
    </div>
  );
};

function AmountStep({
  withdraw,
  t,
}: {
  withdraw: ReturnType<typeof useWithdraw>;
  t: (key: string, opts?: Record<string, unknown>) => string;
}) {
  return (
    <>
      <h4 className="n0-clr mb-5">{t('WITHDRAWAL.title')}</h4>

      {/* Available balance */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <span style={{ color: 'rgba(255,255,255,0.55)' }} className="fw_600">
          {t('WITHDRAWAL.availableBalance')}
        </span>
        <span className="n0-clr fw_700">${withdraw.availableBalance.toFixed(2)}</span>
      </div>

      {/* Amount input */}
      <div className="mb-4">
        <label style={{ color: 'rgba(255,255,255,0.55)' }} className="fw_600 mb-2 d-block">
          {t('WITHDRAWAL.amountLabel')}
        </label>
        <div className="position-relative">
          <span
            className="position-absolute top-50 translate-middle-y ms-3 fw_700 fs-five"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            $
          </span>
          <input
            type="number"
            className="w-100 radius12 py-3 pe-3 fw_600"
            style={{
              paddingLeft: '2rem',
              background: 'rgba(255,255,255,0.07)',
              border: '1.5px solid rgba(255,255,255,0.12)',
              color: 'var(--n0)',
              outline: 'none',
            }}
            placeholder="0.00"
            min={10}
            step="0.01"
            value={withdraw.amount}
            onChange={e => withdraw.setAmount(e.target.value)}
          />
        </div>
        {withdraw.amountError && <p className="text-danger mt-1 mb-0 fs-seven">{withdraw.amountError}</p>}
        <p style={{ color: 'rgba(255,255,255,0.4)' }} className="mt-1 mb-0 fs-seven">
          {t('WITHDRAWAL.minAmount', { min: 10 })}
        </p>
      </div>

      {/* Wallet selector */}
      <div className="mb-5">
        <label style={{ color: 'rgba(255,255,255,0.55)' }} className="fw_600 mb-2 d-block">
          {t('WITHDRAWAL.walletLabel')}
        </label>
        {withdraw.isLoadingWallets ? (
          <p style={{ color: 'rgba(255,255,255,0.55)' }}>{t('WITHDRAWAL.loadingWallets')}</p>
        ) : withdraw.wallets.length === 0 ? (
          <p className="text-warning fs-seven">{t('WITHDRAWAL.noWallets')}</p>
        ) : (
          <select
            className="w-100 radius12 py-3 px-3 fw_600 withdraw-wallet-select"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1.5px solid rgba(255,255,255,0.12)',
              color: 'var(--n0)',
              outline: 'none',
            }}
            value={withdraw.selectedWalletGuid}
            onChange={e => withdraw.setSelectedWalletGuid(e.target.value)}
          >
            <option value="">{t('WITHDRAWAL.selectWallet')}</option>
            {withdraw.wallets.map(w => (
              <option key={w.walletGuid} value={w.walletGuid}>
                {w.label} ({w.currencySymbol}) - {w.address.slice(0, 8)}...{w.address.slice(-6)}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Continue button */}
      <button
        type="button"
        className="cmn-btn w-100 py-3 radius12 fw_700"
        style={{ backgroundColor: 'var(--p1)', color: '#000' }}
        disabled={!withdraw.canProceedToVerification}
        onClick={withdraw.handleContinue}
      >
        {t('WITHDRAWAL.continue')}
      </button>
    </>
  );
}

function VerificationStep({
  withdraw,
  t,
}: {
  withdraw: ReturnType<typeof useWithdraw>;
  t: (key: string, opts?: Record<string, unknown>) => string;
}) {
  return (
    <>
      <button
        type="button"
        className="border-0 bg-transparent mb-3 d-flex align-items-center gap-1"
        style={{ color: 'rgba(255,255,255,0.6)' }}
        onClick={withdraw.handleBack}
      >
        ← {t('WITHDRAWAL.back')}
      </button>

      <h4 className="n0-clr mb-3">{t('WITHDRAWAL.verifyTitle')}</h4>

      <p style={{ color: 'rgba(255,255,255,0.55)' }} className="mb-4">
        {withdraw.is2FaEnabled ? t('WITHDRAWAL.enter2FaCode') : t('WITHDRAWAL.enterEmailCode')}
      </p>

      {/* Send email code button (only for non-2FA users) */}
      {!withdraw.is2FaEnabled && !withdraw.codeSent && (
        <button
          type="button"
          className="cmn-btn w-100 py-3 radius12 fw_700 mb-4"
          onClick={withdraw.handleSendCode}
          disabled={withdraw.isSendingCode}
        >
          {withdraw.isSendingCode ? t('WITHDRAWAL.sendingCode') : t('WITHDRAWAL.sendCode')}
        </button>
      )}

      {/* OTP input (show for 2FA users always, for email users only after code sent) */}
      {(withdraw.is2FaEnabled || withdraw.codeSent) && (
        <>
          <div className="d-flex justify-content-center mb-4">
            <OtpInput
              value={withdraw.verificationCode}
              onChange={withdraw.setVerificationCode}
              numInputs={6}
              shouldAutoFocus
              inputType="tel"
              renderInput={props => (
                <input
                  {...props}
                  style={{
                    width: '52px',
                    height: '56px',
                    margin: '0 4px',
                    fontSize: '20px',
                    fontWeight: 700,
                    textAlign: 'center',
                    borderRadius: '12px',
                    border: '2px solid rgba(255,255,255,0.2)',
                    backgroundColor: 'rgba(255,255,255,0.07)',
                    color: 'var(--n0)',
                    outline: 'none',
                  }}
                />
              )}
            />
          </div>

          {/* Resend code (email only) */}
          {!withdraw.is2FaEnabled && withdraw.codeSent && (
            <p className="text-center mb-4">
              <button
                type="button"
                className="border-0 bg-transparent s1-clr fw_600"
                onClick={withdraw.handleSendCode}
                disabled={withdraw.isSendingCode}
              >
                {t('WITHDRAWAL.resendCode')}
              </button>
            </p>
          )}

          {/* Summary */}
          <div
            className="radius12 p-3 mb-4"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="d-flex justify-content-between mb-2">
              <span style={{ color: 'rgba(255,255,255,0.55)' }}>{t('WITHDRAWAL.amountLabel')}</span>
              <span className="n0-clr fw_700">${parseFloat(withdraw.amount).toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span style={{ color: 'rgba(255,255,255,0.55)' }}>{t('WITHDRAWAL.walletLabel')}</span>
              <span
                className="n0-clr fw_600"
                style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {withdraw.wallets.find(w => w.walletGuid === withdraw.selectedWalletGuid)?.label ?? ''}
              </span>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="button"
            className="cmn-btn w-100 py-3 radius12 fw_700"
            style={{ backgroundColor: 'var(--p1)', color: '#000' }}
            disabled={withdraw.verificationCode.length !== 6 || withdraw.isSubmitting}
            onClick={withdraw.handleSubmit}
          >
            {withdraw.isSubmitting ? t('WITHDRAWAL.processing') : t('WITHDRAWAL.confirm')}
          </button>
        </>
      )}
    </>
  );
}

function SuccessStep({
  withdraw,
  t,
}: {
  withdraw: ReturnType<typeof useWithdraw>;
  t: (key: string, opts?: Record<string, unknown>) => string;
}) {
  return (
    <div className="text-center py-4">
      <CheckCircle size={64} weight="fill" className="s1-clr mb-4" />
      <h4 className="n0-clr mb-3">{t('WITHDRAWAL.successTitle')}</h4>
      <p style={{ color: 'rgba(255,255,255,0.55)' }} className="mb-5">
        {t('WITHDRAWAL.successMessage')}
      </p>
      <button type="button" className="cmn-btn w-100 py-3 radius12 fw_700" onClick={withdraw.handleClose}>
        {t('WITHDRAWAL.close')}
      </button>
    </div>
  );
}

export default WithdrawModal;
