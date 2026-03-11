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
        className="n0-bg radius24 p-xxl-8 p-xl-6 p-4 position-relative"
        style={{ maxWidth: '480px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Close button */}
        <button
          type="button"
          className="position-absolute top-0 end-0 mt-3 me-3 border-0 bg-transparent n4-clr fs-three"
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

function AmountStep({ withdraw, t }: { withdraw: ReturnType<typeof useWithdraw>; t: (key: string, opts?: Record<string, unknown>) => string }) {
  return (
    <>
      <h4 className="n4-clr mb-5">{t('WITHDRAWAL.title')}</h4>

      {/* Available balance */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <span className="n3-clr fw_600">{t('WITHDRAWAL.availableBalance')}</span>
        <span className="n4-clr fw_700">${withdraw.availableBalance.toFixed(2)}</span>
      </div>

      {/* Amount input */}
      <div className="mb-4">
        <label className="n3-clr fw_600 mb-2 d-block">{t('WITHDRAWAL.amountLabel')}</label>
        <div className="position-relative">
          <span className="position-absolute top-50 translate-middle-y ms-3 n3-clr fw_700 fs-five">$</span>
          <input
            type="number"
            className="w-100 n11-bg border radius12 py-3 pe-3 n4-clr fw_600"
            style={{ paddingLeft: '2rem' }}
            placeholder="0.00"
            min={10}
            step="0.01"
            value={withdraw.amount}
            onChange={e => withdraw.setAmount(e.target.value)}
          />
        </div>
        {withdraw.amountError && (
          <p className="text-danger mt-1 mb-0 fs-seven">{withdraw.amountError}</p>
        )}
        <p className="n3-clr mt-1 mb-0 fs-seven">
          {t('WITHDRAWAL.minAmount', { min: 10 })}
        </p>
      </div>

      {/* Wallet selector */}
      <div className="mb-5">
        <label className="n3-clr fw_600 mb-2 d-block">{t('WITHDRAWAL.walletLabel')}</label>
        {withdraw.isLoadingWallets ? (
          <p className="n3-clr">{t('WITHDRAWAL.loadingWallets')}</p>
        ) : withdraw.wallets.length === 0 ? (
          <p className="text-warning fs-seven">{t('WITHDRAWAL.noWallets')}</p>
        ) : (
          <select
            className="w-100 n11-bg border radius12 py-3 px-3 n4-clr fw_600"
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
        disabled={!withdraw.canProceedToVerification}
        onClick={withdraw.handleContinue}
      >
        {t('WITHDRAWAL.continue')}
      </button>
    </>
  );
}

function VerificationStep({ withdraw, t }: { withdraw: ReturnType<typeof useWithdraw>; t: (key: string, opts?: Record<string, unknown>) => string }) {
  return (
    <>
      <button
        type="button"
        className="border-0 bg-transparent n3-clr mb-3 d-flex align-items-center gap-1"
        onClick={withdraw.handleBack}
      >
        ← {t('WITHDRAWAL.back')}
      </button>

      <h4 className="n4-clr mb-3">{t('WITHDRAWAL.verifyTitle')}</h4>

      <p className="n3-clr mb-4">
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
              inputType="number"
              renderInput={props => (
                <input
                  {...props}
                  style={{
                    width: '48px',
                    height: '56px',
                    margin: '0 4px',
                    fontSize: '20px',
                    fontWeight: 700,
                    textAlign: 'center',
                    borderRadius: '12px',
                    border: '2px solid #333',
                    backgroundColor: 'transparent',
                    color: 'var(--n4)',
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
          <div className="n11-bg radius12 p-3 mb-4">
            <div className="d-flex justify-content-between mb-2">
              <span className="n3-clr">{t('WITHDRAWAL.amountLabel')}</span>
              <span className="n4-clr fw_700">${parseFloat(withdraw.amount).toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="n3-clr">{t('WITHDRAWAL.walletLabel')}</span>
              <span className="n4-clr fw_600" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {withdraw.wallets.find(w => w.walletGuid === withdraw.selectedWalletGuid)?.label ?? ''}
              </span>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="button"
            className="cmn-btn w-100 py-3 radius12 fw_700"
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

function SuccessStep({ withdraw, t }: { withdraw: ReturnType<typeof useWithdraw>; t: (key: string, opts?: Record<string, unknown>) => string }) {
  return (
    <div className="text-center py-4">
      <CheckCircle size={64} weight="fill" className="s1-clr mb-4" />
      <h4 className="n4-clr mb-3">{t('WITHDRAWAL.successTitle')}</h4>
      <p className="n3-clr mb-5">{t('WITHDRAWAL.successMessage')}</p>
      <button
        type="button"
        className="cmn-btn w-100 py-3 radius12 fw_700"
        onClick={withdraw.handleClose}
      >
        {t('WITHDRAWAL.close')}
      </button>
    </div>
  );
}

export default WithdrawModal;
