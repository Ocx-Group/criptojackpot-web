'use client';

import logoBlack from 'public/images/logo/cripto-jackpot-logo.png';
import loginImage from 'public/images/background/back-register.png';
import { useVerify2Fa } from '@/features/auth/hooks/useVerify2Fa';
import Image from 'next/image';
import Link from 'next/link';
import OtpInput from 'react-otp-input';
import { useTranslation } from 'react-i18next';

const TwoFactorSection = () => {
  const { t } = useTranslation();
  const {
    code,
    recoveryCode,
    setRecoveryCode,
    useRecoveryCode,
    setUseRecoveryCode,
    isLoading,
    handleSubmit,
    handleCodeComplete,
  } = useVerify2Fa();

  return (
    <section className="login-section position-relative">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-4 col-md-8 col-11">
            <div className="left-logwrap d-center">
              <div className="authentication-cmn">
                <div className="container">
                  <Link href="/public" className="text-center mb-xxl-10 d-block">
                    <Image src={logoBlack} alt="img" />
                  </Link>
                </div>
                <div className="log-title mb-xxl-10 mb-xl-7 mb-6">
                  <h4 className="n4-clr fw_700 mb-2">{t('TWO_FACTOR.title', 'Verificación en dos pasos')}</h4>
                  <span className="n3-clr fs-seven">
                    {useRecoveryCode
                      ? t('TWO_FACTOR.recoveryDescription', 'Ingresa uno de tus códigos de recuperación')
                      : t('TWO_FACTOR.description', 'Ingresa el código de 6 dígitos de tu aplicación de autenticación')}
                  </span>
                </div>
                <form onSubmit={handleSubmit} className="form-cmn-action">
                  <div className="row g-6">
                    {!useRecoveryCode ? (
                      <div className="col-lg-12">
                        <div className="d-flex justify-content-center">
                          <OtpInput
                            value={code}
                            onChange={handleCodeComplete}
                            numInputs={6}
                            shouldAutoFocus
                            inputType="number"
                            renderInput={props => (
                              <input
                                {...props}
                                style={{
                                  width: '52px',
                                  height: '58px',
                                  margin: '0 5px',
                                  padding: '0',
                                  fontSize: '22px',
                                  fontWeight: 700,
                                  lineHeight: '58px',
                                  borderRadius: '12px',
                                  border: '2px solid rgba(255,255,255,0.25)',
                                  background: 'rgba(255,255,255,0.1)',
                                  color: 'var(--nw2)',
                                  textAlign: 'center',
                                  outline: 'none',
                                  overflow: 'visible',
                                  transition: 'border-color 0.2s, box-shadow 0.2s',
                                  caretColor: 'var(--s1)',
                                }}
                                onFocus={e => {
                                  e.target.style.borderColor = 'var(--s1)';
                                  e.target.style.boxShadow = '0 0 0 3px rgba(85, 74, 255, 0.25)';
                                }}
                                onBlur={e => {
                                  e.target.style.borderColor = 'rgba(255,255,255,0.25)';
                                  e.target.style.boxShadow = 'none';
                                }}
                              />
                            )}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="col-lg-12">
                        <div className="form-cmn">
                          <input
                            type="text"
                            value={recoveryCode}
                            onChange={e => setRecoveryCode(e.target.value)}
                            placeholder={t('TWO_FACTOR.recoveryCodePlaceholder', 'XXXX-XXXX')}
                            maxLength={9}
                            style={{
                              textAlign: 'center',
                              letterSpacing: '2px',
                              fontSize: '18px',
                              color: 'var(--nw2)',
                              background: 'rgba(255,255,255,0.1)',
                              border: '2px solid rgba(255,255,255,0.25)',
                              borderRadius: '12px',
                              padding: '14px 18px',
                              outline: 'none',
                              width: '100%',
                              caretColor: 'var(--s1)',
                            }}
                            autoFocus
                          />
                        </div>
                      </div>
                    )}
                    <div className="col-lg-12">
                      <button
                        type="submit"
                        className="cmn-btn s1-bg radius12 w-100 fw_600 justify-content-center d-inline-flex align-items-center gap-2 py-xxl-4 py-3 px-xl-6 px-5 n0-clr mt-1"
                        disabled={isLoading}
                      >
                        <span className="fw_600 n0-clr">
                          {isLoading ? t('LOGIN.loading') : t('TWO_FACTOR.verify', 'Verificar')}
                        </span>
                      </button>
                    </div>
                    <div className="col-lg-12 text-center">
                      <button
                        type="button"
                        onClick={() => setUseRecoveryCode(!useRecoveryCode)}
                        className="n3-clr fs-eight s1-texthover"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        {useRecoveryCode
                          ? t('TWO_FACTOR.useAuthenticator', 'Usar código de autenticador')
                          : t('TWO_FACTOR.useRecoveryCode', 'Usar código de recuperación')}
                      </button>
                    </div>
                    <div className="col-lg-12 text-center mt-3">
                      <Link href="/login" className="n3-clr fs-eight s1-texthover text-decoration-underline">
                        {t('TWO_FACTOR.backToLogin', 'Volver al inicio de sesión')}
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="log-thumbwrap">
              <div className="thumb">
                <Image
                  src={loginImage}
                  alt="img"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TwoFactorSection;
