'use client';
import resetPasswordImage from 'public/images/background/back-register.png';
import logoBlack from 'public/images/logo/cripto-jackpot-logo.png';
import { useResetPasswordForm } from '@/features/auth/hooks/useResetPasswordForm';
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const ResetPasswordSection = () => {
  const { t } = useTranslation();
  const {
    formData,
    email,
    isPasswordShow,
    isConfirmPasswordShow,
    isLoading,
    handleInputChange,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleSubmit,
  } = useResetPasswordForm();

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
                  <h3 className="n3-clr mb-3">{t('RESET_PASSWORD.title')}</h3>
                  <span className="n3-clr fs-seven">{t('RESET_PASSWORD.description')}</span>
                  {email && (
                    <div className="mt-3">
                      <span className="n3-clr fs-seven fw_600">
                        {t('RESET_PASSWORD.emailLabel')}: <span className="s1-clr">{email}</span>
                      </span>
                    </div>
                  )}
                </div>
                <form onSubmit={handleSubmit} className="form-cmn-action">
                  <div className="row g-6">
                    <div className="col-lg-12">
                      <div className="form-cmn">
                        <input
                          type="text"
                          name="securityCode"
                          value={formData.securityCode}
                          onChange={handleInputChange}
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={6}
                          pattern="\d{6}"
                          placeholder={t('RESET_PASSWORD.securityCodePlaceholder')}
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="position-relative">
                        <div className="form-cmn">
                          <input
                            type={isPasswordShow ? 'text' : 'password'}
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className="password-field"
                            placeholder={t('RESET_PASSWORD.newPasswordPlaceholder')}
                            style={{ paddingRight: '45px' }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          aria-label={isPasswordShow ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                          style={{
                            cursor: 'pointer',
                            position: 'absolute',
                            right: '15px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 100,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: 'auto',
                            background: 'transparent',
                            border: 'none',
                            padding: 0,
                          }}
                        >
                          {isPasswordShow ? (
                            <EyeIcon size={20} weight="bold" style={{ color: '#ffffff' }} />
                          ) : (
                            <EyeSlashIcon size={20} weight="bold" style={{ color: '#ffffff' }} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="position-relative">
                        <div className="form-cmn">
                          <input
                            type={isConfirmPasswordShow ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="password-field"
                            placeholder={t('RESET_PASSWORD.confirmPasswordPlaceholder')}
                            style={{ paddingRight: '45px' }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={toggleConfirmPasswordVisibility}
                          aria-label={isConfirmPasswordShow ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                          style={{
                            cursor: 'pointer',
                            position: 'absolute',
                            right: '15px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 100,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: 'auto',
                            background: 'transparent',
                            border: 'none',
                            padding: 0,
                          }}
                        >
                          {isConfirmPasswordShow ? (
                            <EyeIcon size={20} weight="bold" style={{ color: '#ffffff' }} />
                          ) : (
                            <EyeSlashIcon size={20} weight="bold" style={{ color: '#ffffff' }} />
                          )}
                        </button>
                      </div>
                    </div>
                    <Link
                      href="/login"
                      className="d-flex text-decoration-underline act4-texthover justify-content-end fw_600 fs-eight mt-xxl-6 mt-3 s1-texthover"
                    >
                      {t('RESET_PASSWORD.backToLogin')}
                    </Link>
                    <div className="col-lg-12">
                      <button
                        type="submit"
                        className="cmn-btn s1-bg radius12 w-100 fw_600 justify-content-center d-inline-flex align-items-center gap-2 py-xxl-4 py-3 px-xl-6 px-5 n0-clr mt-1"
                        disabled={isLoading}
                      >
                        <span className="fw_600 n0-clr">
                          {isLoading ? t('RESET_PASSWORD.loading') : t('RESET_PASSWORD.resetButton')}
                        </span>
                      </button>
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
                  src={resetPasswordImage}
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

export default ResetPasswordSection;
export interface ResetPasswordRequest {
    email: string;
    securityCode: string;
    newPassword: string;
}

